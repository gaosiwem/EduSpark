import { POST } from "../app/api/v1/register/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// frontend_new/app/api/v1/register/route.test.ts

jest.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs");

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("POST /api/v1/register", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    fullName: "Test User",
    phone: "1234567890",
    password: "hashedpassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 409 if user already exists", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        fullName: "Test User",
        phone: "1234567890",
        password: "password123",
      }),
    } as any;

    // Simulate unique constraint violation (user already exists)
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (prisma.user.create as jest.Mock).mockRejectedValue({
      code: "P2002", // Prisma unique constraint violation code
    });

    await POST(req);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "User already exists" },
      { status: 409 }
    );
  });

  it("returns 500 on unexpected error", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        email: "test@example.com",
        fullName: "Test User",
        phone: "1234567890",
        password: "password123",
      }),
    } as any;

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    await POST(req);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal server error" },
      { status: 500 }
    );
  });

  // it("returns 400 if password is too short", async () => {
  //   const req = {
  //     json: jest.fn().mockResolvedValue({
  //       email: "test@example.com",
  //       fullName: "Test User",
  //       phone: "1234567890",
  //       password: "123",
  //     }),
  //   } as any;

  //   await POST(req);

  //   expect(NextResponse.json).toHaveBeenCalledWith(
  //     { error: "Password must be at least 6 characters" },
  //     { status: 400 }
  //   );
  //   expect(bcrypt.hash).not.toHaveBeenCalled();
  //   expect(prisma.user.create).not.toHaveBeenCalled();
  // });

  // it("returns 400 if email is invalid", async () => {
  //   const req = {
  //     json: jest.fn().mockResolvedValue({
  //       email: "invalid-email",
  //       fullName: "Test User",
  //       phone: "1234567890",
  //       password: "password123",
  //     }),
  //   } as any;

  //   await POST(req);

  //   expect(NextResponse.json).toHaveBeenCalledWith(
  //     { error: "Invalid email address" },
  //     { status: 400 }
  //   );
  //   expect(bcrypt.hash).not.toHaveBeenCalled();
  //   expect(prisma.user.create).not.toHaveBeenCalled();
  // });

  it("returns 400 if required fields are missing", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        email: "",
        phone: "",
        password: "",
      }),
    } as any;

    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Missing required fields" },
      { status: 400 }
    );
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});