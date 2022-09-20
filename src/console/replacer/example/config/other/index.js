exports.default = [
  {
    pathToFile: "replacer-example/for-replace/two.js",
    // identify in log messages
    options: [
      {
        identifier: "TEST REPLACER | CONFIG",
        type: "FULL_LINE",
        // replace full line with given replaceable
        // it search all chars between \n symbols
        // in our case it will be search something like - export const numberOfPhotosPerQuery = 9;
        replaceable: "numberOfPhotosPerQuery",
        replacement: `export const numberOfPhotosPerQuery = calcPhotosLimitPerQuery(
                photoCardWidth,
                photoCardHeight
              );`,
      },
    ],
  },
];
