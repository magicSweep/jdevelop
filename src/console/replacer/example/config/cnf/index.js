exports.default = [
  {
    pathToFile: "replacer-example/for-replace/two.js",
    // identify in log messages
    options: [
      {
        identifier: "TEST REPLACER | BUNDLE ANALYSER",
        type: "SIMPLE",
        // be caution with quatation marks when wanna comment something
        replaceable: '"gatsby-plugin-webpack-bundle-analyser-v2",',
        replacement: '/*"gatsby-plugin-webpack-bundle-analyser-v2",*/',
      },
    ],
  },
];
