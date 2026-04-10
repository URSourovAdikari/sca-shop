import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";

// GET: Fetch single order details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: Ensure order belongs to user
    if (order.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Cancel an order
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { cancelReason } = await req.json();

    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security: Check if order belongs to the user
    if (order.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Cancellation Rules
    if (order.orderStatus !== "pending") {
      return NextResponse.json(
        { error: `Cannot cancel order in ${order.orderStatus} status` },
        { status: 400 }
      );
    }

    // 30-minute time limit
    const limitInMs = 30 * 60 * 1000;
    const orderCreatedAt = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();

    if (currentTime - orderCreatedAt > limitInMs) {
      return NextResponse.json(
        { error: "Cancellation period (30 minutes) has expired." },
        { status: 400 }
      );
    }

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + 60); // Default to 1 min for cancellation

    // Check if this is the latest pending order for the user
    const latestOrder = await Order.findOne({ userId: session.user.id, orderStatus: "pending" })
      .sort({ createdAt: -1 })
      .select("_id");

    const isLatest = latestOrder?._id.toString() === id;

    if (isLatest) {
      // If latest is cancelled, cancel all other pending orders too
      const result = await Order.updateMany(
        { userId: session.user.id, orderStatus: "pending" },
        {
          orderStatus: "cancelled",
          cancelReason: cancelReason || "Cancelled by user (Latest order cancellation triggered bulk cleanup)",
          cancelledAt: new Date(),
          expiresAt: expiryDate
        },
        { runValidators: false }
      );

      return NextResponse.json({
        success: true,
        message: `Latest order cancelled. ${result.modifiedCount} pending order(s) cleared.`,
        status: "cancelled",
      });
    } else {
      // Just cancel this specific old order
      await Order.findByIdAndUpdate(id, {
        orderStatus: "cancelled",
        cancelReason: cancelReason || "Cancelled by user",
        cancelledAt: new Date(),
        expiresAt: expiryDate
      }, { runValidators: false });

      return NextResponse.json({
        success: true,
        message: "Order cancelled.",
        status: "cancelled",
      });
    }




  } catch (error: any) {
    console.error("Order cancellation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
