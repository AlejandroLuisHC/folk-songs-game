const Levels = ({levelsState}: {levelsState: string[]}) => {
    return (
        <div className="level-box">
            {levelsState.map((state, index) => (
                <p key={index} className={state}>
                    {index + 1}
                </p>
            ))}
        </div>
    );
};

export default Levels;
