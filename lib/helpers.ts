import { VALID_SLUG_LENGTH } from "@/utils/constants";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";

export const downloadQRCode = (id: string) => {
  const svg = document.getElementById("QRCode") as HTMLElement;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `QRCode-${id}`;
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
};

export function getIP(headers: any) {
  const forwardedFor = headers().get("x-forwarded-for");
  const ip = forwardedFor
    ? forwardedFor.split(",")[0]
    : headers().get("x-real-ip");
  return ip;
}

export function generateJWT(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): { userId: string | null } {
  try {
    if (!process.env.JWT_SECRET) {
      return {
        userId: null,
      };
    }
    return jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
  } catch (e) {
    console.error(e);
    return {
      userId: null,
    };
  }
}

export function generateSlug() {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, VALID_SLUG_LENGTH);
  return nanoid();
}
