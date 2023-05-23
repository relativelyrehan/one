import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UAParser from "ua-parser-js";

export async function POST(req: Request) {
  try {
    const { app_url, play_url } = await req.json();
    if (!app_url || !play_url) {
      return new Response("Bad Request", { status: 400 });
    }
    const qr = await prisma.qr.create({
      data: {
        app_store_url: app_url,
        play_store_url: play_url,
      },
    });
    return new Response(JSON.stringify({ qr }), { status: 200 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return redirect("/404");
    }
    const headers = req.headers;
    const userAgent = headers.get("user-agent");
    let parser = new UAParser(userAgent as any);
    let os = parser.getOS();
    os.name = os.name || "";
    const qr = await prisma.qr.findUnique({
      where: {
        id,
      },
    });
    if(qr?.app_store_url && qr?.play_store_url) {
        if (
            os &&
            ["ios", "mac os", "macos", "ipad"].includes(os.name.toLowerCase())
          ) {
            redirect(`${qr?.app_store_url}`);
          }
        redirect(`${qr?.play_store_url}`);
    } else {
        redirect("/404");
    }
}
