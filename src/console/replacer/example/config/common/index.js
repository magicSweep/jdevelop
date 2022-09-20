exports.default = [
  {
    pathToFile: "replacer-example/for-replace/one.js",
    // identify in log messages
    options: [
      {
        identifier: "REPLACER | AUTH MIDDLEWARE",
        replaceable: "../api/Broker",
      },
      {
        identifier: "REPLACER | CHECK ROLE MIDDLEWARE",
        replaceable: "../api/Joker",
      },
      {
        identifier: "REPLACER | 1 CLEAN UP CONTROLLER",
        replaceable: "../api/worker",
      },
    ],
  },
  {
    pathToFile: "replacer-example/for-replace/two.js",
    // identify in log messages
    options: [
      {
        identifier: "REPLACER | 1 CLEAN UP CONTROLLER",
        replaceable: "../api/stoker",
      },
    ],
  },
];
