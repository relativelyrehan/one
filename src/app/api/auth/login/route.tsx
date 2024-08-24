import prisma from "@/lib/prisma";
import { emailSchema } from "@/utils/validations";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { generateJWT, getIP } from "@/lib/helpers";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    if (emailSchema.safeParse(email).success === false) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }
      if (!result) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 400 }
        );
      }
    });

    const ip = getIP(headers);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        last_login: new Date(),
        last_ip: ip,
      },
    });

    const jwtToken = generateJWT(user.id);

    return NextResponse.json(
      {
        data: {
          email: user.email,
          created_at: user.created_at,
          limit: user.limit,
          token: jwtToken,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
