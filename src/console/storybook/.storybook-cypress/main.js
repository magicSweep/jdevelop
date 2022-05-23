const path = require("path");

module.exports = {
  //stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  stories: [
    //"../src/photos/form/cypress-stories/*.stories.@(js|jsx|ts|tsx)",
    "../src/stories/cypress/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    {
      //https://github.com/storybookjs/storybook/tree/master/addons/essentials
      name: "@storybook/addon-essentials",
      options: {
        docs: false,
        controls: false,
        viewport: false,
        //actions: fasle,
        backgrounds: false,
        toolbars: false,
      },
    },
  ],
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config) => {
    // SCSS
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        //"sass-loader",
        /*  {
          loader: "css-loader",
          options: {
            // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
            // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
            //importLoaders: 1,
            // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
            modules: {
              auto: true,
              compileType: "module",
              namedExport: true,
            },
            //esModule: true,
          },
        }, */
        "sass-loader",
        /*  {
          loader: "sass-loader",
          // options: {
          // Prefer `dart-sass`
          //   implementation: require("sass"),
          // },
        },  */
      ],
      //include: path.resolve(__dirname, "../"),
    });
    // SCSS

    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve("babel-loader");
    // use @babel/preset-react for JSX and env (instead of staged presets)
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-env"),
    ];
    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve("@babel/plugin-proposal-class-properties"),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries"),
    ];
    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"];
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]],
        plugins: [
          require.resolve("@babel/plugin-proposal-class-properties"),
          // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
          require.resolve("babel-plugin-remove-graphql-queries"),
        ],
      },
    });
    config.resolve.extensions.push(".ts", ".tsx");

    // !!!!!!!!!!!
    config.resolve.fallback = {
      http: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};
