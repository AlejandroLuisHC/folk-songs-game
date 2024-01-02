import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi();

const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=52f7fd0717ba4545bd1491fe26f0fc80&client_secret=db0d5f2131864ccaa34ce73f26ce64b8",
    });

    const data = await response.json();
    return data.access_token;
};

(async () => {
    const accessToken = await getAccessToken();
    spotifyApi.setAccessToken(accessToken);
})();
