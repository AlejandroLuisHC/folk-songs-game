import {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import DotLoader from "react-spinners/DotLoader";
import {songsPlaylistGrimner} from "./api/getSong";
import {generatePlaceholder} from "./helpers/generatePlaceholder";
import "./style/app.css";

function App() {
    const [songData, setSongData] = useState({
        name: "",
        band: "",
        previewUrl: "",
    });
    const [solution, setSolution] = useState({name: "", band: ""});
    const [levelsState, setLevelsState] = useState(Array(5).fill("level-bubble"));
    const [inputValues, setInputValues] = useState({
        songName: "",
        bandName: "",
    });
    const [solved, setSolved] = useState([false, false]);
    const [audio, setAudio] = useState(new Audio());
    const [level, setLevel] = useState({
        time: [1000, 2500, 6000, 12000, 30000],
        level: 1,
    });
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    const {data, status} = useQuery({
        queryKey: ["songs"],
        queryFn: async () => await songsPlaylistGrimner(),
    });

    useEffect(() => {
        if (data) {
            const rand = Math.floor(Math.random() * 50);
            const randomSong = data.body.items[rand].track;
            setSongData({
                name: randomSong?.name.toLowerCase() || "",
                band: randomSong?.artists[0].name.toLowerCase() || "",
                previewUrl: randomSong?.preview_url || "",
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

        if (!solved[0] || !solved[1]) {
            setTimeout(
                () => {
                    newAudio.pause();
                    newAudio.currentTime = 0;
                },
                level.time[level.level - 1],
            );
        }
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
        setSolved([newSolution.name === songData.name, newSolution.band === songData.band]);

        if (!solved[0] || !solved[1]) {
            setLevel(prevLevel => ({
                ...prevLevel,
                level: prevLevel.level + 1,
            }));
        }
    }

    if (status === "pending") return <DotLoader color="#1a1a1a" />;

    if (status === "error") {
        return (
            <>
                <p className="errorP">Unexpected error :(</p>
                <button onClick={() => window.location.reload()}>Try reloading</button>
            </>
        );
    }

    return (
        <>
            <div className="play-box">
                <button className="play-button" onClick={playPreview}>
                    PLAY THE SONG
                </button>
            </div>
            <div className="level-box">
                {levelsState.map((state, index) => (
                    <p key={index} className={state}>
                        {index + 1}
                    </p>
                ))}
            </div>
            <form onSubmit={event => solve(event)} className="guess-box">
                {songData.name === solution.name && solution.name !== "" ? (
                    <>
                        {level.level === 5 && <p className="hint">Last chance!</p>}
                        <p className="correct">Correct! The name of the song is {songData.name}</p>
                    </>
                ) : level.level > 5 ? (
                    <p className="incorrect">The name of the song is {songData.name}. Try again!</p>
                ) : level.level >= 4 && solved[0] === false ? (
                    <>
                        {level.level === 5 && <p className="hint">Last chance!</p>}
                        <label htmlFor="song-name">Song name:</label>
                        <input
                            name="song-name"
                            className="input-guess"
                            placeholder={generatePlaceholder(songData.name)}
                            autoComplete="off"
                            onChange={e => setInputValues({...inputValues, songName: e.target.value})}
                        />
                    </>
                ) : (
                    <>
                        <label htmlFor="song-name">Song name:</label>
                        <input
                            name="song-name"
                            className="input-guess"
                            placeholder="Type your guess here"
                            autoComplete="off"
                            onChange={e => setInputValues({...inputValues, songName: e.target.value})}
                        />
                    </>
                )}
                {songData.band === solution.band && solution.band !== "" ? (
                    <p className="correct">Correct! The name of the band is {songData.band}</p>
                ) : level.level > 5 ? (
                    <p className="incorrect">The name of the band is {songData.band}. Try again!</p>
                ) : level.level >= 3 && solved[1] === false ? (
                    <>
                        <label htmlFor="band-name">Band name:</label>
                        <input
                            name="band-name"
                            className="input-guess"
                            placeholder="Type your guess here"
                            autoComplete="off"
                            onChange={e => setInputValues({...inputValues, bandName: e.target.value})}
                        />
                        <p className="hint">Psst! It starts with {songData.band[0].toUpperCase()}</p>
                    </>
                ) : (
                    <>
                        <label htmlFor="band-name">Band name:</label>
                        <input
                            name="band-name"
                            className="input-guess"
                            placeholder="Type your guess here"
                            autoComplete="off"
                            onChange={e => setInputValues({...inputValues, bandName: e.target.value})}
                        />
                    </>
                )}
                {level.level > 5 || (solved[0] && solved[1]) ? (
                    <button onClick={() => window.location.reload()}>Next game</button>
                ) : inputValues.songName === "" && inputValues.bandName === "" ? (
                    <button type="submit" className="submit">
                        Skip and add seconds
                    </button>
                ) : (
                    <button type="submit" className="submit">
                        Submit Guess
                    </button>
                )}
            </form>
        </>
    );
}

export default App;
