import Joi from 'joi';

const UserSchema = {
  createUserPayloadSchema: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
  }),
};

export default UserSchema;
