# Helper functions for functional programming

## Build and publish

- commit and push changes
- run $ npm run build:lib
- run $ npm run release

## CLI

- $ npm run jdevelop --cmd=create-react-func --name=FuncName --path=component - path - related to src dir. --path=component means rootDir/src/component/FuncName

- $ npm run jdevelop --cmd=replacer --config=config/replacer.config.js - config - path to config file - related to root dir rootDir/config/replacer.config.js

```javascript
// package.json example

{
  "scripts": {
    "fake-imports": "jdevelop --cmd=replacer --config=src/config/replacer/fake-imports.config.js",
  },
}
```

```javascript
// replacer.config.js example

exports.default = [
  {
    pathToFile: "src/path-to-file/file.ts",
    // identify in log messages
    identifier: "TEST REPLACER | FAKE WORKER",
    replaceable: "api/worker",
    replacement: "api/worker.fake",
  },
  {
    pathToFile: "src/path-to-file/file2.ts",
    identifier: "TEST REPLACER | BUNDLE ANALYSER",
    // be caution with quatation marks when wanna comment something
    replaceable: '"gatsby-plugin-webpack-bundle-analyser-v2"',
    replacement: '//"gatsby-plugin-webpack-bundle-analyser-v2"',
  },
  {
    pathToFile: "src/path-to-file/config.ts",
    identifier: "TEST REPLACER | CONFIG",
    // replace full line with given replaceable
    // in our case it will be search something like - export const numberOfPhotosPerQuery = 9;
    doesReplaceFullLine: true,
    replaceable: "numberOfPhotosPerQuery",
    replacement: `export const numberOfPhotosPerQuery = calcPhotosLimitPerQuery(
        photoCardWidth,
        photoCardHeight
      );`,
  },
];
```
