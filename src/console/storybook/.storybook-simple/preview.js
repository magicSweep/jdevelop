import { addDecorator } from "@storybook/react";
import ThemeProvider from "./decorator/ThemeProvider";

addDecorator(ThemeProvider);

/* export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}; */
