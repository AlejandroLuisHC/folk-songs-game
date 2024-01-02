import {spotifyApi} from "./apiConfig";


export const songsFolkMetal = async () => await spotifyApi.searchTracks("genre:folk-metal", {limit: 50});
