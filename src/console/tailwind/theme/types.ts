export type ThemeType = "dark" | "light";

export interface ThemeVars {
  primary: string;
  secondary: string;
  paper: string;
  disabled: string;
  title: string;
  body: string;
  white: string;
  error: string;
  info: string;
  warning: string;
  success: string;
}

export interface Themes {
  dark: ThemeVars;
  light: ThemeVars;
}
