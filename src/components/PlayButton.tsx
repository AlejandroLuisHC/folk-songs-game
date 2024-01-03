const PlayButton = ({playPreview, content}: {playPreview: () => void; content: string}) => {
    return (
        <div className="play-box">
            <button className="play-button" onClick={playPreview}>
                {content}
            </button>
        </div>
    );
};

export default PlayButton;
