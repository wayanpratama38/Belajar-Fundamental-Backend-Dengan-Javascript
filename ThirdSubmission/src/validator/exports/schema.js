import Joi from 'joi';

export const postExportSchema = Joi.object({
    targetEmail : Joi.string().email({tlds : { allow : true}}).required()
})