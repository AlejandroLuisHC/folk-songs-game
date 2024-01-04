import {generatePlaceholder} from "../helpers/generatePlaceholder";

const GuessForm = ({
    solve,
    songData,
    solution,
    level,
    solved,
    setInputValues,
    inputValues,
}: {
    solve: (event: React.FormEvent<HTMLFormElement>) => void;
    songData: {name: string; band: string};
    solution: {name: string; band: string};
    level: {level: number};
    solved: boolean[];
    setInputValues: (inputValues: {songName: string; bandName: string}) => void;
    inputValues: {songName: string; bandName: string};
}) => {
    return (
        <form onSubmit={event => solve(event)} className="guess-box">
            {solved[0] && solution.name !== "" ? (
                <>
                    {!solved[1] && level.level === 5 && <p className="hint">Last chance!</p>}
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
            ) : level.level >= 3 && !solved[1] ? (
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
    );
};

export default GuessForm;
