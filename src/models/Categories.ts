import mongoose, { Schema } from "mongoose";

export interface CategoryItem {
  name: string;
  count?: number;
  image: string;
  color: string;      // accent colour for active border / glow
  bgGrad: string;     // subtle gradient overlay
}

export const CATEGORIES_DATA: CategoryItem[] = [];


const categorySchema = new Schema({
  name: { type: String, required: true },
  count: { type: Number },
  image: { type: String, required: true },
  color: { type: String, required: true },
  bgGrad: { type: String, required: true }
});

export const CategoryModel = mongoose.models?.Category || mongoose.model("Category", categorySchema);
