import Joi from 'joi';

const AlbumSchema = {
  createAlbumPayloadSchema: Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
  }),

  updateAlbumPayloadSchema: Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
  }),
};

export default AlbumSchema;
