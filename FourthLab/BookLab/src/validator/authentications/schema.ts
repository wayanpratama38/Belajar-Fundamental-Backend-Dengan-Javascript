import Joi from 'joi';



export const PostAuthenticationSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required()
});

export const PutAuthenticationSchema = Joi.object({
    refreshToken : Joi.string().required()
});

export const DeleteAuthenticationSchema = Joi.object({
    refreshToken : Joi.string().required()
});
