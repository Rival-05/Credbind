import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Authorization token missing" },
                { status: 401 }
            );
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== "STUDENT" || !decoded.studentId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Fetch student
        const student = await prisma.student.findUnique({
            where: { id: decoded.studentId },
            select: {
                id: true,
                name: true,
                email: true,
                enrollment: true,
                walletId: true,
                createdAt: true,
            },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found" },
                { status: 404 }
            );
        }

        // Fetch credentials belonging to this student
        const credentials = await prisma.credential.findMany({
            where: { studentId: student.id },
            orderBy: { issuedAt: "desc" },
            select: {
                id: true,
                credentialId: true,
                cid: true,
                type: true,
                title: true,
                status: true,
                issuedAt: true,
                expiresAt: true,
                issuer: {
                    select: {
                        id: true,
                        orgName: true,
                        domain: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            student,
            credentials,
        });
    } catch (error) {
        console.error("Error fetching student credentials:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            {
                status: 500
            }
        );
    }
}