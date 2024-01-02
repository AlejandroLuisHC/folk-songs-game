import SpotifyWebApi from 'spotify-web-api-node';

export const spotifyApi = new SpotifyWebApi();

const accessToken = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&client_id=52f7fd0717ba4545bd1491fe26f0fc80&client_secret=db0d5f2131864ccaa34ce73f26ce64b8",
})
    .then(res => res.json())
    .then(res => res.access_token);

spotifyApi.setAccessToken(accessToken);


