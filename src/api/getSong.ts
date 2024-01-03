import {spotifyApi} from "./apiConfig";

export const songsGenreFolkMetal = async () => await spotifyApi.searchTracks("genre:folk-metal", {limit: 50});
export const songsPlaylistDailyMix1 = async () =>
    await spotifyApi.getPlaylistTracks(import.meta.env.VITE_DAILY_MIX_1, {limit: 50});
