import { replaceOne, replaceMany__, withFileOperations_ } from ".";
import wait from "waait";
import { ReplacerConfig, ReplacerOptions } from "./types";

const fileContent = `
import { FirestoreFieldsToEdit, EditPhotoWorkerProps } from "./../types";
import { add, edit } from "../api/worker/index.fake";
import { WorkerRequest } from "lizzygram-common-data/dist/types";

export const addPhotoFormTitle = "Добавить новое фото";

//export const lizzyYearsOld = getLizzyYearsOld();

export const lizzyBirthday = new Date("2018-07-08");

// WALL OF PHOTOS | USE OBSERVABLE PHOTOS

// NUMBER OF PHOTOS PER QUERY
export const numberOfPhotosPerQuery = 9;

//export const rootDivId = "wall_of_photos";
//export const idPrefix = "#OBSERVER_";

plugins: [
  "gatsby-plugin-postcss",
  "gatsby-plugin-react-helmet",
  "gatsby-plugin-webpack-bundle-analyser-v2",
],
`;

//console.log = jest.fn();

/* test.only("", async () => {
  const double = async (s: any) => {
    await wait(s === 1 ? 2000 : 500);
    return `${s} * 2`;
  };

  const func = async () => {
    let res = "";

    for (let i of [1, 2, 3]) {
      let r = await double(i);
      res += r;
    }

    return res;
  };

  const res = await func();

  expect(res).toEqual("h");
}); */

describe("replaceOne", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //const getFileContent = getFileContent_(existsSync, readFile);
  //const writeFileContent = writeFileContent_(writeFile);

  //const replacer = replacer_(existsSync, writeFile, readFile);

  const config: ReplacerOptions = {
    //pathToFile: "/path/file.js",
    // identify in log messages
    identifier: "SUPER REPLACER",
    //doesReplaceFullLine?: boolean;
    type: "SIMPLE",

    isFake: false,

    replaceable: "",
    //
    //replacement: "",
  };

  test("On type SIMPLE we just replace replaceable with replacement", async () => {
    const res = await replaceOne({
      options: {
        ...config,
        replaceable: "Добавить новое фото",
        replacement: "Добавить новое лото",
      },
      content: fileContent,
    });

    //expect(res.content).toEqual("h");

    expect(res.info).toEqual("----SUPER REPLACER - SUCCESS");
  });

  test("On type FULL_LINE we first search full line that contains replaceable and then replace it with replacement", async () => {
    const res = await replaceOne({
      options: {
        ...config,
        type: "FULL_LINE",
        replaceable: "numberOfPhotosPerQuery",
        replacement: "export const numberOfPhotosPerQuery = calc(23, 45);",
      },

      content: fileContent,
    });

    //expect(res).toEqual("h");

    expect(res.info).toEqual("----SUPER REPLACER - SUCCESS");
  });

  test("On type FAKE_API - we first create replecement by isFake flag and then replace it with replacement", async () => {
    const res = await replaceOne({
      options: {
        ...config,
        type: "FAKE_API",
        isFake: false,
        replaceable: "/worker",
      },
      content: fileContent,
    });

    //expect(res).toEqual("h");

    expect(res.info).toEqual("----SUPER REPLACER - SUCCESS");
  });
});

describe("replaceMany_", () => {
  const replaceOne = jest.fn(() => {
    const n = Math.round(Math.random() * 1000);

    return Promise.resolve({
      content: `Some content #${n}`,
      info: `Some info #${n}`,
    });
  });

  const config = {
    pathToFile: "src/console/replacer/example/for-replace/one.js",
    // identify in log messages
    options: [
      {
        identifier: "REPLACER | AUTH MIDDLEWARE",
        replaceable: '"../api/Broker"',
      },
      {
        identifier: "REPLACER | CHECK ROLE MIDDLEWARE",
        replaceable: '"../api/Joker"',
      },
      {
        identifier: "REPLACER | 1 CLEAN UP CONTROLLER",
        replaceable: '"../api/worker"',
      },
    ],
  };

  const replaceMany = replaceMany__(replaceOne);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("It get content and send throw all options, collect info messages", async () => {
    const res = await replaceMany({
      ...config,
      content: "Super content",
    } as any);

    expect(replaceOne).toHaveBeenCalledTimes(3);

    expect(res).toEqual("h");
  });
});

describe.only("withFileOperations_", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const cnfs = [
    {
      pathToFile: "src/console/replacer/example/one.js",
      // identify in log messages
      options: "options",
    },
    {
      pathToFile: "src/console/replacer/example/for-replace/two.js",
      // identify in log messages
      options: "options",
    },
    {
      pathToFile: "src/console/replacer/example/for-replace/three.js",
      // identify in log messages
      options: "options",
    },
  ];

  const replaceMany = jest.fn().mockResolvedValue({
    newContent: "New super content",
    infos: ["one info", "two info", "three info"],
  });
  const existsSync = jest.fn().mockReturnValue(true);
  const readFile = jest.fn().mockResolvedValue("Super content opp...");
  const writeFile = jest.fn().mockResolvedValue(null);

  test("", async () => {
    const withFileOperations = withFileOperations_(
      replaceMany,
      existsSync,
      readFile,
      writeFile
    );

    await withFileOperations(cnfs as any);

    expect(existsSync).toHaveBeenCalledTimes(3);
    expect(readFile).toHaveBeenCalledTimes(3);
    expect(writeFile).toHaveBeenCalledTimes(3);

    expect(replaceMany).toHaveBeenCalledTimes(3);
  });
});
