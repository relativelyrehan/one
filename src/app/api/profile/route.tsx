import { verifyToken } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.headers.get("authorization")?.split(" ")[1];

    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { userId } = verifyToken(authToken);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        qr: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          email: user.email,
          limit: 5 - user.qr.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}
