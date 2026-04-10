import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ProductModel, PRODUCTS } from "@/models/Products";

export async function GET() {
  try {
    await connectToDatabase();
    let products = await ProductModel.find({}).lean();
    if (products.length === 0) {
      await ProductModel.insertMany(PRODUCTS);
      products = await ProductModel.find({}).lean();
    }
    const data = products.map(p => {
      const doc = p as any;
      doc._id = doc._id.toString();
      return doc;
    });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
