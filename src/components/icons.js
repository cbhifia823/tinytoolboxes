import { jsx as _jsx } from "react/jsx-runtime";
import { Alert02Icon, Cancel01Icon, Copy01Icon, InformationCircleIcon, PaintBoardIcon, Tick02Icon, } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
function icon(iconData, displayName) {
    function Component({ className, size, strokeWidth = 1.75, }) {
        return (_jsx(HugeiconsIcon, { icon: iconData, size: size, strokeWidth: strokeWidth, className: className }));
    }
    Component.displayName = displayName;
    return Component;
}
// Icon setup for the default Space shell.
// - Hugeicons is the default for shell UI/system icons. It has a polished outline
//   style and a broad free pack: https://hugeicons.com/icons
// - Add more Hugeicons by importing SVG data from @hugeicons/core-free-icons (or
//   another Hugeicons pack) and wrapping it with icon(...).
// - Brand logos should usually stay as exact local SVG paths in the component
//   that uses them. Social platforms need their real marks, colors, and weights.
// - For generated user routes, lucide-react is still the safest compatibility
//   default because older Spaces already have it and the agent sysprompt teaches
//   it. Do not remove icon packages from package.json without a migration plan.
export const AlertTriangleIcon = icon(Alert02Icon, "AlertTriangleIcon");
export const CheckIcon = icon(Tick02Icon, "CheckIcon");
export const CloseIcon = icon(Cancel01Icon, "CloseIcon");
export const CopyIcon = icon(Copy01Icon, "CopyIcon");
export const InfoIcon = icon(InformationCircleIcon, "InfoIcon");
export const ThemeIcon = icon(PaintBoardIcon, "ThemeIcon");
