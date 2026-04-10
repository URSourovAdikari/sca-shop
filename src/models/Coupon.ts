import mongoose, { Schema } from "mongoose";

export interface ICoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  expiryDate?: Date;
  isActive: boolean;
}

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const CouponModel = mongoose.models?.Coupon || mongoose.model("Coupon", couponSchema);
