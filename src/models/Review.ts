import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReply {
  adminId: Types.ObjectId;
  adminName: string;
  comment: string;
  createdAt: Date;
}

export interface IReview extends Document {
  userId: Types.ObjectId;
  userName: string;
  userImage?: string;
  productId: string;
  rating: number;
  comment: string;
  likes: Types.ObjectId[]; // Array of User IDs who liked the review
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  adminName: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userImage: { type: String },
    productId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [ReplySchema]
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
