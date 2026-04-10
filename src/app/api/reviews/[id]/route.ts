import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/models/Review";

// PATCH: Update a review or Like/Reply logic if specified in body
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const { action, comment, rating } = body;

    await connectToDatabase();
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Liked logic
    if (action === "like") {
      const userId = session.user.id;
      const index = review.likes.findIndex((uid: any) => uid.toString() === userId);
      
      if (index > -1) {
        // Unlike if already liked
        review.likes.splice(index, 1);
      } else {
        // Like if not already liked
        review.likes.push(userId as any);
      }
      await review.save();
      return NextResponse.json(review);
    }


    // Admin Reply logic
    if (action === "reply") {
      if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Only admins can reply" }, { status: 403 });
      }
      review.replies.push({
        adminId: session.user.id as any,
        adminName: session.user.name as string,
        comment: comment,
        createdAt: new Date()
      });
      await review.save();
      return NextResponse.json(review);
    }

    // Regular Update logic (User only)
    if (review.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbbiden" }, { status: 403 });
    }

    if (comment) review.comment = comment;
    if (rating) review.rating = rating;

    await review.save();
    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a review
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Only owner or admin can delete
    if (review.userId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ message: "Review deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
