import Joi from 'joi';

const ExportSchema = {
  postExportPayloadSchema: Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required(),
  }),
};

export default ExportSchema;
