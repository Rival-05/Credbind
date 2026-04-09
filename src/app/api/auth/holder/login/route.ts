import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // 1. Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 2. Find student
        const student = await prisma.student.findUnique({
            where: { email: normalizedEmail },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 3. Compare password
        const isPasswordValid = await bcrypt.compare(password, student.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 4. Generate JWT
        const token = jwt.sign(
            {
                studentId: student.id,
                email: student.email,
                role: "STUDENT",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // 5. Optional audit log
        await prisma.auditLog.create({
            data: {
                action: "STUDENT_LOGIN",
                role: "STUDENT",
                actorStudentId: student.id,
                metadata: {
                    email: student.email,
                    walletId: student.walletId,
                },
            },
        });

        // 6. Return session data
        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
                student: {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    enrollment: student.enrollment,
                    walletId: student.walletId,
                    publicKey: student.publicKey,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Student login error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}