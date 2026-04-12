import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cid, nonce, signature } = body;

        if (!cid || !nonce || !signature) {
            return NextResponse.json(
                { success: false, message: "cid, nonce, and signature are required" },
                { status: 400 }
            );
        }

        // 1. Find challenge
        const challenge = await prisma.verificationChallenge.findUnique({
            where: { nonce },
            include: {
                student: true,
            },
        });

        if (!challenge) {
            return NextResponse.json(
                { success: false, message: "Challenge not found" },
                { status: 404 }
            );
        }

        // 2. Check challenge belongs to same credential
        if (challenge.cid !== cid) {
            return NextResponse.json(
                { success: false, message: "CID mismatch for challenge" },
                { status: 400 }
            );
        }

        // 3. Check if challenge already used
        if (challenge.used) {
            return NextResponse.json(
                { success: false, message: "Challenge already used" },
                { status: 400 }
            );
        }

        // 4. Check expiry
        if (new Date() > challenge.expiresAt) {
            return NextResponse.json(
                { success: false, message: "Challenge expired" },
                { status: 400 }
            );
        }

        // 5. Verify signature using student's public key
        const verify = crypto.createVerify("SHA256");
        verify.update(nonce);
        verify.end();

        const isValidSignature = verify.verify(
            challenge.student.publicKey,
            Buffer.from(signature, "base64")
        );

        // 6. Mark challenge as used
        await prisma.verificationChallenge.update({
            where: { id: challenge.id },
            data: { used: true },
        });

        if (!isValidSignature) {
            return NextResponse.json(
                {
                    success: false,
                    ownershipVerified: false,
                    message: "Invalid holder signature",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            ownershipVerified: true,
            message: "Holder ownership successfully verified",
            holder: {
                name: challenge.student.name,
                email: challenge.student.email,
                enrollment: challenge.student.enrollment,
                walletId: challenge.student.walletId,
            },
        });
    } catch (error) {
        console.error("Proof verification error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}