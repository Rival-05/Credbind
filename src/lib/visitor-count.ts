const visitor_count = "unique";
const visitor_seen = "seen";

function readStoredCount(value: string | null) {
    const parsedCount = Number(value);

    return Number.isFinite(parsedCount) && parsedCount >= 0 ? parsedCount : 0;
}

export function getUniqueVisitorCount() {
    if (typeof window === "undefined") {
        return 0;
    }

    const hasSeenBefore = window.localStorage.getItem(visitor_seen) === "true";
    const currentCount = readStoredCount(
        window.localStorage.getItem(visitor_count)
    );

    if (!hasSeenBefore) {
        const nextCount = currentCount + 1;

        window.localStorage.setItem(visitor_count, String(nextCount));
        window.localStorage.setItem(visitor_seen, "true");

        return nextCount;
    }

    return currentCount;
}