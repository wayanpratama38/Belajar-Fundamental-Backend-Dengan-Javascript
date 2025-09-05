import Joi from 'joi';

export const PostAuthenticationScheme = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const PutAuthenticationScheme = Joi.object({
  refreshToken: Joi.string().required(),
});

export const DeleteAuthenticationScheme = Joi.object({
  refreshToken: Joi.string().required(),
});
