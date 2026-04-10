import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  phone: string;
  address: string;
  couponCode?: string;
  discountAmount: number;
  cancelReason?: string;
  cancelledAt?: Date;
  totalAmount: number;
  orderStatus: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid";
  expiresAt?: Date;
  createdAt: Date;
}


const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    phone: { type: String, required: true },
    address: { type: String, required: true },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    cancelReason: { type: String },
    cancelledAt: { type: Date },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "COD" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    expiresAt: { type: Date, index: { expires: 0 } },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


// This ensures the model is refreshed if the schema changes in development
export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
