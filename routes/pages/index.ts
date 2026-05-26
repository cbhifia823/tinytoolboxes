import { lazy, type ComponentType } from "react";

export interface PageRouteConfig {
  component: ComponentType;
  public: boolean;
}

export const pageRoutes: Record<string, PageRouteConfig> = {};
