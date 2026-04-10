import mongoose, { Schema } from "mongoose";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  stock: number;
  isHot?: boolean;
  prepTime?: string;
  calories?: string;
  weight?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    protein: string;
    carbs: string;
    fats: string;
  };
}

export const PRODUCTS: Product[] = [];

const productSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discountPercent: { type: Number },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  isHot: { type: Boolean },
  prepTime: { type: String },
  calories: { type: String },
  weight: { type: String },
  ingredients: { type: [String] },
  nutritionalInfo: {
    protein: { type: String },
    carbs: { type: String },
    fats: { type: String },
  }
});

export const ProductModel = mongoose.models?.Product || mongoose.model("Product", productSchema);
