import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

function generateCredentialId() {
    return `cert-${Date.now()}`;
}

export async function POST(req: NextRequest) {
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

        if (!decoded || decoded.role !== "ISSUER" || !decoded.issuerId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Check issuer
        const issuer = await prisma.issuer.findUnique({
            where: { id: decoded.issuerId },
        });

        if (!issuer) {
            return NextResponse.json(
                { success: false, message: "Issuer not found" },
                { status: 404 }
            );
        }

        if (issuer.status !== "APPROVED") {
            return NextResponse.json(
                { success: false, message: "Issuer is not approved" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { walletId, type, title, cgpa, graduationYear } = body;

        if (!walletId || !type || !title) {
            return NextResponse.json(
                { success: false, message: "walletId, type and title are required" },
                { status: 400 }
            );
        }

        // Find student
        const student = await prisma.student.findUnique({
            where: { walletId },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found for this walletId" },
                { status: 404 }
            );
        }

        const credentialId = generateCredentialId();

        // Build certificate JSON (this is what goes to IPFS)
        const credentialJson = {
            credentialId,
            type,
            title,
            issuedAt: new Date().toISOString(),
            issuer: {
                id: issuer.id,
                orgName: issuer.orgName,
                email: issuer.email,
                domain: issuer.domain,
            },
            holder: {
                id: student.id,
                name: student.name,
                email: student.email,
                enrollment: student.enrollment,
                walletId: student.walletId,
                publicKey: student.publicKey,
            },
            claims: {
                cgpa: cgpa || null,
                graduationYear: graduationYear || null,
            },
        };

        // Upload to Pinata
        const pinataRes = await fetch(PINATA_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: JSON.stringify({
                pinataContent: credentialJson,
                pinataMetadata: {
                    name: `${student.enrollment}-${type}-credential`,
                },
            }),
        });

        if (!pinataRes.ok) {
            const text = await pinataRes.text();
            console.error("Pinata upload error:", text);

            return NextResponse.json(
                { success: false, message: "Failed to upload credential to IPFS" },
                { status: 500 }
            );
        }

        const pinataJson = await pinataRes.json();
        const cid = pinataJson.IpfsHash;

        // Store metadata in DB
        const credential = await prisma.credential.create({
            data: {
                credentialId,
                cid,
                type,
                title,
                issuerId: issuer.id,
                studentId: student.id,
                payload: credentialJson,
            },
        });

        // Audit log
        await prisma.auditLog.create({
            data: {
                action: "CREDENTIAL_ISSUED",
                role: "ISSUER",
                actorIssuerId: issuer.id,
                metadata: {
                    credentialId: credential.credentialId,
                    cid: credential.cid,
                    studentId: student.id,
                    walletId: student.walletId,
                    type,
                    title,
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Credential issued successfully",
                credential: {
                    id: credential.id,
                    credentialId: credential.credentialId,
                    cid: credential.cid,
                    type: credential.type,
                    title: credential.title,
                    status: credential.status,
                    issuedAt: credential.issuedAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Credential issuance error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}