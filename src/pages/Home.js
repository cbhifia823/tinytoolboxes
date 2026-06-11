import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { AlertTriangleIcon, CheckIcon, CloseIcon, CopyIcon, InfoIcon, ThemeIcon, } from "@/components/icons";
const SOCIAL_LINKS = {
    // Replace these starter URLs with the user's real profile URLs.
    // Set a value to undefined to turn the card back into a copyable "Ask Zo..." prompt.
    instagram: "https://instagram.com/zocomputer",
    linkedin: "https://www.linkedin.com/company/zocomputer",
    x: "https://x.com/zocomputer",
};
const DEFAULT_SPACE_THEME_ID = "midnight";
const DEFAULT_SPACE_BACKGROUND_ID = "blobs";
// Starter homepage theme/background presets. These are intentionally local to
// Home.tsx: generated routes do not automatically inherit this picker. The
// picker previews themes for the current browser session only; it does not save
// the user's website. The copyable prompt is the durable path: ask Zo to edit
// the page, then update these values or the generated route code.
// To change a theme, edit the values here. To add a theme, add another entry.
const SPACE_THEME_PRESETS = [
    {
        id: "midnight",
        name: "Midnight",
        values: {
            colorScheme: "dark",
            background: "oklch(0.147 0.004 49.25)",
            foreground: "oklch(0.985 0.001 106.423)",
            card: "oklch(0.216 0.006 56.043)",
            cardForeground: "oklch(0.985 0.001 106.423)",
            muted: "oklch(0.268 0.007 34.298)",
            mutedForeground: "oklch(0.709 0.01 56.259)",
            accent: "oklch(0.268 0.007 34.298)",
            accentForeground: "oklch(0.985 0.001 106.423)",
            border: "oklch(1 0 0 / 10%)",
            ring: "oklch(0.553 0.013 58.071)",
            primary: "oklch(0.82 0.14 78)",
            primaryMuted: "oklch(0.72 0.07 78)",
            brandX: "#e7e9ea",
            cardShadow: "0 12px 32px oklch(0 0 0 / 18%)",
            cardHoverShadow: "0 18px 42px oklch(0 0 0 / 28%)",
        },
    },
    {
        id: "paper",
        name: "Paper",
        values: {
            colorScheme: "light",
            background: "oklch(0.985 0.001 106.423)",
            foreground: "oklch(0.147 0.004 49.25)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.147 0.004 49.25)",
            muted: "oklch(0.97 0.001 106.424)",
            mutedForeground: "oklch(0.553 0.013 58.071)",
            accent: "oklch(0.97 0.001 106.424)",
            accentForeground: "oklch(0.216 0.006 56.043)",
            border: "oklch(0.923 0.003 48.717)",
            ring: "oklch(0.709 0.01 56.259)",
            primary: "oklch(0.5 0.09 255)",
            primaryMuted: "oklch(0.58 0.05 255)",
            brandX: "#111111",
            cardShadow: "0 12px 32px oklch(0.147 0.004 49.25 / 10%)",
            cardHoverShadow: "0 18px 42px oklch(0.147 0.004 49.25 / 16%)",
        },
    },
    {
        id: "dusk",
        name: "Dusk",
        values: {
            colorScheme: "dark",
            background: "oklch(0.18 0.025 312)",
            foreground: "oklch(0.97 0.008 302)",
            card: "oklch(0.23 0.028 312)",
            cardForeground: "oklch(0.97 0.008 302)",
            muted: "oklch(0.29 0.03 312)",
            mutedForeground: "oklch(0.75 0.025 302)",
            accent: "oklch(0.34 0.06 312)",
            accentForeground: "oklch(0.98 0.01 302)",
            border: "oklch(0.86 0.02 302 / 16%)",
            ring: "oklch(0.75 0.07 312)",
            primary: "oklch(0.8 0.12 330)",
            primaryMuted: "oklch(0.72 0.065 330)",
            brandX: "#e7e9ea",
            cardShadow: "0 12px 32px oklch(0 0 0 / 18%)",
            cardHoverShadow: "0 18px 42px oklch(0 0 0 / 28%)",
        },
    },
    {
        id: "moss",
        name: "Moss",
        values: {
            colorScheme: "dark",
            background: "oklch(0.19 0.025 145)",
            foreground: "oklch(0.96 0.02 120)",
            card: "oklch(0.24 0.03 145)",
            cardForeground: "oklch(0.96 0.02 120)",
            muted: "oklch(0.31 0.035 145)",
            mutedForeground: "oklch(0.75 0.035 130)",
            accent: "oklch(0.36 0.06 145)",
            accentForeground: "oklch(0.98 0.02 120)",
            border: "oklch(0.86 0.025 130 / 16%)",
            ring: "oklch(0.73 0.08 145)",
            primary: "oklch(0.78 0.11 145)",
            primaryMuted: "oklch(0.7 0.065 145)",
            brandX: "#e7e9ea",
            cardShadow: "0 12px 32px oklch(0 0 0 / 18%)",
            cardHoverShadow: "0 18px 42px oklch(0 0 0 / 28%)",
        },
    },
];
const SPACE_BACKGROUND_PRESETS = [
    {
        id: "blobs",
        name: "Blobs",
        values: {
            background: `
        radial-gradient(ellipse 58% 34% at 8% 4%, color-mix(in oklch, var(--space-primary-muted) 9%, transparent), transparent 76%),
        radial-gradient(ellipse 48% 28% at 88% 20%, color-mix(in oklch, var(--space-primary-muted) 7%, transparent), transparent 74%),
        radial-gradient(ellipse 62% 34% at 18% 40%, color-mix(in oklch, var(--space-primary) 6%, transparent), transparent 78%),
        radial-gradient(ellipse 58% 32% at 80% 58%, color-mix(in oklch, var(--space-primary-muted) 7%, transparent), transparent 78%),
        radial-gradient(ellipse 64% 36% at 30% 78%, color-mix(in oklch, var(--space-primary) 5%, transparent), transparent 80%),
        radial-gradient(ellipse 70% 38% at 90% 96%, color-mix(in oklch, var(--space-primary-muted) 5%, transparent), transparent 82%),
        radial-gradient(ellipse 130% 70% at 50% 48%, color-mix(in oklch, var(--muted) 12%, transparent), transparent 72%),
        linear-gradient(180deg, color-mix(in oklch, var(--muted) 36%, var(--background)), var(--background) 52%, color-mix(in oklch, var(--background) 86%, black))
      `,
        },
    },
    {
        id: "gradient",
        name: "Gradient",
        values: {
            background: "linear-gradient(180deg, color-mix(in oklch, var(--background) 74%, var(--space-primary-muted)), var(--background) 54%, color-mix(in oklch, var(--background) 84%, black))",
        },
    },
    {
        id: "blinds",
        name: "Blinds",
        values: {
            background: `
        linear-gradient(180deg, rgb(0 0 0 / 0) 0%, var(--background) 86%),
        repeating-linear-gradient(180deg, color-mix(in oklch, var(--space-primary-muted) 18%, transparent) 0 1px, transparent 1px 32px),
        radial-gradient(ellipse 80% 42% at 50% 10%, color-mix(in oklch, var(--space-primary) 7%, transparent), transparent 70%),
        linear-gradient(180deg, color-mix(in oklch, var(--muted) 30%, var(--background)), var(--background) 56%, color-mix(in oklch, var(--background) 88%, black))
      `,
        },
    },
    {
        id: "z",
        name: "Z",
        values: {
            background: `
        linear-gradient(135deg, transparent 0 18px, color-mix(in oklch, var(--space-primary-muted) 16%, transparent) 18px 19px, transparent 19px 52px),
        linear-gradient(180deg, color-mix(in oklch, var(--muted) 30%, var(--background)), var(--background) 56%, color-mix(in oklch, var(--background) 88%, black))
      `,
            backgroundSize: "52px 52px, auto",
        },
    },
];
const PRESET_SECTION_LABEL_CLASS = "font-mono text-xs font-normal uppercase tracking-wide text-muted-foreground";
function getHomeStyle(themeId, backgroundId) {
    const theme = SPACE_THEME_PRESETS.find((preset) => preset.id === themeId);
    const background = SPACE_BACKGROUND_PRESETS.find((preset) => preset.id === backgroundId);
    const { values } = theme;
    return {
        colorScheme: values.colorScheme,
        background: background.values.background,
        backgroundSize: background.values.backgroundSize,
        "--background": values.background,
        "--foreground": values.foreground,
        "--card": values.card,
        "--card-foreground": values.cardForeground,
        "--muted": values.muted,
        "--muted-foreground": values.mutedForeground,
        "--accent": values.accent,
        "--accent-foreground": values.accentForeground,
        "--border": values.border,
        "--ring": values.ring,
        "--space-primary": values.primary,
        "--space-primary-muted": values.primaryMuted,
        "--space-brand-x": values.brandX,
        "--space-card-shadow": values.cardShadow,
        "--space-card-hover-shadow": values.cardHoverShadow,
    };
}
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    }
    catch {
        // The async Clipboard API can be unavailable in embedded/PWA contexts.
        // Keep a browser-native fallback so starter prompts still copy reliably.
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    try {
        return document.execCommand("copy");
    }
    finally {
        document.body.removeChild(textarea);
    }
}
function CopyablePrompt({ prompt, children, className = "", iconSide = "left", }) {
    const [copied, setCopied] = React.useState(false);
    React.useEffect(() => {
        if (!copied)
            return;
        const timeout = window.setTimeout(() => setCopied(false), 1400);
        return () => window.clearTimeout(timeout);
    }, [copied]);
    async function copyPrompt(event) {
        event.preventDefault();
        event.stopPropagation();
        if (await copyText(prompt))
            setCopied(true);
    }
    const Icon = copied ? CheckIcon : CopyIcon;
    const icon = _jsx(Icon, { className: "size-3.5 shrink-0" });
    return (_jsxs("button", { type: "button", onClick: copyPrompt, className: [
            "copyable-prompt-tooltip inline-flex cursor-pointer items-center gap-2 border-[var(--space-primary-muted)] text-left text-[var(--space-primary-muted)] transition-colors hover:border-[var(--space-primary)] hover:text-[var(--space-primary)]",
            className,
        ].join(" "), "aria-label": `Copy prompt: ${prompt}`, children: [iconSide === "left" ? icon : null, _jsx("span", { children: children ?? prompt }), iconSide === "right" ? icon : null] }));
}
function PresetSection({ title, presets, selectedId, onSelect, }) {
    return (_jsxs("section", { className: title ? "mt-4" : undefined, children: [title ? (_jsx("p", { className: `mb-2 ${PRESET_SECTION_LABEL_CLASS}`, children: title })) : null, _jsx("div", { className: "grid grid-cols-2 gap-2", children: presets.map((preset) => (_jsx("button", { type: "button", onClick: () => onSelect(preset.id), className: [
                        "cursor-pointer rounded-lg border px-3 py-2 text-left font-mono text-xs font-normal uppercase tracking-wide transition-colors",
                        preset.id === selectedId
                            ? "border-[var(--space-primary)] bg-accent text-accent-foreground"
                            : "bg-card/50 text-muted-foreground hover:bg-card",
                    ].join(" "), children: preset.name }, preset.id))) })] }));
}
function ThemePresetPanel({ themeId, backgroundId, onThemeChange, onBackgroundChange, }) {
    const [open, setOpen] = React.useState(true);
    const selectedTheme = SPACE_THEME_PRESETS.find((preset) => preset.id === themeId);
    const selectedBackground = SPACE_BACKGROUND_PRESETS.find((preset) => preset.id === backgroundId);
    const prompt = `make my Space use the ${selectedTheme.name} theme with the ${selectedBackground.name} background`;
    return (_jsxs("div", { className: "fixed bottom-4 left-4 z-50", children: [_jsxs("aside", { className: [
                    "absolute bottom-0 left-0 w-64 origin-bottom-left rounded-xl border bg-background/85 p-3 text-sm shadow-lg backdrop-blur",
                    "transition-[opacity,transform] duration-200 ease-out",
                    open
                        ? "pointer-events-auto scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0",
                ].join(" "), "aria-hidden": !open, children: [_jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [_jsx("p", { className: "text-sm font-normal text-muted-foreground", children: "Ask Zo to update theme" }), _jsx("button", { type: "button", onClick: () => setOpen(false), className: "cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", "aria-label": "Collapse theme picker", children: _jsx(CloseIcon, { className: "size-4" }) })] }), _jsx("div", { children: _jsx(CopyablePrompt, { prompt: prompt, iconSide: "right", className: "rounded-lg border border-dashed px-3 py-1.5 text-xs leading-relaxed", children: prompt }) }), _jsx("div", { className: "mt-4", children: _jsx(PresetSection, { presets: SPACE_THEME_PRESETS, selectedId: themeId, onSelect: onThemeChange }) }), _jsx(PresetSection, { title: "Background", presets: SPACE_BACKGROUND_PRESETS, selectedId: backgroundId, onSelect: onBackgroundChange })] }), _jsx("button", { type: "button", onClick: () => setOpen(true), className: [
                    "flex cursor-pointer items-center rounded-full border bg-background/85 p-2 text-sm text-[var(--space-primary-muted)] shadow-lg backdrop-blur",
                    "transition-[opacity,transform,border-color,color] duration-200 ease-out hover:border-[var(--space-primary)] hover:text-[var(--space-primary)]",
                    open
                        ? "pointer-events-none scale-95 opacity-0"
                        : "pointer-events-auto scale-100 opacity-100",
                ].join(" "), "aria-label": "Open theme picker", children: _jsx(ThemeIcon, { className: "size-4" }) })] }));
}
function BrandIcon({ className, path, viewBox = "0 0 24 24", }) {
    return (_jsx("svg", { className: `${className ?? ""} block`, viewBox: viewBox, fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { d: path }) }));
}
const BRAND_ICONS = {
    instagram: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5A1.25 1.25 0 1 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    linkedin: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 17.5v-7.16H5.95v7.16h2.39ZM7.15 9.36c.83 0 1.35-.55 1.35-1.24-.02-.7-.52-1.24-1.33-1.24-.81 0-1.35.54-1.35 1.24 0 .69.52 1.24 1.31 1.24h.02Zm10.9 8.14v-4.11c0-2.2-1.17-3.22-2.73-3.22-1.26 0-1.82.69-2.14 1.18v-1.01h-2.39c.03.67 0 7.16 0 7.16h2.39v-4c0-.21.02-.42.08-.57.17-.42.56-.85 1.21-.85.85 0 1.19.64 1.19 1.59v3.83h2.39Z",
    x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.291 19.49h2.039L6.486 3.24H4.298L17.61 20.644Z",
};
function InfoCard() {
    return (_jsx("section", { className: "rounded-lg border bg-card/80 px-6 py-4 text-sm leading-relaxed text-muted-foreground backdrop-blur-md", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx(InfoIcon, { className: "mt-1 size-5 shrink-0 text-[var(--space-primary)]" }), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { children: "Ask Zo to build anything and it will appear here. You can ask Zo to create new pages or APIs, and your Space can reference files from your Zo workspace." }), _jsx("p", { children: "Pages can be public (anyone can view) or private (only you can view). You control the visibility of each page." }), _jsx("p", { children: "Try copying the prompts on this page into the Zo chat to get started." }), _jsx(CopyablePrompt, { prompt: "Remove the info card from my Space", iconSide: "right", className: "rounded-lg border border-dashed px-3 py-1.5 text-sm" })] })] }) }));
}
function CardStack({ children }) {
    return _jsx("div", { className: "mt-10 space-y-3", children: children });
}
function SocialLinkCard({ platform, url, Icon, iconClassName = "size-5", }) {
    const className = "flex items-center gap-4 rounded-lg border border-[var(--space-primary-muted)]/50 bg-card/80 p-4 text-left shadow-[var(--space-card-shadow)] backdrop-blur-md transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-card/90 hover:shadow-[var(--space-card-hover-shadow)]";
    const addPrompt = `Add my ${platform} to my Space`;
    const promptClassName = "rounded-lg border border-dashed px-3 py-1.5 text-sm";
    if (url) {
        function openUrl() {
            window.open(url, "_blank", "noreferrer");
        }
        return (_jsxs("div", { role: "link", tabIndex: 0, onClick: openUrl, onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    if (event.target !== event.currentTarget)
                        return;
                    event.preventDefault();
                    openUrl();
                }
            }, className: `${className} cursor-pointer`, children: [_jsx(Icon, { className: `${iconClassName} shrink-0` }), _jsx("div", { className: "min-w-0 select-text", children: _jsx(CopyablePrompt, { prompt: addPrompt, iconSide: "right", className: promptClassName }) })] }));
    }
    return (_jsxs("div", { className: className, children: [_jsx(Icon, { className: `${iconClassName} shrink-0` }), _jsxs("div", { className: "min-w-0 select-text", children: [_jsx(CopyablePrompt, { prompt: addPrompt, iconSide: "right", className: promptClassName }), _jsx(CopyablePrompt, { prompt: "ask Zo to remove this card", className: "mt-1 flex text-sm text-muted-foreground hover:text-foreground", children: "or ask Zo to remove this card" })] })] }));
}
function SocialLinks() {
    return (_jsxs(_Fragment, { children: [_jsx(SocialLinkCard, { platform: "Instagram", url: SOCIAL_LINKS.instagram, Icon: (props) => _jsx(BrandIcon, { ...props, path: BRAND_ICONS.instagram }), iconClassName: "size-5 text-[#E4405F]" }), _jsx(SocialLinkCard, { platform: "LinkedIn", url: SOCIAL_LINKS.linkedin, Icon: (props) => _jsx(BrandIcon, { ...props, path: BRAND_ICONS.linkedin }), iconClassName: "size-5 text-[#0A66C2]" }), _jsx(SocialLinkCard, { platform: "X", url: SOCIAL_LINKS.x, Icon: (props) => _jsx(BrandIcon, { ...props, path: BRAND_ICONS.x }), iconClassName: "size-[18px] text-[var(--space-brand-x)]" })] }));
}
function ImageCard({ src, alt, caption, prompt, captionPosition = "top", imageClassName = "h-auto w-full", }) {
    const captionElement = (_jsxs("figcaption", { className: "p-4 text-sm leading-relaxed text-muted-foreground", children: [caption, prompt ? (_jsx(CopyablePrompt, { prompt: prompt, iconSide: "right", className: "mt-3 rounded-lg border border-dashed px-3 py-1.5 text-sm" })) : null] }));
    return (_jsxs("figure", { className: "overflow-hidden rounded-lg border bg-card/80 backdrop-blur-md", children: [captionPosition === "top" ? captionElement : null, _jsx("img", { src: src, alt: alt, className: imageClassName }), captionPosition === "bottom" ? captionElement : null] }));
}
function FirstWebsiteCard() {
    return (_jsx(ImageCard, { src: "/images/first-website.png", alt: "The first World Wide Web website", caption: _jsx(_Fragment, { children: "This was the first site on the World Wide Web. In the 90s and 2000s, the early internet was young, wild, and free. It's time to re-wild the internet. Make this space yours." }), captionPosition: "bottom", imageClassName: "h-[150px] w-full object-cover object-top" }));
}
function Heading({ children }) {
    return (_jsx("h1", { className: "text-3xl font-normal tracking-tight text-foreground md:text-4xl", children: children }));
}
function Subheading({ children }) {
    return (_jsx("p", { className: "pt-2 text-3xl font-normal tracking-tight text-muted-foreground md:text-4xl", children: children }));
}
export default function Home({ error }) {
    const [themeId, setThemeId] = React.useState(DEFAULT_SPACE_THEME_ID);
    const [backgroundId, setBackgroundId] = React.useState(DEFAULT_SPACE_BACKGROUND_ID);
    return (_jsxs("main", { "data-space-theme": themeId, "data-space-background": backgroundId, style: getHomeStyle(themeId, backgroundId), className: "space-ambient-bg min-h-screen", children: [error && (_jsx("div", { className: "bg-destructive/10 border-b border-destructive/20 px-4 py-3", children: _jsxs("div", { className: "mx-auto max-w-2xl space-y-2 py-1", children: [_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx(AlertTriangleIcon, { className: "size-5 text-destructive shrink-0" }), _jsx("p", { className: "text-destructive", children: "Your custom home page encountered an error. Showing the default page instead." })] }), _jsx("pre", { className: "text-left text-xs bg-destructive/5 p-3 rounded-md overflow-auto max-h-48 text-destructive/80", children: error.message || "Unknown error" })] }) })), _jsxs("div", { className: "mx-auto max-w-2xl px-6 pb-64 pt-10 md:pb-56 md:pt-14", children: [_jsxs("header", { className: "text-center", children: [_jsx(Heading, { children: "Welcome to your Zo Space" }), _jsx(Subheading, { children: "Your personal website on Zo" })] }), _jsxs(CardStack, { children: [_jsx(FirstWebsiteCard, {}), _jsx(InfoCard, {}), _jsx(SocialLinks, {})] })] }), _jsx(ThemePresetPanel, { themeId: themeId, backgroundId: backgroundId, onThemeChange: setThemeId, onBackgroundChange: setBackgroundId })] }));
}
