import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const userIdNum = parseInt(payload.userId);
    
    if (isNaN(parseInt(postId))) {
      return NextResponse.json({ error: "Valid Post ID is required" }, { status: 400 });
    }

    const postIdNum = parseInt(postId);
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: userIdNum,
          postId: postIdNum
        }
      }
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: userIdNum,
            postId: postIdNum
          }
        }
      });
      
      await prisma.post.update({
        where: { id: postIdNum },
        data: {
          likes: {
            decrement: 1
          }
        }
      });
      
      return NextResponse.json({ 
        message: "Post unliked successfully",
        isLiked: false,
        likes: await getPostLikesCount(postIdNum)
      });
    } else {
      const like = await prisma.postLike.create({
        data: {
          userId: userIdNum,
          postId: postIdNum,
        },
      });

      await prisma.post.update({
        where: { id: postIdNum },
        data: {
          likes: {
            increment: 1
          }
        }
      });
      
      return NextResponse.json({ 
        message: "Post liked successfully", 
        like,
        isLiked: true,
        likes: await getPostLikesCount(postIdNum)
      }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: "Already liked" }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getPostLikesCount(postId: number): Promise<number> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { likes: true },
  });
  return post?.likes || 0;
}
