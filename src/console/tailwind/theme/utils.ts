import { themes, mapTheme } from "./theme";
import { ThemeType } from "./types";

export const applyTheme = (theme: ThemeType): void => {
  if (typeof window === "undefined") return;

  const themeObject = mapTheme(themes[theme]);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === "name") {
      return;
    }
    //@ts-ignore
    root.style.setProperty(property, themeObject[property]);
  });
};
