import { Themes, ThemeVars } from "./types";

/* const colors = {
  primary: "#1976d2", // "#7986cb", //#303f9f
  secondary: "#9c27b0", //"#ff4081",
  paper: "#fff",
  white: "#fff",
  disabled: "#bdbdbd",
  title: "rgba(0, 0, 0, 0.87)",
  body: "rgba(0, 0, 0, 0.54)",
  error: "#d32f2f",
  info: "#0288d1",
  warning: "#ED6C02",
  success: "#2e7d32",
}; */

export const themes: Themes = {
  light: {
    primary: "#1976d2", // "#7986cb", //#303f9f
    secondary: "#9c27b0", //"#ff4081",
    paper: "#fff",
    white: "#fff",
    disabled: "#bdbdbd",
    title: "rgba(0, 0, 0, 0.87)",
    body: "rgba(0, 0, 0, 0.54)",
    error: "#d32f2f",
    info: "#0288d1",
    warning: "#ED6C02",
    success: "#2e7d32",
  },
  dark: {
    primary: "#1976d2", //#7986cb #3f51b5
    secondary: "#9c27b0", //"#c51162",
    paper: "#424242", //#303030 #424242
    white: "rgba(255, 255, 255, 0.87)",
    disabled: "rgba(255, 255, 255, 0.5)",
    title: "rgba(255, 255, 255, 0.87)",
    body: "rgba(255, 255, 255, 0.7)",
    error: "#d32f2f",
    info: "#0288d1",
    warning: "#ED6C02",
    success: "#2e7d32",
  },
};

export const mapTheme = (themeVariables: ThemeVars) => ({
  "--color-primary": themeVariables.primary,
  "--color-secondary": themeVariables.secondary,
  "--color-paper": themeVariables.paper,
  "--color-title": themeVariables.title,
  "--color-text": themeVariables.body,
  "--color-disabled": themeVariables.disabled,
  "--color-white": themeVariables.white,
  "--color-error": themeVariables.error,
  "--color-info": themeVariables.info,
  "--color-warning": themeVariables.warning,
  "--color-success": themeVariables.success,
});
