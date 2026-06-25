import { lazy, type ComponentType } from "react";

export interface PageRouteConfig {
  component: ComponentType;
  public: boolean;
}

export const pageRoutes: Record<string, PageRouteConfig> = {
  "/case-converter": {
    component: lazy(() => import("./case-converter")),
    public: true,
  },
  "/": {
    component: lazy(() => import("./_home")),
    public: true,
  },
  "/age-calculator": {
    component: lazy(() => import("./age-calculator")),
    public: true,
  },
  "/business-day-calculator": {
    component: lazy(() => import("./business-day-calculator")),
    public: true,
  },
  "/currency-converter": {
    component: lazy(() => import("./currency-converter")),
    public: true,
  },
  "/date-difference-calculator": {
    component: lazy(() => import("./date-difference-calculator")),
    public: true,
  },
    "/discount-calculator": {
    component: lazy(() => import("./discount-calculator")),
    public: true,
  },
  "/dhl-dimensional-weight-calculator": {
    component: lazy(() => import("./dhl-dimensional-weight-calculator")),
    public: true,
  },
  "/fedex-dimensional-weight-calculator": {
    component: lazy(() => import("./fedex-dimensional-weight-calculator")),
    public: true,
  },
  "/invoice-due-date-calculator": {
    component: lazy(() => import("./invoice-due-date-calculator")),
    public: true,
  },
    "/json-formatter": {
    component: lazy(() => import("./json-formatter")),
    public: true,
  },
  "/loan-calculator": {
    component: lazy(() => import("./loan-calculator")),
    public: true,
  },
  "/percentage-calculator": {
    component: lazy(() => import("./percentage-calculator")),
    public: true,
  },
  "/rhyme-zone": {
    component: lazy(() => import("./rhyme-zone")),
    public: true,
  },
  "/time-zone-converter": {
    component: lazy(() => import("./time-zone-converter")),
    public: true,
  },
  "/unit-converter": {
    component: lazy(() => import("./unit-converter")),
    public: true,
  },
  "/tip-calculator": {
    component: lazy(() => import("./tip-calculator")),
    public: true,
  },
  "/ups-dimensional-weight-calculator": {
    component: lazy(() => import("./ups-dimensional-weight-calculator")),
    public: true,
  },
  "/url-encoder-decoder": {
    component: lazy(() => import("./url-encoder-decoder")),
    public: true,
  },
  "/volumetric-weight-calculator": {
    component: lazy(() => import("./volumetric-weight-calculator")),
    public: true,
  },
  "/word-counter": {
    component: lazy(() => import("./word-counter")),
    public: true,
  },
  "/base64-encoder-decoder": {
    component: lazy(() => import("./base64-encoder-decoder")),
    public: true,
  },
  "/bmi-calculator": {
    component: lazy(() => import("./bmi-calculator")),
    public: true,
  },
  "/calorie-calculator": {
    component: lazy(() => import("./calorie-calculator")),
    public: true,
  },
  "/can-my-dog-eat": {
    component: lazy(() => import("./can-my-dog-eat")),
    public: true,
  },
  "/can-my-cat-eat": {
    component: lazy(() => import("./can-my-cat-eat")),
    public: true,
  },
  "/cat-age-calculator": {
    component: lazy(() => import("./cat-age-calculator")),
    public: true,
  },
  "/chocolate-toxicity-calculator": {
    component: lazy(() => import("./chocolate-toxicity-calculator")),
    public: true,
  },
  "/dog-age-calculator": {
    component: lazy(() => import("./dog-age-calculator")),
    public: true,
  },
  "/lily-toxicity-checker": {
    component: lazy(() => import("./lily-toxicity-checker")),
    public: true,
  },
  "/mortgage-calculator-australia": {
    component: lazy(() => import("./mortgage-calculator-australia")),
    public: true,
  },
  "/pet-calorie-calculator": {
    component: lazy(() => import("./pet-calorie-calculator")),
    public: true,
  },
  "/famous-birthdays": {
    component: lazy(() => import("./famous-birthdays")),
    public: true,
  },
  "/password-generator": {
    component: lazy(() => import("./password-generator")),
    public: true,
  },
  "/wheel-spinner": {
    component: lazy(() => import("./wheel-spinner")),
    public: true,
  },
  "/minesweeper": {
    component: lazy(() => import("./minesweeper")),
    public: true,
  },
  "/xylitol-toxicity-calculator": {
    component: lazy(() => import("./xylitol-toxicity-calculator")),
    public: true,
  },
  "/breed/:slug": {
    component: lazy(() => import("./breed")),
    public: true,
  },
  "/breeds": {
    component: lazy(() => import("./breeds-index")),
    public: true,
  },
  "/about": {
    component: lazy(() => import("./about")),
    public: true,
  },
  "/contact": {
    component: lazy(() => import("./contact")),
    public: true,
  },
  "/privacy-policy": {
    component: lazy(() => import("./privacy-policy")),
    public: true,
  },
  "/puppy-adult-weight-calculator": {
    component: lazy(() => import("./puppy-adult-weight-calculator")),
    public: true,
  },
  "/pet-body-condition-score": {
    component: lazy(() => import("./pet-body-condition-score")),
    public: true,
  },
  "/qr-code-generator": {
    component: lazy(() => import("./qr-code-generator")),
    public: true,
  },
  "/unix-timestamp-converter": {
    component: lazy(() => import("./unix-timestamp-converter")),
    public: true,
  },
