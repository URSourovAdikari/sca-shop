import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Wishlist } from "@/models/Wishlist";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { localItems } = await req.json(); 

    await connectToDatabase();
    
    const operations = localItems.map((item: any) => {
        const pId = item.id || item.productId || (typeof item === 'string' ? item : null);
        if (!pId) return null;
        return {
            updateOne: {
                filter: { userId: session.user.id, productId: pId },
                update: { userId: session.user.id, productId: pId },
                upsert: true
            }
        };
    }).filter(Boolean);

    if (operations.length > 0) {
        await Wishlist.bulkWrite(operations);
    }

    const dbItems = await Wishlist.find({ userId: session.user.id });
    return NextResponse.json(dbItems.map(i => i.productId));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
