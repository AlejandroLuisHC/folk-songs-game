import SpotifyWebApi from "spotify-web-api-node";

const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${
            import.meta.env.VITE_SPOTIFY_CLIENT_ID
        }&client_secret=${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`,
    });

    const data = await response.json();
    return data.access_token;
};

export const createSpotifyApi = async () => {
    const accessToken = await getAccessToken();

    return new SpotifyWebApi({
        clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
        accessToken,
    });
};
