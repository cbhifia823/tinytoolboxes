export function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
export function pathToTitle(raw) {
    return raw
        .split("/")
        .filter(Boolean)
        .map((s) => s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "))
        .join(" / ");
}
