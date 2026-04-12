import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateNonce() {
    return crypto.randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cid } = body;

        if (!cid) {
            return NextResponse.json(
                { success: false, message: "CID is required" },
                { status: 400 }
            );
        }

        // 1. Find credential
        const credential = await prisma.credential.findUnique({
            where: { cid },
            include: {
                student: true,
            },
        });

        if (!credential) {
            return NextResponse.json(
                { success: false, message: "Credential not found" },
                { status: 404 }
            );
        }

        if (credential.status !== "ACTIVE") {
            return NextResponse.json(
                { success: false, message: "Credential is not active" },
                { status: 400 }
            );
        }

        // 2. Create nonce
        const nonce = generateNonce();

        // 3. Expiry = 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // 4. Store challenge
        const challenge = await prisma.verificationChallenge.create({
            data: {
                cid,
                studentId: credential.student.id,
                nonce,
                expiresAt,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Challenge generated successfully",
            challenge: {
                cid,
                nonce: challenge.nonce,
                expiresAt: challenge.expiresAt,
                studentWalletId: credential.student.walletId,
            },
        });
    } catch (error) {
        console.error("Challenge generation error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}