import {
  chain,
  compose,
  cond,
  Done,
  map,
  NI_Next,
  tap,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import {
  checkIfNeedReplace,
  makeFinalReplaceable,
  makeReplacement,
  withLoadConfig_,
} from "./replacer.service";
import { ReplacerConfig } from "./types";

// TODO: make config manager - load and validate

type ReplacerData = ReplacerConfig & {
  content: string;
  newContent: string;
  fReplaceable: string;
  isReplaceableInFile: boolean;
  isReplacementInFile: boolean;
  error: any;
};

export const replacer_ = (
  existsSync_: typeof existsSync,
  writeFile_: typeof writeFile,
  readFile_: typeof readFile
) =>
  compose<ReplacerConfig, Promise<void>>(
    (props: ReplacerConfig) =>
      existsSync_(props.pathToFile) === false
        ? Done.of(`File does not exists | ${props.pathToFile}`)
        : NI_Next.of(props),

    // get file content
    chain(
      compose(
        async (data: ReplacerData) => ({
          ...data,
          content: await readFile_(data.pathToFile, {
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

    /* async (data: ReplacerData) => {
      return await getFileContent_(data);
    }, */

    // make replaceable
    then(
      map((data: ReplacerData) => ({
        ...data,
        fReplaceable: makeFinalReplaceable(
          data.type,
          data.replaceable,
          data.content,
          data.isFake === true
        ),
        replacement: makeReplacement(
          data.replaceable,
          data.replacement as string,
          data.type,
          data.isFake === true
        ),
      }))
    ),
    // check if need replace
    then(chain(checkIfNeedReplace)),

    /*   then(
      map(
        tap((data: any) => {
          console.log("-----STAGE 0", data);
        })
      )
    ), */

    // make replace
    then(
      map((data: ReplacerData) => ({
        ...data,
        newContent: data.content.replace(
          data.fReplaceable,
          data.replacement as string
        ),
      }))
    ),

    /* then(
      map(
        tap((data: any) => {
          console.log("-----STAGE 1", data);
        })
      )
    ),
 */
    // write file content
    then(
      chain(
        compose<ReplacerData, Promise<NI_Next<ReplacerData> | Done>>(
          async (props: ReplacerData) => {
            await writeFile_(props.pathToFile, props.newContent, {
              encoding: "utf-8",
            });

            return props;
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

    /*  then(
      map(
        tap((data: any) => {
          console.log("-----STAGE 2", data);
        })
      )
    ), */

    thenDoneFold(
      (data: ReplacerData) => {
        if (data.error !== undefined) {
          console.log(`----${data.identifier} - ERROR`, data.error);
        }

        console.log(`----${data.identifier} - INFO`, "NO NEED TO DO ANYTHING");
      },
      (data: ReplacerData) => {
        //console.log("-------------------------------------", data);
        console.log(`----${data.identifier} - SUCCESS`);
      }
    )
  );

export const replacer = replacer_(existsSync, writeFile, readFile);

export const withLoadConfig = withLoadConfig_(existsSync, replacer);
