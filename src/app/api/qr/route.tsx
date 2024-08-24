import prisma from "@/lib/prisma";
import UAParser from "ua-parser-js";
import { NextRequest, NextResponse } from "next/server";
import { VALID_SLUG_LENGTH } from "@/utils/constants";
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug || slug.length !== VALID_SLUG_LENGTH) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const qrCode = await prisma.qr.findUnique({
      where: {
        slug: slug as string,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
    }

    const headers = req.headers;
    const userAgent = headers.get("user-agent");
    let parser = new UAParser(userAgent as any);
    let os = parser.getOS();
    os.name = os.name || "";

    if (
      ["ios", "mac os", "macos", "ipad"].includes(os.name.toLowerCase()) &&
      qrCode.app_store_url
    ) {
      return NextResponse.redirect(qrCode.app_store_url, { status: 301 });
    } else if (qrCode.play_store_url) {
      return NextResponse.redirect(qrCode.play_store_url, { status: 301 });
    }
    return NextResponse.redirect("/404");
  } catch (e) {
    console.error(e);
  }
}
