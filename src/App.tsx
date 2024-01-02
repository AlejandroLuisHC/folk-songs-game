import {useEffect, useState} from "react";
import {songsFolkMetal} from "./api/getSong";
import "./style/app.css";

function App() {
    const [songData, setSongData] = useState({name: "", band: "", previewUrl: ""});
    const [solution, setSolution] = useState({name: "", band: ""});
    const [solved, setSolved] = useState([false, false]);
    const [audio, setAudio] = useState(new Audio());
    const [level, setLevel] = useState({
        time: [1000, 2000, 5000, 10000, 25000],
        level: 1,
        seconds: 1000,
    });

    useEffect(() => {
        async function getSong() {
            try {
                const songData = await songsFolkMetal();
                if (!songData) throw new Error("No song data");

                const rand = Math.floor(Math.random() * songData.body.tracks!.items.length);
                const randomSong = songData.body.tracks?.items[rand];
                if (!randomSong) throw new Error("No random song");
                setSongData({
                    name: randomSong.name.toLowerCase(),
                    band: randomSong.artists[0].name.toLowerCase(),
                    previewUrl: randomSong.preview_url!,
                });
            } catch (error) {
                console.error("Error fetching or setting song data:", error);
            }
        }
        getSong();
    }, []);

    function playPreview() {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }

        const newAudio = new Audio(songData.previewUrl);
        setAudio(newAudio);
        newAudio.play();

        setTimeout(() => {
            newAudio.pause();
            newAudio.currentTime = 0;
        }, level.seconds);
    }

    function solve(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let songName = document.querySelector<HTMLInputElement>("[name=song-name]")?.value;
        if (songData.name === solution.name) songName = songData.name;
        let bandName = document.querySelector<HTMLInputElement>("[name=band-name]")?.value;
        if (songData.band === solution.band) bandName = songData.band;

        const newSolution = {
            name: songName!.toLowerCase(),
            band: bandName!.toLowerCase(),
        };

        setSolution(newSolution);

        // Check if the new solution is correct
        setSolved([newSolution.name === songData.name, newSolution.band === songData.band]);

        // Update level based on the solved state
        if (!solved[0] || !solved[1]) {
            setLevel(prevLevel => ({
                ...prevLevel,
                level: prevLevel.level + 1,
                seconds: prevLevel.time[prevLevel.level],
            }));
        }
    }

    console.log("Song name and band:", songData.name + " & " + songData.band);

    return (
        <>
            <div className="play-box">
                <button className="play-button" onClick={playPreview}>
                    PLAY THE SONG
                </button>
            </div>
            <div className="level-box">
                {[1, 2, 3, 4, 5].map(levelNumber => (
                    <p
                        key={levelNumber}
                        className={
                            level.level > levelNumber
                                ? solved[0] && solved[1]
                                    ? "level-bubble-green"
                                    : solved[0] || solved[1]
                                      ? "level-bubble-yellow"
                                      : "level-bubble-red"
                                : "level-bubble"
                        }
                    >
                        {levelNumber}
                    </p>
                ))}
            </div>
            <form onSubmit={event => solve(event)} className="guess-box">
                <p>Level: {level.level}</p>
                {songData.name === solution.name ? (
                    <p className="correct">Correct! The name of the song is {songData.name}</p>
                ) : (
                    <>
                        <label htmlFor="song-name">Song name:</label>
                        <input name="song-name" className="input-guess" placeholder="Type your guess here" />
                    </>
                )}
                {songData.band === solution.band ? (
                    <p className="correct">Correct! The name of the band is {songData.band}</p>
                ) : (
                    <>
                        <label htmlFor="band-name">Band name:</label>
                        <input name="band-name" className="input-guess" placeholder="Type your guess here" />
                    </>
                )}
                {level.level > 5 || (solved[0] && solved[1]) ? (
                    <button onClick={() => window.location.reload()}>Next game</button>
                ) : (
                    <button type="submit">Submit Guess</button>
                )}
            </form>
        </>
    );
}

export default App;
