import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongoDbClient";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

// Valid roles only (case-insensitive)
const VALID_ROLES = ["Doctor", "Patient", "Admin"];

export async function POST(req: NextRequest) {
  try {
    const { role, email, password } = await req.json();

    // Simple validation
    if (!role || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if role is valid (case-insensitive)
    const normalizedRole = VALID_ROLES.find(validRole => 
      validRole.toLowerCase() === role.toLowerCase()
    );
    
    if (!normalizedRole) {
      return NextResponse.json(
        { message: "Invalid role. Must be Doctor, Patient, or Admin" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Find user by email and normalized role
    const user = await db.collection("users").findOne({ 
      email, 
      role: normalizedRole 
    });
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password using crypto
    const [salt, hash] = user.password.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
    if (hash !== verifyHash) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, email, name: user.fullName },
      JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { 
        message: "Logged in successfully",
        user: {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
          specialty: user.specialty,
          licenseNumber: user.licenseNumber
        }
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 