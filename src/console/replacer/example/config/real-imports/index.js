/* const cleanupCnf = require("./cleanup.cnf").default;
const downloadMiddlewareCnf = require("./downloadMiddleware.cnf").default;
const mainMiddlewareCnf = require("./mainMiddleware.cnf").default;
const authMiddlewareCnf = require("./auth.cnf").default;
const checkRoleMiddlewareCnf = require("./checkRole.cnf").default;

exports.default = [
  ...cleanupCnf,
  ...downloadMiddlewareCnf,
  //...cnfCnf,
  ...mainMiddlewareCnf,
  ...authMiddlewareCnf,
  ...checkRoleMiddlewareCnf,
];
 */

const { join } = require("path");

const importsCommonCnf = require(join(
  process.cwd(),
  "src",
  "console",
  "replacer",
  "example",
  "config",
  "common",
  "index.js"
)).default;

//const importsCommonCnf = require("./../commmon/index").default;

const realImportsCnf = importsCommonCnf.map((cnf) => {
  return {
    ...cnf,
    options: cnf.options.map((opt) => {
      opt.isFake = false;
      opt.identifier = `${opt.identifier} | REAL IMPORTS`;
      opt.type = "FAKE_API";

      return opt;
    }),
  };
});

exports.default = realImportsCnf;
