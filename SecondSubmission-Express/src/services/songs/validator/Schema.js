import Joi from 'joi';

const SongSchema = {
  createSongPayloadSchema: Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
  }),

  updateSongPayloadSchema: Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
  }),

  getSongQuerySchema: Joi.object({
    title: Joi.string().empty(),
    performer: Joi.string().empty(),
  }),
};

export default SongSchema;
