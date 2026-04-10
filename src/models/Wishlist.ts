import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  productId: string;
}

const WishlistSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: String, required: true },
  },
  { timestamps: true }
);

// Compound index to prevent duplicates
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);
