import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ cid: string }> }
) {
    try {
        const { cid } = await params;

        if (!cid) {
            return NextResponse.json(
                { success: false, message: "CID is required" },
                { status: 400 }
            );
        }

        // 1. Find credential in DB
        const credential = await prisma.credential.findUnique({
            where: { cid },
            select: {
                id: true,
                credentialId: true,
                cid: true,
                type: true,
                title: true,
                status: true,
                issuedAt: true,
                expiresAt: true,
                revokedAt: true,
                payload: true,
                issuer: {
                    select: {
                        id: true,
                        orgName: true,
                        email: true,
                        domain: true,
                        status: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        enrollment: true,
                        walletId: true,
                        publicKey: true,
                    },
                },
            },
        });

        if (!credential) {
            return NextResponse.json(
                {
                    success: false,
                    valid: false,
                    message: "Credential not found in registry",
                },
                { status: 404 }
            );
        }

        // 2. Fetch actual content from IPFS gateway
        let ipfsData: Record<string, unknown> | null = null;
        let ipfsAvailable = false;
        let ipfsMatchesDb = false;

        try {
            const ipfsRes = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`, {
                method: "GET",
                cache: "no-store",
            });

            if (ipfsRes.ok) {
                ipfsData = (await ipfsRes.json()) as Record<string, unknown>;
                ipfsAvailable = true;

                // 3. Compare important fields between DB and IPFS
                const data = ipfsData as Record<string, unknown>;
                const holder = (data?.holder as Record<string, unknown>) || {};
                const issuer = (data?.issuer as Record<string, unknown>) || {};
                ipfsMatchesDb =
                    data?.credentialId === credential.credentialId &&
                    data?.type === credential.type &&
                    data?.title === credential.title &&
                    holder.walletId === credential.student.walletId &&
                    issuer.email === credential.issuer.email;
            }
        } catch (ipfsError) {
            console.error("IPFS fetch failed:", ipfsError);
        }

        // 4. Status checks
        const isRevoked = credential.status === "REVOKED";
        const isExpired =
            credential.expiresAt !== null &&
            new Date(credential.expiresAt) < new Date();

        const isValid =
            !isRevoked &&
            !isExpired &&
            ipfsAvailable &&
            ipfsMatchesDb;

        return NextResponse.json({
            success: true,
            valid: isValid,
            verification: {
                cid: credential.cid,
                credentialId: credential.credentialId,
                type: credential.type,
                title: credential.title,
                status: credential.status,
                issuedAt: credential.issuedAt,
                expiresAt: credential.expiresAt,
                revokedAt: credential.revokedAt,
                checks: {
                    existsInRegistry: true,
                    existsOnIPFS: ipfsAvailable,
                    ipfsMatchesRegistry: ipfsMatchesDb,
                    issuerFound: !!credential.issuer,
                    holderBound: !!credential.student.walletId,
                    revoked: isRevoked,
                    expired: isExpired,
                },
                issuer: {
                    orgName: credential.issuer.orgName,
                    email: credential.issuer.email,
                    domain: credential.issuer.domain,
                },
                holder: {
                    name: credential.student.name,
                    enrollment: credential.student.enrollment,
                    walletId: credential.student.walletId,
                },
                registryPayload: credential.payload,
                ipfsPayload: ipfsData,
            },
        });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}