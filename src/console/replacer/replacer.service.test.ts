import {
  makeFinalReplaceable,
  getFullLine,
  prepareCnfPaths,
  makeConfigs,
  checkIfNeedReplace,
} from "./replacer.service";

const fileContent = `
import { FirestoreFieldsToEdit, EditPhotoWorkerProps } from "./../types";
import { add } from "../api/worker/index.fake";
import {  edit } from "../api/stoker";
import { WorkerRequest } from "lizzygram-common-data/dist/types";

export const addPhotoFormTitle = "Добавить новое фото";

//export const lizzyYearsOld = getLizzyYearsOld();

export const lizzyBirthday = new Date("2018-07-08");

// WALL OF PHOTOS | USE OBSERVABLE PHOTOS

// NUMBER OF PHOTOS PER QUERY
export const numberOfPhotosPerQuery = calcPhotosLimitPerQuery(
  photoCardWidth,
  photoCardHeight
);

//export const rootDivId = "wall_of_photos";
//export const idPrefix = "#OBSERVER_";

plugins: [
  "gatsby-plugin-postcss",
  "gatsby-plugin-react-helmet",
  "gatsby-plugin-webpack-bundle-analyser-v2",
],
`;

/* describe.only("Some test", () => {
  const toUpper = async (str: string) => str.toUpperCase();

  test("", async () => {
    const res = await [{ opt: "opt1" }, { opt: "opt2" }].reduce(
      async (prev, curr, i, arr) => {
        const res = await prev;

        return toUpper(res + curr.opt);
      },
      Promise.resolve("")
    );

    expect(res).toEqual("h");
  });
}); */

describe("makeConfigs", () => {
  const cnfs = ["./example/config/real-imports", "./example/config/other"];

  test.skip("", () => {
    const res = makeConfigs(cnfs);

    expect(res).toEqual("h");
  });
});

describe.only("prepareCnfPaths", () => {
  test("", () => {
    const cnfPaths = ["fake-imports/index.js", "other/index.js"];
    const pathToDir = "src/config/replacer";
    const res = prepareCnfPaths(cnfPaths, pathToDir);

    expect(res).toEqual([
      "src/config/replacer/fake-imports/index.js",
      "src/config/replacer/other/index.js",
    ]);
  });

  test("", () => {
    const cnfPaths = "fake-imports/index.js";
    const pathToDir = "src/config/replacer";
    let res = prepareCnfPaths(cnfPaths, pathToDir);

    expect(res).toEqual(["src/config/replacer/fake-imports/index.js"]);

    res = prepareCnfPaths(cnfPaths);

    expect(res).toEqual(["fake-imports/index.js"]);
  });
});

describe("getFullLine", () => {
  test.each([
    //numberOfPhotosPerQuery
    {
      count: 0,
      replaceable: "numberOfPhotosPerQuery",
      fileContent,
      expected: `export const numberOfPhotosPerQuery = calcPhotosLimitPerQuery(
  photoCardWidth,
  photoCardHeight
);`,
    },
  ])("$count", ({ replaceable, fileContent, expected }: any) => {
    const res = getFullLine(replaceable, fileContent);

    expect(res.trim()).toEqual(expected);
  });
});

// checkIfNeedReplace
describe("checkIfNeedReplace", () => {
  test.each([
    {
      count: 0,
      replaceable: "../api/worker/index.fake",
      replacement: "../api/worker",
      expected: true,
    },
    {
      count: 1,
      replaceable: "../api/worker",
      replacement: "../api/worker/index.fake",
      expected: "No need to do anything...",
    },
    {
      count: 2,
      replaceable: "../api/stoker",
      replacement: "../api/stoker/index.fake.ts",
      expected: true,
    },
    {
      count: 3,
      replaceable: "../api/stoker/index.fake.ts",
      replacement: "../api/stoker",
      expected: "No need to do anything...",
    },
    {
      count: 4,
      replaceable: "../sto/index.fake.ts",
      replacement: "../sto",
      expected:
        'We got no replacable content | "../sto/index.fake.ts" | in file.',
    },
    //../api/worker/index.fake"
    {
      count: 5,
      replaceable: "../api/worker/index.fake",
      replacement: "../api/worker/index.fake",
      expected: "No need to do anything...",
    },
  ])("$count", ({ replaceable, replacement, expected }: any) => {
    const res = checkIfNeedReplace({
      content: fileContent,
      replaceable,
      replacement,
    });

    expect(res).toEqual(expected);
  });
});

describe("makeFinalReplaceable", () => {
  test.each([
    {
      count: 0,
      type: "SIMPLE",
      replaceable: "replaceable",
      fileContent,
      expected: "replaceable",
    },
    {
      count: 1,
      type: "FULL_LINE",
      replaceable: "addPhotoFormTitle",
      fileContent,
      expected: 'export const addPhotoFormTitle = "Добавить новое фото";',
    },
    {
      count: 2,
      type: "SIMPLE",
      replaceable: '"gatsby-plugin-webpack-bundle-analyser-v2"',
      fileContent,
      expected: '"gatsby-plugin-webpack-bundle-analyser-v2"',
    },
    {
      count: 3,
      type: "FAKE_API",
      replaceable: "../api/worker",
      fileContent,
      isFake: false,
      expected: "../api/worker/index.fake",
    },
    {
      count: 4,
      type: "FAKE_API",
      replaceable: "../api/worker",
      fileContent,
      isFake: true,
      expected: "../api/worker",
    },
  ])("$count", ({ type, replaceable, fileContent, isFake, expected }: any) => {
    const res = makeFinalReplaceable(type, replaceable, fileContent, isFake);

    expect(res.trim()).toEqual(expected);
  });
});
