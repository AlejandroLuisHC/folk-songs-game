export const generatePlaceholder = (songName: string) => {
    return songName.replace(/\p{L}/gu, '_');
};
