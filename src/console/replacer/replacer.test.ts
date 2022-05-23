import { writeFile } from "fs/promises";
import { ReplacerConfig, replacer_, withLoadConfig_ } from ".";

const configContent = `
import { FirestoreFieldsToEdit, EditPhotoWorkerProps } from "./../types";
import { add, edit } from "../api/worker";
import { WorkerRequest } from "lizzygram-common-data/dist/types";

export const addPhotoFormTitle = "Добавить новое фото";
export const editPhotoFormTitle = "Изменить фото";
export const searchPhotoFormTitle = "Поиск фото";

/* OTHER */

//export const lizzyYearsOld = getLizzyYearsOld();

export const lizzyBirthday = new Date("2018-07-08");

// NUMBER OF PHOTOS PER QUERY

export const numberOfPhotosPerQuery = 5;

// WALL OF PHOTOS | USE OBSERVABLE PHOTOS

//export const rootDivId = "wall_of_photos";
//export const idPrefix = "#OBSERVER_";

plugins: [
  "gatsby-plugin-postcss",
  "gatsby-plugin-react-helmet",
  {
    resolve: "gatsby-plugin-manifest",
    options: {
      name: "Photo album, portfolio",
      short_name: "Photo album",
      start_url: "/",
      lang: "ru",
      background_color: "#f7f0eb",
      theme_color: "#a2466c",
      display: "standalone",
      icon: "src/icons/favicon_color_512x512.png",
      theme_color_in_head: false,
    },
  },
  "gatsby-plugin-webpack-bundle-analyser-v2",
],
`;

describe("replacer_", () => {
  const existsSync = jest.fn(() => true);
  const readFile = jest.fn(() => Promise.resolve(configContent));
  const writeFile = jest.fn(() => Promise.resolve());

  afterEach(() => {
    jest.clearAllMocks();
  });

  const config = {
    pathToFile: "/src/path-to-file.ts",
    // identify in log messages
    identifier: "TEST REPLACER",
    replaceable: "api/worker",
    replacement: "api/worker.fake",
  };

  const replacer = replacer_(existsSync, readFile as any, writeFile as any);

  test("", async () => {
    await replacer({ ...config });

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
    //expect(writeFile).toHaveBeenNthCalledWith(1, "hello");
  });

  test("", async () => {
    await replacer({
      ...config,
      replaceable: '"gatsby-plugin-webpack-bundle-analyser-v2"',
      replacement: '//"gatsby-plugin-webpack-bundle-analyser-v2"',
    });

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
    //expect(writeFile).toHaveBeenNthCalledWith(1, "hello");
  });
});
