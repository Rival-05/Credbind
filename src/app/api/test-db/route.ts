import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const issuers = await prisma.issuer.findMany();
        return NextResponse.json({
            success: true,
            issuers,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "DB connection failed" },
            { status: 500 }
        );
    }
}