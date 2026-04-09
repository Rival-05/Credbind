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