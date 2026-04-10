import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { CategoryModel, CATEGORIES_DATA } from "@/models/Categories";

export async function GET() {
  try {
    await connectToDatabase();
    let cats = await CategoryModel.find({}).lean();
    if (cats.length === 0) {
      await CategoryModel.insertMany(CATEGORIES_DATA);
      cats = await CategoryModel.find({}).lean();
    }
    const data = cats.map(c => {
      const doc = c as any;
      doc._id = doc._id.toString();
      return doc;
    });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
