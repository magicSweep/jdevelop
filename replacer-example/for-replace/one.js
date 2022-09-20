import { FirestoreFieldsToEdit, EditPhotoWorkerProps } from "./../types";
import { add } from "../api/Broker";
import { edit } from "../api/Joker";
import { hello } from "../api/worker";
import { WorkerRequest } from "lizzygram-common-data/dist/types";

export const addPhotoFormTitle = "Добавить новое фото";

//export const lizzyYearsOld = getLizzyYearsOld();

export const lizzyBirthday = new Date("2018-07-08");

// WALL OF PHOTOS | USE OBSERVABLE PHOTOS

// NUMBER OF PHOTOS PER QUERY
export const numberOfPhotosPerQuery = 9;

//export const rootDivId = "wall_of_photos";
//export const idPrefix = "#OBSERVER_";

export const config = {
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-webpack-bundle-analyser-v2",
  ],
};
