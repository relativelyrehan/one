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

    const allQr = await prisma.qr.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      orderBy: {
        clicks: "desc",
      },
      select: {
        id: true,
        app_store_url: true,
        play_store_url: true,
        created_at: true,
        updated_at: true,
        user_id: true,
        slug: true,
        clicks: true,
      },
    });

    const topQrList = allQr.slice(0, 3);
    const totalQr = allQr.length;
    const totalClicks = allQr.reduce((acc, qr) => acc + qr.clicks, 0);

    return NextResponse.json(
      {
        data: {
          totalQr: totalQr,
          totalClicks: totalClicks,
          limit: 5 - totalQr,
          qr: topQrList,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
