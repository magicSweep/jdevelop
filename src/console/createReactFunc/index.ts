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

export type CreateFuncProps = {
  name: string;
  cnfPath: string;
};

export type CreateFuncData = CreateFuncProps & {
  pathToDir: string;
  error: any;
};

export const createFunc_ = (
  existsSync: typeof existsSync_,
  mkdir: typeof mkdir_,
  createMainFile: (name: string, pathToDir: string) => Promise<void>,
  createStoriesFile: (name: string, pathToDir: string) => Promise<void>,
  createTestFile: (name: string, pathToDir: string) => Promise<void>
) =>
  compose<CreateFuncProps, Promise<void>>(
    (props: CreateFuncProps) => ({
      ...props,
      pathToDir: join(props.cnfPath, props.name),
    }),
    (data: CreateFuncData) =>
      existsSync(data.pathToDir) !== true
        ? NI_Next.of(data)
        : Done.of({
            ...data,
            error: `Directory -- ${data.pathToDir} -- already exists`,
          }),
    chain(
      compose(
        async (data: CreateFuncData) => {
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
          async (data: CreateFuncData) => {
            await Promise.all([
              createMainFile(data.name, data.pathToDir),
              createStoriesFile(data.name, data.pathToDir),
              createTestFile(data.name, data.pathToDir),
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
      (data: CreateFuncData) => {
        console.error("CAN NOT CREATE REACT FUNC", data.error);
      },
      (data: CreateFuncData) => {
        console.log(`[SUCCESS CREATED] ${data.pathToDir}`);
      }
    )
  );

/* export const createFunc = compose<FuncInfo, Promise<void>>(
  async (info: FuncInfo) => {
    await createDir(info);
    return info;
  },
  then(async ({ pathToDir, name }: FuncInfo) => {
    await Promise.all([
      createMainFile(name, pathToDir),
      createStoriesFile(name, pathToDir),
      createTestFile(name, pathToDir),
    ]);

    return { pathToDir, name };
  }),
  then(({ pathToDir, name }: FuncInfo) =>
    console.log(`[SUCCESS CREATED] ${pathToDir}/${name}`)
  ),
  _catch((err: any) => console.error(err))
);

export const createDir = async (info: FuncInfo): Promise<void> => {
  const fullPathToDir = join(info.pathToDir, info.name);
  if (existsSync(fullPathToDir) === false) {
    await promisify(mkdir)(fullPathToDir);
  }

  return;
}; */

export const createMainFile_ =
  (writeFile: typeof writeFile_) =>
  (name: string, pathToDir: string): Promise<void> => {
    const content = `import React, {FC} from 'react';

export type ${name}Props = {}

const ${name}: FC<${name}Props> = ({}) => {

  return (<></>);
};

export default ${name};
        `;

    const fileName = pathToDir + "/" + "index.tsx";

    //console.log(fileName);
    //console.log(content);

    /* , (error: any) => {
      if (error) throw error; // если возникла ошибка
      console.log("Асинхронная запись main файла завершена. Содержимое файла:");
    } */
    return writeFile(fileName, content);
  };

export const createStoriesFile_ =
  (writeFile: typeof writeFile_) =>
  (name: string, pathToDir: string): Promise<void> => {
    const content = `import ${name}, {${name}Props} from "./${name}";
        
export default {
    component: ${name},
    title: "Component/${name}",
};

const Template = (args: ${name}Props) => (<${name} {...args} />)

export const Default = Template.bind({});

Default.args = {}
        `;

    const fileName = pathToDir + "/" + name + ".stories.tsx";

    //console.log(fileName);
    //console.log(content);

    /* , (error: any) => {
      if (error) throw error; // если возникла ошибка
      console.log(
        "Асинхронная запись stories файла завершена. Содержимое файла:"
      );
    } */
    return writeFile(fileName, content);
  };

export const createTestFile_ =
  (writeFile: typeof writeFile_) =>
  (name: string, pathToDir: string): Promise<void> => {
    const content = `
import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  } from '@testing-library/react';
import { configure } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import ${name} from ".";

describe("${name}", () => {

  let _render = null;
  
  describe("Snapshots", () => {
  
      beforeEach(() => {
      
          _render = render(<${name} />);
      
      });

      afterEach(cleanup)
  
      test("matches snapshot", () => {
        const { baseElement } = _render;
        expect(baseElement).toMatchSnapshot();
      });
  
  });

});
      `;

    const fileName = pathToDir + "/" + name + ".test.tsx";

    //console.log(fileName);
    //console.log(content);

    /* , (error: any) => {
    if (error) throw error; // если возникла ошибка
    console.log("Асинхронная запись тестогого файла завершена.");
  } */
    return writeFile(fileName, content);
  };

const createMainFile = createMainFile_(writeFile_);
const createStoriesFile = createStoriesFile_(writeFile_);
const createTestFile = createTestFile_(writeFile_);

const createFunc = createFunc_(
  existsSync_,
  mkdir_,
  createMainFile,
  createStoriesFile,
  createTestFile
);

export default createFunc;
