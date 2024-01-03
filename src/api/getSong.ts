import {createSpotifyApi} from "./apiConfig";

export const songsGenreFolkMetal = async () => {
    const spotifyApi = await createSpotifyApi()
    return spotifyApi.searchTracks("genre:folk-metal", { limit: 50 });
}
export const songsPlaylistDailyMix1 = async () => {
    const spotifyApi = await createSpotifyApi()
    return spotifyApi.getPlaylistTracks(import.meta.env.VITE_DAILY_MIX_1, {limit: 50});
}
