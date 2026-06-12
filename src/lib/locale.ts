import { useEffect, useState } from "react";

export type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

export const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

export const UI_COPY: Record<LocaleKey, {
  loading: string;
  pageNotFound: string;
  builtOnZo: string;
  collapseThemePicker: string;
  openThemePicker: string;
  copyPromptPrefix: string;
  askZoUpdateTheme: string;
  background: string;
  freeToUse: string;
  noSignUp: string;
  worksOnAnyDevice: string;
}> = {
  en: {
    loading: "Loading...",
    pageNotFound: "Page not found",
    builtOnZo: "Built on Zo",
    collapseThemePicker: "Collapse theme picker",
    openThemePicker: "Open theme picker",
    copyPromptPrefix: "Copy prompt: ",
    askZoUpdateTheme: "Ask Zo to update theme",
    background: "Background",
    freeToUse: "Free to use",
    noSignUp: "No sign-up required",
    worksOnAnyDevice: "Works on any device",
  },
  "zh-hk": {
    loading: "載入中…",
    pageNotFound: "搵唔到頁面",
    builtOnZo: "以 Zo 建立",
    collapseThemePicker: "收合主題選擇器",
    openThemePicker: "開啟主題選擇器",
    copyPromptPrefix: "複製提示：",
    askZoUpdateTheme: "請 Zo 更新主題",
    background: "背景",
    freeToUse: "免費使用",
    noSignUp: "唔使註冊",
    worksOnAnyDevice: "適用於任何裝置",
  },
  "zh-cn": {
    loading: "加载中…",
    pageNotFound: "页面未找到",
    builtOnZo: "基于 Zo 构建",
    collapseThemePicker: "收起主题选择器",
    openThemePicker: "打开主题选择器",
    copyPromptPrefix: "复制提示：",
    askZoUpdateTheme: "让 Zo 更新主题",
    background: "背景",
    freeToUse: "免费使用",
    noSignUp: "无需注册",
    worksOnAnyDevice: "适用于任何设备",
  },
  es: {
    loading: "Cargando...",
    pageNotFound: "Página no encontrada",
    builtOnZo: "Construido en Zo",
    collapseThemePicker: "Cerrar selector de tema",
    openThemePicker: "Abrir selector de tema",
    copyPromptPrefix: "Copiar prompt: ",
    askZoUpdateTheme: "Pedir a Zo que actualice el tema",
    background: "Fondo",
    freeToUse: "Gratis",
    noSignUp: "Sin registro",
    worksOnAnyDevice: "Funciona en cualquier dispositivo",
  },
};

export function useLocale(): LocaleKey {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    return (window.localStorage.getItem("ttb-locale") as LocaleKey) || "en";
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ttb-locale", locale);
    }
  }, [locale]);
  return locale;
}
