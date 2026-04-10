import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    await connectToDatabase();

    const coupon = await CouponModel.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check min order amount
    if (cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon` 
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = cartTotal * (coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      code: coupon.code,
      discount: Number(discount.toFixed(2)),
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });

  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
