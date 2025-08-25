import { albumSchema, songSchema } from './schema.js';
import InvariantError from '../exceptions/invariantError.js';

function getValidateResult(schema, payload) {
  return schema.validate(payload);
}

function checkValidateResult(validationResult) {
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
}

export const Validator = {
  validateAlbumPayload: (payload) => {
    const validateResult = getValidateResult(albumSchema, payload);
    checkValidateResult(validateResult);
  },

  validateSongPayload: (payload) => {
    const validateResult = getValidateResult(songSchema, payload);
    checkValidateResult(validateResult);
  },
};
