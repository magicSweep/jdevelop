//import parse from "minimist";
//import parse from "minimist";
import { join } from "path";
import createReactFunc from "./../console/createReactFunc";
import { withFileOperations } from "./../console/replacer";
import {
  makeConfigs,
  prepareCnfPaths,
} from "./../console/replacer/replacer.service";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

type Arguments = {
  cmd: "replacer" | "create-react-func";
  // Create-react-func args
  // function name
  name: string;
  // path to function
  path: string;
  // Replacer args
  // path to config file, can be set multiple times
  cnf: string;
  // path to main directory for configs
  cnfDir: string;
};

const main = () => {
  //const args = parse(process.argv.slice(2));
  //@ts-ignore
  const argv: Arguments = yargs(hideBin(process.argv)).argv;

  switch (argv.cmd) {
    case "create-react-func":
      createReactFunc({
        name: argv.name,
        cnfPath: join(process.cwd(), "src", argv.path),
      });
      break;
    case "replacer":
      //replacer(join(process.cwd(), args.config));
      const paths = prepareCnfPaths(argv.cnf, argv.cnfDir);

      const configs = makeConfigs(paths);

      withFileOperations(configs);
      break;

    default:
      console.error(`UNKNOWN COMMAND --- ${argv.cmd} ---`);
  }
};

main();
