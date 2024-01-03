const Instructions = ({closeModal}: {closeModal: () => void}) => {
    return (
        <div className="modal-wrapper">
            <h2 className="modal-title">Welcome to the Folk Song Game!</h2>
            <ol className="instructions">
                <li>Listen to a snippet of a song for a few seconds.</li>
                <li>Challenge yourself to guess the song name and the band.</li>
                <li>
                    If you don't guess both correctly, don't worry! You have 4 more attempts. Each attempt
                    grants you more time to listen to the song (1s, 2.5s, 6s, 12s, and 30s). Additionally,
                    helpful hints will appear to guide you.
                </li>
                <li>Have a blast and folk on!</li>
            </ol>
            <button className="modal-button" onClick={closeModal}>
                Got it!
            </button>
        </div>
    );
};

export default Instructions;
