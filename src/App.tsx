import {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import DotLoader from "react-spinners/DotLoader";
import {songsPlaylistFolkMetal} from "./api/getSong";
import "./style/app.css";
import PlayButton from "./components/PlayButton";
import Levels from "./components/Levels";
import GuessForm from "./components/GuessForm";
import Modal from "react-modal";
import Instructions from "./components/Instuctions";

function App() {
    const isMounted = useRef(false);
    const [solved, setSolved] = useState([false, false]);
    const [solution, setSolution] = useState({name: "", band: ""});
    const [audio, setAudio] = useState(new Audio());
    const [levelsState, setLevelsState] = useState(Array(5).fill("level-bubble"));
    const [showModal, setShowModal] = useState(false);
    const [songData, setSongData] = useState({
        name: "",
        band: "",
        previewUrl: "",
        id: "",
    });
    const [inputValues, setInputValues] = useState({
        songName: "",
        bandName: "",
    });
    const [level, setLevel] = useState({
        time: [1000, 2500, 6000, 12000, 30000],
        level: 1,
    });

    const {data, status} = useQuery({
        queryKey: ["songs"],
        queryFn: async () => {
            const cachedData = sessionStorage.getItem("songs");

            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                return parsedData;
            } else {
                const freshData = await songsPlaylistFolkMetal();
                sessionStorage.setItem("songs", JSON.stringify(freshData));
                return freshData;
            }
        },
    });

    useEffect(() => {
        isMounted.current = true;
    }, []);

    useEffect(() => {
        if (data) {
            sessionStorage.setItem("songs", JSON.stringify(data));
            const rand = Math.floor(Math.random() * data.length);
            let randomSong = data[rand].track;

            while (!randomSong.preview_url) {
                const rand = Math.floor(Math.random() * data.length);
                randomSong = data[rand].track;
            }

            const usedSongs = JSON.parse(localStorage.getItem("usedSongs") || "[]");
            if (usedSongs) {
                while (usedSongs.includes(randomSong?.id)) {
                    const rand = Math.floor(Math.random() * data.length);
                    randomSong = data[rand].track;
                }
            }

            setSongData({
                name: randomSong?.name.toLowerCase() || "",
                band: randomSong?.artists[0].name.toLowerCase() || "",
                previewUrl: randomSong?.preview_url || "",
                id: randomSong?.id || "",
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

    useEffect(() => {
        const modalShownBefore = sessionStorage.getItem("modalShownBefore");
        if (!modalShownBefore) {
            setShowModal(true);
            sessionStorage.setItem("modalShownBefore", "true");
        }
    }, []);

    const closeModal = () => {
        setShowModal(false);
    };

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
        if (solved[0]) songName = songData.name;
        let bandName = document.querySelector<HTMLInputElement>("[name=band-name]")?.value;
        if (solved[1]) bandName = songData.band;

        const newSolution = {
            name: songName!.toLowerCase().trim(),
            band: bandName!.toLowerCase().trim(),
        };
        setSolution(newSolution);
        setSolved([newSolution.name === songData.name, newSolution.band === songData.band]);

        if (!solved[0] || !solved[1]) {
            setLevel(prevLevel => ({
                ...prevLevel,
                level: prevLevel.level + 1,
            }));
        }

        if (level.level === 5 || (solved[0] && solved[1])) {
            const usedSongs = JSON.parse(localStorage.getItem("usedSongs") || "[]");
            usedSongs.push(songData.id);
            localStorage.setItem("usedSongs", JSON.stringify(usedSongs));
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
            {solved[0] === true && solved[1] === true && (
                <div>
                    <img
                        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGdmcWE0aHk3ZXFwbDU1cnZubXgzNGxiYjFqbGM3N3R6MWtjejUxOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/5j5ZLtybC9q9avWqX8/giphy.gif"
                        alt="capybara dancing"
                        className="capybara-dancing"
                    />
                </div>
            )}
            <PlayButton playPreview={playPreview} content={"PLAY SONG"} />
            <Levels levelsState={levelsState} />
            <GuessForm
                solve={solve}
                songData={songData}
                solution={solution}
                level={level}
                solved={solved}
                setInputValues={setInputValues}
                inputValues={inputValues}
            />

            <Modal
                className="modal-box"
                isOpen={showModal}
                onRequestClose={closeModal}
                contentLabel="Game Instructions"
            >
                <Instructions closeModal={closeModal} />
            </Modal>
        </>
    );
}

export default App;
