import { join } from "path";
import { withFileOperations } from ".";
import { makeConfigs, prepareCnfPaths } from "./replacer.service";
//import { realImportsCnf } from "./example/config/real-imports";
//import { otherCnf } from "./example/config/other";

// we call replacer with params -config /path1 -config /path2 -config /path3
// we must concat all configs and concat duplications with same pathToFile value
describe.skip("Real world replace import test", () => {
  test("", async () => {
    const paths = prepareCnfPaths(
      ["real-imports/index.js", "other/index.js", "cnf/index.js"],
      "src/console/replacer/example/config"
    );

    const configs = makeConfigs(paths);

    await withFileOperations(configs);
  });
});
