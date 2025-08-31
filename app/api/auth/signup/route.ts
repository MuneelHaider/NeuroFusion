import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/mongoDbClient";
import crypto from "crypto";

// Valid roles only (case-insensitive)
const VALID_ROLES = ["Doctor", "Patient", "Admin"];

export async function POST(req: NextRequest) {
  try {
    const { role, fullName, email, password, confirmPassword, specialty, licenseNumber } = await req.json();

    // Simple validation
    if (!role || !fullName || !email || !password) {
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

    // Check password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password using crypto (built-in Node.js)
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${salt}:${hash}`;

    // Create new user with normalized role
    const newUser = {
      role: normalizedRole, // Use the properly cased role
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      // Add optional fields if they exist
      ...(specialty && { specialty }),
      ...(licenseNumber && { licenseNumber }),
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 