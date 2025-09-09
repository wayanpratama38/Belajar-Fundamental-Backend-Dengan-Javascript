import { checkValidateResult, getValidateResult } from '../utils.js';
import { deleteSongIntoPlaylist, postPlaylistSchema, postSongIntoPlaylist } from './schema.js';

export const PlaylistValidator = {
  validatePostPlaylist: (payload) => {
    const validateResult = getValidateResult(postPlaylistSchema, payload);
    return checkValidateResult(validateResult);
  },
  validatePostSongIntoPlaylist: (payload) => {
    const validateResult = getValidateResult(postSongIntoPlaylist, payload);
    return checkValidateResult(validateResult);
  },
  validateDeleteSongIntoPlaylist : (payload) => {
    const validateResult  = getValidateResult(deleteSongIntoPlaylist,payload)
    return checkValidateResult(validateResult);
  }
};
