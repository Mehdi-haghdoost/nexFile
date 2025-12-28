import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth/hashPassword";
import { 
  generateAccessToken, 
  generateRefreshToken, 
  saveRefreshToken,
  setAuthCookies 
} from "@/utils/auth/tokenManager";
import { loginSchema } from "@/utils/auth/validators";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    try {
      loginSchema.parse(body);
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

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user has password (not Google user)
    if (!user.password) {
      return NextResponse.json(
        { message: "This account uses Google login. Please sign in with Google." },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Save refresh token to database
    await saveRefreshToken(user._id, refreshToken);

    // Prepare response
    let response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      },
      { status: 200 }
    );

    // Set auth cookies
    response = setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}