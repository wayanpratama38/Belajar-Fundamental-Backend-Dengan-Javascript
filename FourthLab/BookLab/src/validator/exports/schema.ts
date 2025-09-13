import Joi from 'joi';


export const ExportBookPayloadSchema = Joi.object({
    targetEmail : Joi.string().email({tlds : {allow : true}}).required()
}) ;
