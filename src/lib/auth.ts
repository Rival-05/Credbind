import jwt from "jsonwebtoken";

export type AuthPayload = {
    issuerId?: string;
    studentId?: string;
    email: string;
    role: "ISSUER" | "STUDENT";
};

export function verifyToken(token: string): AuthPayload | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
        return decoded;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

export async function signupHolder(data: Record<string, unknown>) {
    const res = await fetch("/api/auth/holder/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return res.json();
}

export async function signupIssuer(data: Record<string, unknown>) {
    const res = await fetch("/api/auth/issuer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return res.json();
}