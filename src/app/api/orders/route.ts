import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/models/Cart";
import { Order } from "@/models/Order";
import { ProductModel } from "@/models/Products";

import { CouponModel } from "@/models/Coupon";


// GET: Fetch all orders for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Place a new order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phone, address, couponCode } = await req.json();

    if (!phone || !address) {
      return NextResponse.json(
        { error: "Phone and Address are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1. Fetch user's cart
    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Fetch product details
    const productIds = cart.items.map((i: any) => i.productId);
    const dbProducts = await ProductModel.find({ id: { $in: productIds } });

    const orderItems = cart.items.map((cartItem: any) => {
      const product = dbProducts.find((p) => p.id === cartItem.productId);
      if (!product) throw new Error(`Product not found: ${cartItem.productId}`);
      
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      };
    });

    // 3. Calculate Subtotal
    const subtotal = orderItems.reduce(
      (acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity,
      0
    );

    // 4. Coupon Logic
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await CouponModel.findOne({ 
        code: couponCode.toUpperCase(), 
        isActive: true 
      });

      if (coupon) {
        // Expiry check (optional but good)
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
          return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
        }

        // Min order check
        if (subtotal < coupon.minOrderAmount) {
          return NextResponse.json({ 
            error: `Minimum order amount of $${coupon.minOrderAmount} required` 
          }, { status: 400 });
        }

        if (coupon.discountType === "percentage") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
      } else {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }
    }

    const totalAmount = subtotal - discountAmount;

    // 5. Create Order
    const newOrder = await Order.create({
      userId: session.user.id,
      items: orderItems,
      phone,
      address,
      couponCode: couponCode?.toUpperCase(),
      discountAmount,
      totalAmount,
      orderStatus: "pending",
      paymentMethod: "COD",
      paymentStatus: "pending",
    });

    // 6. Clear Cart
    await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { items: [] }
    );

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
      totalAmount: newOrder.totalAmount,
      address: newOrder.address,
      phone: newOrder.phone,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
