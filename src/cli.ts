//import parse from "minimist";
import parse from "minimist";
import { join } from "path";
import createReactFunc from "./console/createReactFunc";
import { withLoadConfig as replacer } from "./console/replacer";

const main = () => {
  const args = parse(process.argv.slice(2));

  switch (args.cmd) {
    case "create-react-func":
      createReactFunc({
        name: args.name,
        cnfPath: join(process.cwd(), "src", args.path),
      });
      break;
    case "replacer":
      replacer(join(process.cwd(), args.config));
      break;

    default:
      console.error(`UNKNOWN COMMAND --- ${args.cmd} ---`);
  }
};

main();
