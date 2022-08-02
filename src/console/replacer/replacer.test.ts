import { replacer_ } from ".";
import { ReplacerConfig } from "./types";

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

const writeFile = jest.fn();
const existsSync = jest.fn();
const readFile = jest.fn();

console.log = jest.fn();

describe("replacer_", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //const getFileContent = getFileContent_(existsSync, readFile);
  //const writeFileContent = writeFileContent_(writeFile);

  const replacer = replacer_(existsSync, writeFile, readFile);

  const config: ReplacerConfig = {
    pathToFile: "/path/file.js",
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
    readFile.mockResolvedValueOnce(fileContent);
    writeFile.mockResolvedValueOnce(true);
    existsSync.mockReturnValueOnce(true);

    await replacer({
      ...config,
      replaceable: "Добавить новое фото",
      replacement: "Добавить новое лото",
    });

    expect(writeFile).toHaveBeenCalledTimes(1);
    //expect(writeFile).toHaveBeenNthCalledWith(1, 'he');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "----SUPER REPLACER - SUCCESS"
    );
  });

  test("On type FULL_LINE we first search full line that contains replaceable and then replace it with replacement", async () => {
    readFile.mockResolvedValueOnce(fileContent);
    writeFile.mockResolvedValueOnce(true);
    existsSync.mockReturnValueOnce(true);

    await replacer({
      ...config,
      type: "FULL_LINE",
      replaceable: "numberOfPhotosPerQuery",
      replacement: "export const numberOfPhotosPerQuery = calc(23, 45);",
    });

    expect(writeFile).toHaveBeenCalledTimes(1);
    //expect(writeFile).toHaveBeenNthCalledWith(1, "he");

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "----SUPER REPLACER - SUCCESS"
    );
  });

  test("On type FAKE_API - we first create replecement by isFake flag and then replace it with replacement", async () => {
    readFile.mockResolvedValueOnce(fileContent);
    writeFile.mockResolvedValueOnce(true);
    existsSync.mockReturnValueOnce(true);

    await replacer({
      ...config,
      type: "FAKE_API",
      isFake: false,
      replaceable: "api/worker",
    });

    expect(writeFile).toHaveBeenCalledTimes(1);
    //expect(writeFile).toHaveBeenNthCalledWith(1, "he");

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "----SUPER REPLACER - SUCCESS"
    );
  });
});
