import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import {
  cond,
  compose,
  NI_Next,
  Done,
  map,
  then,
  chain,
  thenDoneFold,
  _catch,
  tap,
} from "fmagic";
import { join } from "path";

// REPLACE PARTS OF FILE
// FOR EXAMPLE IMPORTS: from "../hello" to "../hello.fake"
// OR CONFIG: from const hello = "dev" to const hello = "prod"

type ReplacerData = ReplacerConfig & {
  content: string;
  newContent: string;
  replaceableInFile: boolean;
  replacementInFile: boolean;
  error: any;
};

export type ReplacerConfig = {
  // file to work with
  pathToFile: string;
  // identify in log messages
  identifier: string;
  replaceable: string;
  replacement: string;
};

// numberOfPhotosPerQuery from number to calcPhotosLimitPerQuery
export const replacer_ = (
  existsSync_: typeof existsSync,
  readFile_: typeof readFile,
  writeFile_: typeof writeFile
) =>
  compose<ReplacerConfig, Promise<void>>(
    (config: ReplacerConfig) =>
      existsSync_(config.pathToFile) === false
        ? Done.of(`File does not exists | ${config.pathToFile}`)
        : NI_Next.of(config),
    // GET CONTENT FROM FILE
    chain(
      compose(
        async (config: ReplacerConfig) => ({
          ...config,
          content: await readFile_(config.pathToFile, {
            encoding: "utf-8",
          }),
        }),
        then(NI_Next.of),
        _catch((err: any) => {
          return Done.of({
            err,
          });
        })
      )
    ),

    // Get full string with
    /* then(
      map((data: ReplacerData) => {
        const chunkIndex = data.content.indexOf(data.strPartToIdentify);
        let startIndex = data.content.lastIndexOf(data.strStart, chunkIndex);
        let endIndex = data.content.indexOf(data.strEnd, chunkIndex);

        //console.log("BOOM1-----------", data.content[endIndex].charCodeAt(0));

        startIndex =
          data.doesIncludeFirstSymbol === false ? startIndex + 1 : startIndex;
        endIndex =
          data.doesIncludeLastSymbol === true ? endIndex + 1 : endIndex;

        //console.log("BOOM2-----------", data.content[endIndex].charCodeAt(0));

        data.fullSearchedString = data.content.substring(startIndex, endIndex);

        return data;
      })
    ), */

    then(
      map((data: ReplacerData) => ({
        ...data,
        replaceableInFile: data.content.indexOf(data.replaceable) !== -1,
        replacementInFile: data.content.indexOf(data.replacement) !== -1,
      }))
    ),

    then(
      chain(
        cond([
          [
            (data: ReplacerData) =>
              data.replaceableInFile === true &&
              data.replacementInFile === true,
            (data: ReplacerData) => NI_Next.of(data),
          ],

          [
            (data: ReplacerData) =>
              data.replaceableInFile === false &&
              data.replacementInFile === true,
            (data: ReplacerData) => Done.of(data),
          ],

          [
            (data: ReplacerData) =>
              data.replaceableInFile === true &&
              data.replacementInFile === false,
            (data: ReplacerData) => NI_Next.of(data),
          ],

          [
            (data: ReplacerData) =>
              data.replaceableInFile === false &&
              data.replacementInFile === false,
            (data: ReplacerData) =>
              Done.of({
                ...data,
                error: `We got no replacable content | "${data.replaceable}" | in file.`,
              }),
          ],
        ])
      )
    ),

    // Analyze if need to do anything
    /* then(
      chain((data: ReplacerData) => {
        const isNeedChanges =
          data.fullSearchedString.replace(/\s+/g, "") !==
          data.variants[data.neededVariantIndex].replace(/\s+/g, "");

        return isNeedChanges === true
          ? NI_Next.of(data)
          : Done.of("No need to change...");
      })
    ), */

    // Replace string
    then(
      map((data: ReplacerData) => ({
        ...data,
        newContent: data.content.replace(data.replaceable, data.replacement),
      }))
    ),

    then(
      chain(
        compose(
          async (data: ReplacerData) => {
            await writeFile_(data.pathToFile, data.newContent, {
              encoding: "utf-8",
            });

            return data;
          },
          then(NI_Next.of),
          _catch((err: any) =>
            Done.of({
              error: err,
            })
          )
        )
      )
    ),

    thenDoneFold(
      (data: ReplacerData) => {
        if (data.error !== undefined) {
          console.log(`----${data.identifier} - ERROR`, data.error);
        }

        console.log(`----${data.identifier} - INFO`, "NO NEED TO DO ANYTHING");
      },
      (data: ReplacerData) => {
        console.log(`----${data.identifier} - SUCCESS`);
      }
    )
  );

export const replacer = replacer_(existsSync, readFile, writeFile);

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

export const withLoadConfig = withLoadConfig_(existsSync, replacer);
