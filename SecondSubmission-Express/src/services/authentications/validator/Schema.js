import Joi from 'joi'

const AuthenticationSchema = {
 loginUserPayloadSchema : Joi.object({
  username : Joi.string().required(),
  password : Joi.string().required()
 }),

 refreshTokenPayloadSchema : Joi.object({
  refreshToken : Joi.string().required()
 })
}

export default AuthenticationSchema