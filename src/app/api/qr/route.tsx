import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UAParser from "ua-parser-js";
import { NextRequest, NextResponse } from "next/server";
import { VALID_SLUG_LENGTH } from "@/utils/constants";

// export async function GET(req: NextRequest) {
//   const { searchParams } = req.nextUrl
//   const id = searchParams.get("id");
//   if (!id) {
//     return redirect("/404");
//   }
//   const headers = req.headers;
//   const userAgent = headers.get("user-agent");
//   let parser = new UAParser(userAgent as any);
//   let os = parser.getOS();
//   os.name = os.name || "";
//   const qr = await prisma.qr.findUnique({
//     where: {
//       id,
//     },
//   });
//   if (qr?.app_store_url && qr?.play_store_url) {
//     if (
//       os &&
//       ["ios", "mac os", "macos", "ipad"].includes(os.name.toLowerCase())
//     ) {
//       redirect(`${qr?.app_store_url}`);
//     }
//     redirect(`${qr?.play_store_url}`);
//   } else {
//     redirect("/404");
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    if (!slug || slug.length !== VALID_SLUG_LENGTH) {
      redirect("/404");
    }
    const qr = await prisma.qr.findUnique({
      where: {
        slug,
      },
    });

    if (!qr) {
      redirect("/404");
    }

    const headers = req.headers;
    const userAgent = headers.get("user-agent");
    let parser = new UAParser(userAgent as any);
    let os = parser.getOS();
    os.name = os.name || "";

    if (
      os &&
      ["ios", "mac os", "macos", "ipad"].includes(os.name.toLowerCase())
    ) {
      redirect(`${qr?.app_store_url}`);
    }
    redirect(`${qr?.play_store_url}`);
  } catch (error) {
    console.error(error);
    redirect("/404");
  }
}
