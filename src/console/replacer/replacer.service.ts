import { ReplacerType } from "./types";
import {
  chain,
  compose,
  cond,
  Done,
  NI_Next,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { existsSync } from "fs";

export const getFullLine = (searchTerm: string, content: string) => {
  const startSymbol = "\n";
  const lastSymbol = "\n";

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
  fReplaceable: string;
  replaceable: string;
  replacement: string;
  isReplaceableInFile: boolean;
  isReplacementInFile: boolean;
};

export const checkIfNeedReplace = compose(
  (data: CheckIfNeedReplaceProps) => ({
    ...data,
    isReplaceableInFile: data.content.indexOf(data.fReplaceable) !== -1,
    isReplacementInFile: data.content.indexOf(data.replacement) !== -1,
  }),
  cond<CheckIfNeedReplaceProps, boolean>([
    [
      (data: CheckIfNeedReplaceProps) =>
        data.isReplaceableInFile === true && data.isReplacementInFile === true,
      (data: CheckIfNeedReplaceProps) => NI_Next.of(data),
    ],

    [
      (data: CheckIfNeedReplaceProps) =>
        data.isReplaceableInFile === false && data.isReplacementInFile === true,
      (data: CheckIfNeedReplaceProps) => Done.of(data),
    ],

    [
      (data: CheckIfNeedReplaceProps) =>
        data.isReplaceableInFile === true && data.isReplacementInFile === false,
      (data: CheckIfNeedReplaceProps) => NI_Next.of(data),
    ],

    [
      (data: CheckIfNeedReplaceProps) =>
        data.isReplaceableInFile === false &&
        data.isReplacementInFile === false,
      (data: CheckIfNeedReplaceProps) =>
        Done.of({
          ...data,
          error: `We got no replacable content | "${data.replaceable}" | in file.`,
        }),
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
