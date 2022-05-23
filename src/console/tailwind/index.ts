import { compose, set, tap } from "fmagic";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const addTailwind = compose<void, void>(
  // add post css to webpack css-loader
  // create tailwind.config.js
  () => {
    const pathTailwindCnf = join(process.cwd(), "tailwind.config.js");

    if (existsSync(pathTailwindCnf) === false) {
      writeFile(
        pathTailwindCnf,
        `
    module.exports = {
        content: ["./src/**/*.{js,jsx,ts,tsx}"],
        theme: {
            extend: {},
        },
        plugins: [],
    }
          `,
        { encoding: "utf-8" }
      );
    }
  },
  // create postcss.config.js
  // "postcss-import": "^14.0.2",
  () => {
    const pathToPostCssCnf = join(process.cwd(), "postcss.config.js");

    if (existsSync(pathToPostCssCnf) === false) {
      writeFile(
        pathToPostCssCnf,
        `
    module.exports = {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        }
    }
          `,
        { encoding: "utf-8" }
      );
    }
  },
  // create css files
  async () => {
    const pathToMainCss = join(process.cwd(), "src", "styles", "index.css");

    /* @tailwind base;
@tailwind components;
@tailwind utilities; */
    const importsContent = `
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";
    `;

    if (existsSync(pathToMainCss) === true) {
      // get content
      const content = await readFile(pathToMainCss, {
        encoding: "utf-8",
      });
      // add tailwind imports
      const newContent = `
  ${importsContent}
  ${content}
      `;
      // save to file
      writeFile(pathToMainCss, newContent, { encoding: "utf-8" });
    } else {
      // save file
      writeFile(pathToMainCss, importsContent, {
        encoding: "utf-8",
      });
    }
  }
  // add index.css import to App file
  // npm install -D tailwindcss postcss autoprefixer
);

export default addTailwind;
