import { albumCoverSchema, albumSchema, songSchema } from './schema.js';
import { getValidateResult, checkValidateResult } from './utils.js';

export const Validator = {
  validateAlbumPayload: (payload) => {
    const validateResult = getValidateResult(albumSchema, payload);
    checkValidateResult(validateResult);
  },

  validateUploadAlbumCoverPayload : (payload) => {
    const validateResult = getValidateResult(albumCoverSchema,payload);
    checkValidateResult(validateResult);
  },

  validateSongPayload: (payload) => {
    const validateResult = getValidateResult(songSchema, payload);
    checkValidateResult(validateResult);
  },
};
