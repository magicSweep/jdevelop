import { bye } from "../api/stoker";

// NUMBER OF PHOTOS PER QUERY
export const numberOfPhotosPerQuery = calcPhotosLimitPerQuery(
                photoCardWidth,
                photoCardHeight
              );
export const gatsbyOptions = {
  plugins: [
    /*"gatsby-plugin-webpack-bundle-analyser-v2",*/
    "gatsby-plugin-boom",
  ],
};
