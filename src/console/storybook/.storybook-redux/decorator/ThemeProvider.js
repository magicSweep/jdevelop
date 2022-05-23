import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { createTheme } from "./../../src/style/theme";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";

const Layout = ({ children, darkState, onThemeChange }) => {
  return (
    <Box bgcolor="background.paper">
      <Box
        //width="50px"
        //height="50px"
        borderRadius="50%"
        paddingX="4px"
        paddingY="12px"
        position="fixed"
        bottom="50px"
        left="0"
        zIndex={4000}
        bgcolor="#cf8affe6"
      >
        <Switch checked={darkState} onChange={onThemeChange} />
      </Box>
      {children}
    </Box>
  );
};

const MaterialThemeProvider = (storyFn) => {
  const [darkState, setDarkState] = useState(false);

  const theme = createTheme(darkState);

  const handleThemeChange = () => {
    setDarkState((prevDarkState) => !prevDarkState);
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout darkState={darkState} onThemeChange={handleThemeChange}>
        {storyFn()}
      </Layout>
    </ThemeProvider>
  );
};
export default MaterialThemeProvider;
