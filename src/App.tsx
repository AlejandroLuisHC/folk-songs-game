import {useEffect, useRef, useState} from "react";
import {songsPlaylistDailyMix1} from "./api/getSong";
import "./style/app.css";
import { useQuery } from "@tanstack/react-query";
import DotLoader from "react-spinners/DotLoader";

function App() {
    const [songData, setSongData] = useState({
        name: "",
        band: "",
        previewUrl: "",
    });
    const [solution, setSolution] = useState({name: "", band: ""});
    const [levelsState, setLevelsState] = useState([
        "level-bubble",
        "level-bubble",
        "level-bubble",
        "level-bubble",
        "level-bubble",
    ]);
    const [solved, setSolved] = useState([false, false]);
    const [audio, setAudio] = useState(new Audio());
    const [level, setLevel] = useState({
        time: [1000, 2000, 5000, 10000, 25000],
        level: 1,
    });
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    const {data, status} = useQuery({
        queryKey: ["songsPlaylistDailyMix1"],
        queryFn: async () => await songsPlaylistDailyMix1(),
    });

    console.log("data", data);

    useEffect(() => {
        if (data) {
            const rand = Math.floor(Math.random() * 50);
            const randomSong = data.body.items[rand].track;
            setSongData({
                name: randomSong!.name.toLowerCase(),
                band: randomSong!.artists[0].name.toLowerCase(),
                previewUrl: randomSong!.preview_url!,
            });
        }
    }, [data]);

    useEffect(() => {
        if (isMounted.current) {
            setLevelsState(prev => {
                const newState = [...prev];
                newState[level.level - 2] =
                    solved[0] && solved[1]
                        ? "level-bubble-green"
                        : solved[0] || solved[1]
                          ? "level-bubble-yellow"
                          : "level-bubble-red";
                return newState;
            });
        }
    }, [level, solved]);

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
        }, level.time[level.level - 1]);
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
            }));
        }
    }

    console.log("Song name and band:", songData.name + " & " + songData.band);

    if (status === "pending")
        return <DotLoader
            color="#1a1a1a"
            loading={true}
            height={80}
            width={8}
            radius={30}
            margin={8}
        />;

    return (
        <>
            <div className="play-box">
                <button className="play-button" onClick={playPreview}>
                    PLAY THE SONG
                </button>
            </div>
            <div className="level-box">
                <p className={levelsState[0]}>1</p>
                <p className={levelsState[1]}>2</p>
                <p className={levelsState[2]}>3</p>
                <p className={levelsState[3]}>4</p>
                <p className={levelsState[4]}>5</p>
            </div>
            <form onSubmit={event => solve(event)} className="guess-box">
                {songData.name === solution.name && solution.name !== "" ? (
                    <p className="correct">Correct! The name of the song is {songData.name}</p>
                ) : level.level > 5 ? (
                    <p className="incorrect">The name of the song is {songData.name}. Try again!</p>
                ) : (
                    <>
                        <label htmlFor="song-name">Song name:</label>
                        <input name="song-name" className="input-guess" placeholder="Type your guess here" />
                    </>
                )}
                {songData.band === solution.band && solution.band !== "" ? (
                    <p className="correct">Correct! The name of the band is {songData.band}</p>
                ) : level.level > 5 ? (
                    <p className="incorrect">The name of the band is {songData.band}. Try again!</p>
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
