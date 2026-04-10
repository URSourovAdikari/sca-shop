import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItem {
  productId: string; // The custom string ID used in frontend
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
}

const CartSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
