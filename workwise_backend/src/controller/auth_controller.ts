import { Request, Response } from "express";
import { createNewUserSchema } from "../lib/types";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { signinSchema } from "../lib/types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("Request reached at /api/v1/signup endpoint");

    console.log("data from frontend-", req.body);
    const parsedData = createNewUserSchema.safeParse(req.body);
    console.log("parsedData-->", parsedData);
    if (!parsedData.success) {
      return res.status(200).json({
        message: parsedData.error.issues[0].message,
        success: false,
        errors: parsedData.error.format(),
        status: 400,
      });
    }

    const { name, email, password } = parsedData.data;
    console.log("📥 Parsed Data:", { name, email });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn("⚠️ Email already in use:", email);
      return res.status(200).json({
        message: "Email already in use. Please use a different email.",
        success: false,
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log("✅ New User Created:", newUser.email);

    return res.status(200).json({
      message: "User registered successfully.",
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Server error during signup:", error);
    return res.status(200).json({
      message: "Internal Server Error. Please try again later.",
      success: false,
      status: 500,
    });
  }
};

const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("Request received at /v1/signin endpoint");

    // Validate incoming data
    const parsedData = signinSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(200).json({
        message: "Invalid email or password format.",
        success: false,
        status: 400,
      });
    }

    const { email, password } = parsedData.data;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({
        message: "Account not found. Please create an account.",
        success: false,
        status: 402,
      });
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(200).json({
        message: "Incorrect password.",
        success: false,
        status: 400,
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "thisissecreatebro";
    if (!secret) {
      return res.status(200).json({
        message: "secrete not found",
        success: false,
        status: 500,
      });
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Signin successful.",
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      token,
      status: 200,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(200).json({
      message: "Internal server error. Please try again later.",
      success: false,
      status: 500,
    });
  }
};

export { signup, signin };
