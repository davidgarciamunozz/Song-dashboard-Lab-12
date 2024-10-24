import { getSongs } from "../utils/firebase";

export const getSongsAction =  async() => {
    const songs = await getSongs();
    return {
        action: 'GET_SONGS',
        payload: songs
    };
}