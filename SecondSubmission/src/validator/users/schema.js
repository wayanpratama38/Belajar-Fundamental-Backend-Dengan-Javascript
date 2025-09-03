import Joi from "joi";

export const UserSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required(),
    fullname : Joi.string().required()
})