# Helper functions for functional programming

## CLI

- $ npm run jdevelop --cmd=create-react-func --name=FuncName --path=component - path - related to src dir. --path=component means rootDir/src/component/FuncName

- $ npm run jdevelop --cmd=replacer --config=config/replacer.config.js - config - path to config file - related to root dir rootDir/config/replacer.config.js

```javascript
// package.json example

{
  "scripts": {
    // all paths start from root directory
    "fake-imports": "jdevelop -cmd replacer -cnfDir src/config/replacer -cnf fake-imports/config.js -cnf other/index.js",
  },
}
```

```javascript
// replacer.config.js example

exports.default = [
  {
    pathToFile: "src/path-to-file/file2.ts",
    options: [
      {
        identifier: "TEST REPLACER | BUNDLE ANALYSER",
        type: "SIMPLE",
        // be caution with quatation marks when wanna comment something
        replaceable: '"gatsby-plugin-webpack-bundle-analyser-v2",',
        replacement: '/*"gatsby-plugin-webpack-bundle-analyser-v2",*/',
      },
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
  {
    pathToFile: "src/path-to-file/file.ts",
    options: [
      {
        // identify in log messages
        identifier: "TEST REPLACER | FAKE WORKER",
        type: "FAKE_API",
        isFake: true,
        // you must follow fake api name convention - "../api/worker/index.fake
        replaceable: "../api/worker",
      },
    ],
  },
];
```

## Build and publish

- commit and push changes
- run $ npm run build:lib
- run $ npm run release
