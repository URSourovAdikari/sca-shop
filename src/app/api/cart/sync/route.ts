import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Cart, ICartItem } from "@/models/Cart";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { localItems } = await req.json(); 

    await connectToDatabase();
    let dbCart = await Cart.findOne({ userId: session.user.id });

    if (!dbCart) {
      dbCart = await Cart.create({
        userId: session.user.id,
        items: localItems.map((item: any) => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
        })),
      });
    } else {
      // Merge logic
      const mergedItems: ICartItem[] = [...dbCart.items];

      localItems.forEach((localItem: any) => {
        const pId = localItem.id || localItem.productId;
        const existingItemIndex = mergedItems.findIndex(
          (item) => item.productId === pId
        );
        
        if (existingItemIndex > -1) {
          mergedItems[existingItemIndex].quantity += localItem.quantity;
        } else {
          mergedItems.push({
            productId: pId,
            quantity: localItem.quantity,
          });
        }
      });

      dbCart.items = mergedItems;
      await dbCart.save();
    }

    return NextResponse.json(dbCart.items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
