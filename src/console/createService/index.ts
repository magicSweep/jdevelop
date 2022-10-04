import {
  chain,
  compose,
  Done,
  NI_Next,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { existsSync as existsSync_ } from "fs";
import { mkdir as mkdir_, writeFile as writeFile_ } from "fs/promises";
import { join } from "path";

export type CreateServiceProps = {
  name: string;
  cnfPath: string;
};

export type CreateServiceData = CreateServiceProps & {
  pathToDir: string;
  error: any;
};

export const createService_ = (
  existsSync: typeof existsSync_,
  mkdir: typeof mkdir_,
  createMainFile: typeof createMainFile_,
  createMainFakeFile: typeof createMainFakeFile_,
  createMocks: typeof createMocks_
) =>
  compose<CreateServiceProps, Promise<void>>(
    (props: CreateServiceProps) => ({
      ...props,
      pathToDir: join(props.cnfPath, props.name),
    }),
    (data: CreateServiceData) =>
      existsSync(data.pathToDir) !== true
        ? NI_Next.of(data)
        : Done.of({
            ...data,
            error: `Directory -- ${data.pathToDir} -- already exists`,
          }),
    chain(
      compose(
        async (data: CreateServiceData) => {
          await mkdir(data.pathToDir);
          return data;
        },
        then(NI_Next.of),
        _catch((err: any) => {
          return Done.of({
            error: err,
          });
        })
      )
    ),
    then(
      chain(
        compose(
          async (data: CreateServiceData) => {
            await Promise.all([
              createMainFile(data.pathToDir),
              createMainFakeFile(data.pathToDir),
              createMocks(data.pathToDir),
            ]);

            return data;
          },
          then(NI_Next.of),
          _catch((err: any) => {
            return Done.of({
              err,
            });
          })
        )
      )
    ),
    thenDoneFold(
      (data: CreateServiceData) => {
        console.error("CAN NOT CREATE SERVICE", data.error);
      },
      (data: CreateServiceData) => {
        console.log(`[SUCCESS CREATED] ${data.pathToDir}`);
      }
    )
  );

export const createMainFile__ =
  (writeFile: typeof writeFile_) =>
  (pathToDir: string): Promise<void> => {
    const content = `  
export const someMethod: any = () => {};
`;

    const fileName = join(pathToDir, "index.ts");

    return writeFile(fileName, content);
  };

export const createMainFakeFile__ =
  (writeFile: typeof writeFile_) =>
  (pathToDir: string): Promise<void> => {
    const content = `  
export const someMethod: any = () => {};
`;

    const fileName = join(pathToDir, "index.fake.ts");

    return writeFile(fileName, content);
  };

export const createMocks__ = (
  mkdir: typeof mkdir_,
  createMainMockFile: typeof createMainMockFile_,
  createMainFakeMockFile: typeof createMainFakeMockFile_
) =>
  compose<string, Promise<void>>(
    (pathToDir: string) => ({
      pathToDir,
      pathToMocksDir: join(pathToDir, "__mocks__"),
    }),
    async (data: any) => {
      await mkdir(data.pathToMocksDir);
      return data;
    },
    then((data: any) =>
      Promise.all([
        createMainMockFile(data.pathToMocksDir),
        createMainFakeMockFile(data.pathToMocksDir),
      ])
    )
  );

export const createMainMockFile__ =
  (writeFile: typeof writeFile_) =>
  (pathToDir: string): Promise<void> => {
    const content = `  
export const someMethod = jest.fn();
`;

    const fileName = join(pathToDir, "index.ts");

    return writeFile(fileName, content);
  };

export const createMainFakeMockFile__ =
  (writeFile: typeof writeFile_) =>
  (pathToDir: string): Promise<void> => {
    const content = `  
  export * from ".";
`;

    const fileName = join(pathToDir, "index.fake.ts");

    return writeFile(fileName, content);
  };

export const createMainMockFile_ = createMainMockFile__(writeFile_);
export const createMainFakeMockFile_ = createMainFakeMockFile__(writeFile_);

export const createMocks_ = createMocks__(
  mkdir_,
  createMainMockFile_,
  createMainFakeMockFile_
);

export const createMainFile_ = createMainFile__(writeFile_);
export const createMainFakeFile_ = createMainFakeFile__(writeFile_);

export const createService = createService_(
  existsSync_,
  mkdir_,
  createMainFile_,
  createMainFakeFile_,
  createMocks_
);
