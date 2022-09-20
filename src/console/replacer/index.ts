import {
  chain,
  compose,
  cond,
  Done,
  elif,
  fold,
  map,
  NI_Next,
  tap,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { existsSync as existsSync_ } from "fs";
import { readFile as readFile_, writeFile as writeFile_ } from "fs/promises";
import {
  checkIfNeedReplace,
  makeFinalReplaceable,
  makeReplacement,
  withLoadConfig_,
} from "./replacer.service";
import { ReplacerConfig, ReplacerOptions } from "./types";

type ReplaceOneProps = {
  content: string;
  options: ReplacerOptions;
};

type ReplaceOneData = ReplaceOneProps & {
  //content: string;
  newContent: string;
  fReplaceable: string;
  doesNeedReplace: boolean;
  error: any;
};

export const replaceOne = compose<
  ReplaceOneProps,
  Promise<{ content: string; info?: string }>
>(
  (data: ReplaceOneData) => ({
    ...data,
    fReplaceable: makeFinalReplaceable(
      data.options.type,
      data.options.replaceable,
      data.content,
      data.options.isFake === true
    ),
    options: {
      ...data.options,

      replacement: makeReplacement(
        data.options.replaceable,
        data.options.replacement as string,
        data.options.type,
        data.options.isFake === true
      ),
    },
  }),
  //),
  // check if need replace
  //tap((data: ReplaceOneData) => console.log("STAGE 1", data)),
  (data: ReplaceOneData) => ({
    ...data,
    doesNeedReplace: checkIfNeedReplace({
      content: data.content,
      replaceable: data.fReplaceable,
      replacement: data.options.replacement as string,
    }),
  }),
  //tap((data: ReplaceOneData) => console.log("STAGE 1", data)),
  // make replace
  (data: ReplaceOneData) => {
    if (data.doesNeedReplace === true) {
      //console.log(`----${data.options.identifier} - SUCCESS`);
      return {
        info: `----${data.options.identifier} - SUCCESS`,
        content: data.content.replace(
          data.fReplaceable,
          data.options.replacement as string
        ),
      };
    } else {
      //console.log(`----${data.options.identifier}`, data.doesNeedReplace);
      return {
        info: `----${data.options.identifier} | ${data.doesNeedReplace}`,
        content: data.content,
      };
    }
  }
);

export const replaceMany__ =
  (replaceOne_: typeof replaceOne) =>
  async (data: ReplacerConfig & { content: string }) => {
    const content = data.content;
    const infos: string[] = [];
    const newContent = await data.options.reduce(
      async (prevRes, currOpt, i, opts) => {
        const rContent: any = await prevRes;

        //console.log("-----------------REDUCE", opts.length);

        const fResult: any = await replaceOne_({
          content: rContent,
          options: currOpt,
        });

        if (fResult.info !== undefined) {
          infos.push(fResult.info);
        }

        return fResult.content;
      },
      Promise.resolve(content)
    );
    /* const newData = await data.options.reduce(
      async (prevRes, currOpt, i, opts) => {
        const res: any = await prevRes;

        console.log("-----------------REDUCE", opts.length, res);

        const fResult = await replaceOne_({
          content: res.content,
          options: currOpt,
        });

        if (fResult.info !== undefined) {
          infos.push(fResult.info);
        }

        return fResult;
      },
      Promise.resolve({ content })
    ); */

    return { newContent, infos };
  };

export const replaceMany = replaceMany__(replaceOne);

type WithFileLoadData = ReplacerConfig &
  Awaited<ReturnType<typeof replaceMany>> & {
    content: string;
    err?: any;
  };

export const withFileOperations_ = (
  replaceMany_: typeof replaceMany,
  existsSync: typeof existsSync_,
  readFile: typeof readFile_,
  writeFile: typeof writeFile_
) =>
  compose<ReplacerConfig[], Promise<void>>(
    (cnfs: ReplacerConfig[]) =>
      cnfs.map(
        compose<ReplacerConfig, Promise<void>>(
          (cnf: ReplacerConfig) =>
            existsSync(cnf.pathToFile) === false
              ? Done.of(`File does not exists | ${cnf.pathToFile}`)
              : NI_Next.of(cnf),
          chain(
            compose(
              async (cnf: ReplacerConfig) => ({
                ...cnf,
                content: await readFile(cnf.pathToFile, {
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
          then(
            chain(
              compose(
                async (data: WithFileLoadData) => ({
                  ...data,
                  ...(await replaceMany_(data)),
                }),
                then(NI_Next.of),
                _catch((err: any) => {
                  return Done.of({
                    err,
                  });
                })
              )
            )
          ),
          //then(tap((data: any) => console.log("====================", data))),
          then(
            chain(
              elif(
                (data: WithFileLoadData) => data.content !== data.newContent,
                compose(
                  async (data: WithFileLoadData) => {
                    await writeFile(data.pathToFile, data.newContent, {
                      encoding: "utf-8",
                    });
                    return data;
                  },
                  then(NI_Next.of),
                  _catch((err: any) => {
                    return Done.of({
                      err,
                    });
                  })
                ),
                NI_Next.of
              )
            )
          ),
          thenDoneFold(
            (data: WithFileLoadData) => {
              if (data.err !== undefined) {
                console.log(`----${data.pathToFile} - ERROR`, data.err);
              } else {
                console.log(`----${data.pathToFile} - INFO`, data.infos);
              }

              //return data.content;
            },
            (data: WithFileLoadData) => {
              //console.log("-------------------------------------", data);
              console.log(`----${data.pathToFile} - SUCCESS`, data.infos);

              //return data.newContent;
            }
          )
        )
      ),
    //tap((data: any) => console.log("---------------TAPPPPPPPPPP", data)),
    (promises: Promise<any>[]) => Promise.all(promises),
    then(() => {
      console.log("------REPLACER END WITH SUCCESS--------");
    }),
    _catch((err: any) => console.log("------REPLACER ERROR", err))
  );

/*  {
    for (let cnf of cnfs) {
      await compose<ReplacerConfig, Promise<void>>(
        (cnf: ReplacerConfig) =>
          existsSync(cnf.pathToFile) === false
            ? Done.of(`File does not exists | ${cnf.pathToFile}`)
            : NI_Next.of(cnf),
        chain(
          compose(
            async (cnf: ReplacerConfig) => ({
              ...cnf,
              content: await readFile(cnf.pathToFile, {
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
        then(
          chain(
            compose(
              async (data: WithFileLoadData) => ({
                ...data,
                ...(await replaceMany_(data)),
              }),
              then(NI_Next.of),
              _catch((err: any) => {
                return Done.of({
                  err,
                });
              })
            )
          )
        ),
        then(
          chain(
            elif(
              (data: WithFileLoadData) => data.content !== data.newContent,
              compose(
                async (data: WithFileLoadData) => {
                  await writeFile(data.newContent, cnf.pathToFile, {
                    encoding: "utf-8",
                  });
                  return data;
                },
                then(NI_Next.of),
                _catch((err: any) => {
                  return Done.of({
                    err,
                  });
                })
              ),
              NI_Next.of
            )
          )
        ),
        thenDoneFold(
          (data: WithFileLoadData) => {
            if (data.err !== undefined) {
              console.log(`----${data.pathToFile} - ERROR`, data.err);
            } else {
              console.log(`----${data.pathToFile} - INFO`, data.infos);
            }

            return data.content;
          },
          (data: WithFileLoadData) => {
            //console.log("-------------------------------------", data);
            console.log(`----${data.pathToFile} - SUCCESS`);

            return data.newContent;
          }
        )
      )(cnf);
    }
  }; */

/* export const withFileOperations_ =
  (
    replaceMany_: typeof replaceMany,
    existsSync: any,
    readFile: any,
    writeFile: any
  ) =>
  async (cnfs: ReplacerConfig[]) => {
    for (let cnf of cnfs) {
      await compose<ReplacerConfig, Promise<void>>(
        (cnf: ReplacerConfig) =>
          existsSync(cnf.pathToFile) === false
            ? Done.of(`File does not exists | ${cnf.pathToFile}`)
            : NI_Next.of(cnf),
        chain(
          compose(
            async (cnf: ReplacerConfig) => ({
              ...cnf,
              content: await readFile(cnf.pathToFile, {
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
        then(
          chain(
            compose(
              async (data: WithFileLoadData) => ({
                ...data,
                ...(await replaceMany_(data)),
              }),
              then(NI_Next.of),
              _catch((err: any) => {
                return Done.of({
                  err,
                });
              })
            )
          )
        ),
        then(
          chain(
            elif(
              (data: WithFileLoadData) => data.content !== data.newContent,
              compose(
                async (data: WithFileLoadData) => {
                  await writeFile(data.newContent, cnf.pathToFile, {
                    encoding: "utf-8",
                  });
                  return data;
                },
                then(NI_Next.of),
                _catch((err: any) => {
                  return Done.of({
                    err,
                  });
                })
              ),
              NI_Next.of
            )
          )
        ),
        thenDoneFold(
          (data: WithFileLoadData) => {
            if (data.err !== undefined) {
              console.log(`----${data.pathToFile} - ERROR`, data.err);
            } else {
              console.log(`----${data.pathToFile} - INFO`, data.infos);
            }

            return data.content;
          },
          (data: WithFileLoadData) => {
            //console.log("-------------------------------------", data);
            console.log(`----${data.pathToFile} - SUCCESS`);

            return data.newContent;
          }
        )
      )(cnf);
    }
  }; */

export const withFileOperations = withFileOperations_(
  replaceMany,
  existsSync_,
  readFile_,
  writeFile_
);

export const replacer = withLoadConfig_(existsSync_, withFileOperations);
