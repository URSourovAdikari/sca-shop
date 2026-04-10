import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Cart } from "@/models/Cart";

// GET /api/cart - Fetch current user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const cart = await Cart.findOne({ userId: session.user.id });

    return NextResponse.json(cart ? cart.items : []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/cart - Update current user's cart (Overwrite entire cart)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json(); // Array of { productId, quantity }

    await connectToDatabase();
    const cart = await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { items },
      { upsert: true, returnDocument: 'after' }
    );


    return NextResponse.json(cart.items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
