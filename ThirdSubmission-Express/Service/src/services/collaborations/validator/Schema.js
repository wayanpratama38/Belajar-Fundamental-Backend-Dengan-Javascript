import Joi from 'joi';

const CollaborationSchema = {
  createCollaborationPayloadSchema: Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
  }),
  deleteCollaborationPayloadSchema: Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

export default CollaborationSchema;
