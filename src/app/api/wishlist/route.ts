import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Wishlist } from "@/models/Wishlist";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const items = await Wishlist.find({ userId: session.user.id });

    return NextResponse.json(items.map((i) => i.productId));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    await connectToDatabase();
    await Wishlist.findOneAndUpdate(
      { userId: session.user.id, productId },
      { userId: session.user.id, productId },
      { upsert: true, returnDocument: 'after' }
    );


    const items = await Wishlist.find({ userId: session.user.id });
    return NextResponse.json(items.map((i) => i.productId));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    await Wishlist.deleteOne({ userId: session.user.id, productId });

    const items = await Wishlist.find({ userId: session.user.id });
    return NextResponse.json(items.map((i) => i.productId));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
