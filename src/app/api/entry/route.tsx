import { generateSlug, verifyToken } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { linkSchema } from "@/utils/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { app_url, play_url } = await req.json();
    if (!app_url || !play_url) {
      return NextResponse.json("Bad Request", { status: 400 });
    }

    if (linkSchema.safeParse(app_url).success === false) {
      return NextResponse.json("Invalid app store link", { status: 400 });
    }

    if (linkSchema.safeParse(play_url).success === false) {
      return NextResponse.json("Invalid play store link", { status: 400 });
    }

    const authToken = req.headers.get("authorization")?.split(" ")[1];

    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { userId } = verifyToken(authToken);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const qr = await prisma.qr.create({
      data: {
        app_store_url: app_url,
        play_store_url: play_url,
        user_id: userId,
        slug: generateSlug(),
        clicks: 0,
      },
    });

    return NextResponse.json({ qr: qr }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const authToken = req.headers.get("authorization")?.split(" ")[1];
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { userId } = verifyToken(authToken);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    let qr;
    if (id) {
      qr = await prisma.qr.findMany({
        where: {
          id: id,
          user: {
            id: userId,
          },
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
    }

    qr = await prisma.qr.findMany({
      where: {
        user: {
          id: userId,
        },
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

    return NextResponse.json({ qr }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
