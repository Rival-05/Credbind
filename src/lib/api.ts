export function getToken() {
    return localStorage.getItem("token");
}

export async function apiFetch(url: string, options: Record<string, unknown> = {}) {
    const token = getToken();

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(options.headers || {}),
        },
    });
}