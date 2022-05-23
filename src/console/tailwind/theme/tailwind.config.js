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

const colors = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  disabled: "var(--color-disabled)",
  white: "var(--color-white)",
  error: "var(--color-error)",
  info: "var(--color-info)",
  warning: "var(--color-warning)",
  success: "var(--color-success)",
  body: "var(--color-text)",
  title: "var(--color-title)",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "bg-success",
    "bg-primary",
    "bg-secondary",
    "text-success",
    "text-info",
    "text-secondary",
    "text-warning",
    "text-primary",
  ],
  /*  options: {
        keyframes: false,
      }, */

  //darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        /* primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          disabled: "var(--color-disabled)", */
        ...colors,
        paper: "var(--color-paper)",
        backdrop: "rgba(0, 0, 0, 0.3)",
        //"btn-hover": "var(--color-btn-hover)"
      },
      textColor: {
        //title: "var(--color-title)",
        //body: "var(--color-body)",
        ...colors,
        /* disabled: "var(--color-disabled)",
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)", */
      },
      borderColor: {
        ...colors,
      },
      maxHeight: {
        600: "600px",
        "9/10": "90%",
      },
      height: {
        18: "72px",
        194: "194px",
      },
      width: {
        600: "600px",
        345: "345px",
      },
      minHeight: {
        34: "34px",
        44: "44px",
        260: "260px",
        330: "330px",
      },
      minWidth: {
        44: "44px",
        400: "400px",
      },
      maxWidth: {
        500: "500px",
        600: "600px",
        700: "700px",
      },
    },
  },
  variants: {
    extend: {
      padding: ["last"],
    },
  },
  plugins: [],
};
