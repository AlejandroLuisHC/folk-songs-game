import {createSpotifyApi} from "./apiConfig";

export const songsGenreFolkMetal = async () => {
    const spotifyApi = await createSpotifyApi();
    return spotifyApi.searchTracks("genre:folk-metal", {limit: 50});
};
export const songsPlaylistDailyMix1 = async () => {
    const spotifyApi = await createSpotifyApi();
    return spotifyApi.getPlaylistTracks(import.meta.env.VITE_DAILY_MIX_1, {limit: 50});
};

export const songsPlaylistGrimner = async () => {
    const spotifyApi = await createSpotifyApi();
    return spotifyApi.getPlaylistTracks(import.meta.env.VITE_PLAYLIST_GRIMNER, {limit: 50});
};

export const songsPlaylistSpanish = async () => {
    const spotifyApi = await createSpotifyApi();
    return spotifyApi.getPlaylistTracks(import.meta.env.VITE_PLAYLIST_SPANISH_CLASSICS, {limit: 50});
};

export const songsPlaylistFolkMetal = async () => {
    const spotifyApi = await createSpotifyApi();
    const playlistId = import.meta.env.VITE_PLAYLIST_FOLK_METAL;
    const limit = 100; 
    let offset = 0; 
    
    const response = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
    const allItems = [...response.body.items]

    while (offset < response.body.total) {
        offset += limit;
        const response = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
        allItems.push(...response.body.items)
    }

    return allItems;
};


