import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storyId, postId } = await request.json();
    const userIdNum = parseInt(payload.userId);
    
    console.log("Like request:", { userId: userIdNum, storyId, postId });
    if (storyId) {
      if (isNaN(parseInt(storyId))) {
        return NextResponse.json({ error: "Valid Story ID is required" }, { status: 400 });
      }

      const storyIdNum = parseInt(storyId);
      const existingLike = await prisma.storyLike.findUnique({
        where: {
          userId_storyId: {
            userId: userIdNum,
            storyId: storyIdNum
          }
        }
      });

      console.log("Story existing like:", existingLike);

      if (existingLike) {
        await prisma.storyLike.delete({
          where: {
            userId_storyId: {
              userId: userIdNum,
              storyId: storyIdNum
            }
          }
        });
        console.log("Story like deleted");
        return NextResponse.json({ message: "Story unliked successfully" });
      } else {
        const like = await prisma.storyLike.create({
          data: {
            userId: userIdNum,
            storyId: storyIdNum,
          },
        });
        console.log("Story like created:", like);
        return NextResponse.json({ message: "Story liked successfully", like }, { status: 201 });
      }
    }
    if (postId) {
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

      console.log("Post existing like:", existingLike);

      if (existingLike) {
        await prisma.postLike.delete({
          where: {
            userId_postId: {
              userId: userIdNum,
              postId: postIdNum
            }
          }
        });
        
        console.log("Post like deleted");
        await prisma.post.update({
          where: { id: postIdNum },
          data: {
            likes: {
              decrement: 1
            }
          }
        });
        
        return NextResponse.json({ message: "Post unliked successfully" });
      } else {
        const like = await prisma.postLike.create({
          data: {
            userId: userIdNum,
            postId: postIdNum,
          },
        });
        
        console.log("Post like created:", like);

        await prisma.post.update({
          where: { id: postIdNum },
          data: {
            likes: {
              increment: 1
            }
          }
        });
        
        return NextResponse.json({ message: "Post liked successfully", like }, { status: 201 });
      }
    }

    return NextResponse.json({ error: "Either storyId or postId is required" }, { status: 400 });
  } catch (error) {
    console.error("Like error:", error);
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
