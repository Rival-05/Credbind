"use client";

import { useEffect, useState } from "react";
import { apiFetch, getToken } from "@/lib/api";

type MeResponse = {
    success: boolean;
    role?: "ISSUER" | "STUDENT";
};

function clearAuthState() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
}

type ReplaceFn = (href: string) => void;

type UseAuthDashboardRedirectOptions = {
    replace: ReplaceFn;
    unauthenticatedRedirectTo?: string;
};

export async function resolveDashboardRoute() {
    if (typeof window === "undefined") {
        return null;
    }

    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const response = await apiFetch("/api/auth/me", {
            method: "GET",
            cache: "no-store",
        });

        const data = (await response.json()) as MeResponse;

        if (!response.ok || !data.success || !data.role) {
            clearAuthState();
            return null;
        }

        return data.role === "ISSUER" ? "/issuer/dashboard" : "/holder/dashboard";
    } catch {
        return null;
    }
}

export function useAuthDashboardRedirect({
    replace,
    unauthenticatedRedirectTo,
}: UseAuthDashboardRedirectOptions) {
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        let isActive = true;

        async function handleRedirect() {
            const dashboardRoute = await resolveDashboardRoute();

            if (!isActive) {
                return;
            }

            if (dashboardRoute) {
                replace(dashboardRoute);
                return;
            }

            if (unauthenticatedRedirectTo) {
                replace(unauthenticatedRedirectTo);
                return;
            }

            setCheckingSession(false);
        }

        handleRedirect();

        return () => {
            isActive = false;
        };
    }, [replace, unauthenticatedRedirectTo]);

    return checkingSession;
}