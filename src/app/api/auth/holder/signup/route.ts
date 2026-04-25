import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function generateWalletId(enrollment: string) {
    return `did:credbind:student-${enrollment.toLowerCase()}`;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, enrollment, password } = body;

        // 1. Validate input
        if (!name || !email || !enrollment || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedEnrollment = enrollment.trim().toUpperCase();

        // 2. Check if student already exists by email
        const existingStudentByEmail = await prisma.student.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingStudentByEmail) {
            return NextResponse.json(
                { success: false, message: "Student already exists with this email" },
                { status: 409 }
            );
        }

        // 3. Check if student already exists by enrollment
        const existingStudentByEnrollment = await prisma.student.findUnique({
            where: { enrollment: normalizedEnrollment },
        });

        if (existingStudentByEnrollment) {
            return NextResponse.json(
                { success: false, message: "Student already exists with this enrollment number" },
                { status: 409 }
            );
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Generate wallet ID
        const walletId = generateWalletId(normalizedEnrollment);

        // 6. Create student
        const student = await prisma.student.create({
            data: {
                name,
                email: normalizedEmail,
                enrollment: normalizedEnrollment,
                passwordHash: hashedPassword,
                walletId,
            },
        });

        // 7. Create audit log
        await prisma.auditLog.create({
            data: {
                action: "STUDENT_SIGNUP",
                role: "STUDENT",
                actorStudentId: student.id,
                metadata: {
                    name: student.name,
                    email: student.email,
                    enrollment: student.enrollment,
                    walletId: student.walletId,
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Student registered successfully",
                student: {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    enrollment: student.enrollment,
                    walletId: student.walletId,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Student signup error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}