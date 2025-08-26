import Joi from "joi";

export const BookPayloadSchema = Joi.object({
    title : Joi.string().required(),
    body : Joi.string().required(),
    tags : Joi.array().items(Joi.string()).required()
})

