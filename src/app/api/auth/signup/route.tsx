import { emailSchema, passwordSchema } from "@/utils/validations";
import * as bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateJWT, getIP } from "@/lib/helpers";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SALT_ROUNDS } from "@/utils/constants";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json("Email is required", { status: 400 });
    }
    if (emailSchema.safeParse(email).success === false) {
      return NextResponse.json("Invalid email", { status: 400 });
    }
    if (!password) {
      return NextResponse.json("Password is required", { status: 400 });
    }
    if (passwordSchema.safeParse(password).success === false) {
      return NextResponse.json(
        "Password must contain an lowercase, an uppercase letter, a number and a symbol",
        { status: 400 }
      );
    }
    const ip = getIP(headers);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return NextResponse.json("User already exists", { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ip_address: ip,
      },
    });

    const jwtToken = generateJWT(user.id);

    const data = {
      email: user.email,
      created_at: user.created_at,
      limit: user.limit,
      token: jwtToken,
    };
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
