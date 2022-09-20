import { ReplacerType } from "./types";
import {
  chain,
  compose,
  cond,
  Done,
  elif,
  NI_Next,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { join } from "path";

export const prepareCnfPaths = (
  cnfPaths: string[] | string,
  pathToDir?: string
) => {
  if (pathToDir === undefined) {
    if (typeof cnfPaths === "string") {
      return [cnfPaths];
    } else return cnfPaths;
  }

  if (typeof cnfPaths === "string") {
    return [join(pathToDir, cnfPaths)];
  }

  return cnfPaths.map((path) => join(pathToDir, path));
};

export const makeConfigs = (cnfPaths: string[]) => {
  const cs = cnfPaths.map((path) => require(join(process.cwd(), path)).default);
  let configs: any[] = [];

  cs.forEach((arr) => {
    configs = configs.concat(arr);
  });

  const keys = configs.map((v) => v.pathToFile);

  const uniqueKeys: any[] = [...new Set(keys)];

  const finalConfigs: any[] = [];

  uniqueKeys.forEach((key) => {
    const cnfObj: any = {
      pathToFile: key,
      options: [],
    };

    // we find all config with that pathToFile
    configs.forEach((cnf) => {
      if (cnf.pathToFile === key) {
        // and merge them in one config object
        cnfObj.options = [...cnfObj.options, ...cnf.options];
      }
    });

    // then add to our final config
    finalConfigs.push(cnfObj);
  });

  return finalConfigs;
};

export const getFullLine: (searchTerm: string, content: string) => string = (
  searchTerm,
  content
) => {
  const startSymbol = "\n";
  const lastSymbol = ";\n";

  const searchTermIndex = content.indexOf(searchTerm);
  let startIndex = content.lastIndexOf(startSymbol, searchTermIndex) + 1;
  let endIndex = content.indexOf(lastSymbol, searchTermIndex) + 1;

  /* startIndex =
        data.doesIncludeFirstSymbol === false ? startIndex + 1 : startIndex;
      endIndex =
        data.doesIncludeLastSymbol === true ? endIndex + 1 : endIndex; */

  //console.log("BOOM2-----------", data.content[endIndex].charCodeAt(0));

  const fullLine = content.substring(startIndex, endIndex);

  return fullLine;
};

type CheckIfNeedReplaceProps = {
  content: string;
  replaceable: string;
  replacement: string;
};

type CheckIfNeedReplaceData = CheckIfNeedReplaceProps & {
  isReplaceableInFile: boolean;
  isReplacementInFile: boolean;
};

export const checkIfNeedReplace = compose<
  CheckIfNeedReplaceProps,
  true | string
>(
  (data: CheckIfNeedReplaceProps) => ({
    ...data,
    isReplaceableInFile: data.content.indexOf(data.replaceable) !== -1,
    isReplacementInFile: data.content.indexOf(data.replacement) !== -1,
  }),
  cond<CheckIfNeedReplaceData, boolean>([
    [
      (data: CheckIfNeedReplaceData) =>
        data.isReplaceableInFile === true && data.isReplacementInFile === true,
      //(data: CheckIfNeedReplaceData) => "No need to do anything...",
      // We add this on detect changes needed in case we may find in file both - replacement and replaceable
      elif<CheckIfNeedReplaceData, true | string>(
        (data: CheckIfNeedReplaceData) => data.replaceable === data.replacement,
        () => "No need to do anything...",
        (data: CheckIfNeedReplaceData) =>
          data.replacement.length < data.replaceable.length
            ? true
            : "No need to do anything..."
      ),
    ],

    [
      (data: CheckIfNeedReplaceData) =>
        data.isReplaceableInFile === false && data.isReplacementInFile === true,
      (data: CheckIfNeedReplaceData) => "No need to do anything...",
    ],

    [
      (data: CheckIfNeedReplaceData) =>
        data.isReplaceableInFile === true && data.isReplacementInFile === false,
      (data: CheckIfNeedReplaceData) => true,
    ],

    [
      (data: CheckIfNeedReplaceData) =>
        data.isReplaceableInFile === false &&
        data.isReplacementInFile === false,
      (data: CheckIfNeedReplaceData) =>
        `We got no replacable content | "${data.replaceable}" | in file.`,
    ],
  ])
);

export const makeFinalReplaceable = (
  type: ReplacerType,
  replaceable: string,
  fileContent: string,
  isFake: boolean
) => {
  if (type === "FULL_LINE") {
    return getFullLine(replaceable, fileContent);
  }

  if (type === "FAKE_API") {
    return isFake === true ? replaceable : `${replaceable}/index.fake`;

    //return getFullLine(fReplaceable, fileContent);
  }

  return replaceable;
};

export const makeReplacement = (
  replaceable: string,
  replacement: string,
  type: ReplacerType,
  isFake: boolean
) => {
  if (type === "FAKE_API") {
    if (isFake === true) {
      return `${replaceable}/index.fake`;
    } else {
      return replaceable;
    }
  }

  return replacement;

  /* return type === "FAKE_API" && isFake === true
      ? `${replaceable}/index.fake`
      : replacement; */
};

export const withLoadConfig_ = (
  existsSync_: (path: string) => boolean,
  replacer: (cnf: any) => Promise<any>
) =>
  compose<string, void>(
    (pathToConfig: string) => ({
      pathToConfig,
      cnfExists: existsSync_(pathToConfig),
    }),
    (data: any) =>
      data.cnfExists === false
        ? Done.of({
            ...data,
            error: `---No config file for --replacer-- on path - ${data.pathToConfig}`,
          })
        : NI_Next.of(data),
    chain(
      compose(
        // require(pathToConfig)
        async (data: any) => {
          const module = await import(data.pathToConfig);

          return {
            ...data,
            arrOfCnf: module.default.default,
          };
        } /* ({
            ...data,
            arrOfCnf: (await import(data.pathToConfig)).default,
          }), */,
        then(NI_Next.of),
        _catch((err: any) => Done.of({ error: err }))
      )
    ),
    //then(tap(chain((data: any) => console.log("====TAP", data.arrOfCnf)))),
    then(
      chain((data: any) =>
        Array.isArray(data.arrOfCnf) === false
          ? Done.of({
              error: "Configuration must be array of configs",
            })
          : NI_Next.of(data)
      )
    ),
    thenDoneFold(
      (data: any) => {
        console.error("ERROR ON REPLACER", data.error);
      },
      (data: any) => {
        data.arrOfCnf.map(replacer);
      }
    )
  );
