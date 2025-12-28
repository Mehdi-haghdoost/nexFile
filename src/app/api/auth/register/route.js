import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth/hashPassword";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  setAuthCookies
} from "@/utils/auth/tokenManager";
import { registerSchema } from "@/utils/auth/validators";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, email, password } = body;

    try {
      registerSchema.parse(body);
    } catch (error) {
      const formattedErrors = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
      }

      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: formattedErrors,
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      emailVerified: false,
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    await saveRefreshToken(user._id, refreshToken);

    let response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response = setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}