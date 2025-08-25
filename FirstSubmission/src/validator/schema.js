import Joi from 'joi';

export const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export const songSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});
