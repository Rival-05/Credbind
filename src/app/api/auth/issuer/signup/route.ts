import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orgName, email, domain, password } = body;

        // 1. Basic validation
        if (!orgName || !email || !domain || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        // 2. Normalize values
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedDomain = domain.toLowerCase().trim();

        // 3. Check if domain is whitelisted
        const allowedDomain = await prisma.domainWhitelist.findUnique({
            where: { domain: normalizedDomain },
        });

        if (!allowedDomain) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This organization domain is not allowed to register",
                },
                { status: 403 }
            );
        }

        // 4. Check if issuer already exists
        const existingIssuer = await prisma.issuer.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingIssuer) {
            return NextResponse.json(
                { success: false, message: "Issuer already exists with this email" },
                { status: 409 }
            );
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create issuer
        const issuer = await prisma.issuer.create({
            data: {
                orgName,
                email: normalizedEmail,
                domain: normalizedDomain,
                passwordHash: hashedPassword,
                status: "PENDING",
            },
        });

        // 7. Optional audit log
        await prisma.auditLog.create({
            data: {
                action: "ISSUER_SIGNUP",
                role: "ISSUER",
                actorIssuerId: issuer.id,
                metadata: {
                    orgName: issuer.orgName,
                    email: issuer.email,
                    domain: issuer.domain,
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Issuer registered successfully. Await admin approval.",
                issuer: {
                    id: issuer.id,
                    orgName: issuer.orgName,
                    email: issuer.email,
                    domain: issuer.domain,
                    status: issuer.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Issuer signup error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}