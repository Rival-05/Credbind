import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const issuer = await prisma.issuer.findUnique({
            where: { email: normalizedEmail },
        });

        if (!issuer) {
            return NextResponse.json(
                { success: false, message: "Issuer doesn't exist" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, issuer.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Wrong password" },
                { status: 401 }
            );
        }

        if (issuer.status !== "APPROVED") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your issuer account is not approved yet",
                    status: issuer.status,
                },
                { status: 403 }
            );
        }

        const token = jwt.sign(
            {
                issuerId: issuer.id,
                email: issuer.email,
                role: "ISSUER",
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        await prisma.auditLog.create({
            data: {
                action: "ISSUER_LOGIN",
                role: "ISSUER",
                actorIssuerId: issuer.id,
                metadata: {
                    email: issuer.email,
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
                issuer: {
                    id: issuer.id,
                    orgName: issuer.orgName,
                    email: issuer.email,
                    domain: issuer.domain,
                    status: issuer.status,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Issuer login error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}