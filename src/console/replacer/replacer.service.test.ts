import { makeFinalReplaceable, getFullLine } from "./replacer.service";

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

describe("getFullLine", () => {
  test.each([
    {
      count: 0,
      replaceable: '"gatsby-plugin-react-helmet"',
      fileContent,
      expected: '"gatsby-plugin-react-helmet",',
    },
  ])("$count", ({ replaceable, fileContent, expected }: any) => {
    const res = getFullLine(replaceable, fileContent);

    expect(res.trim()).toEqual(expected);
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
