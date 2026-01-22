import { Router } from 'express';
import Validate from '../../../middlewares/Validator.js';
import AuthenticationSchema from '../validator/Schema.js';
import AuthenticationController from '../controller/AuthenticationController.js';

const AuthenticationRouter = Router();

AuthenticationRouter.post('/authentications', Validate(AuthenticationSchema.loginUserPayloadSchema), AuthenticationController.login);
AuthenticationRouter.put('/authentications', Validate(AuthenticationSchema.refreshTokenPayloadSchema), AuthenticationController.refreshToken);
AuthenticationRouter.delete('/authentications', Validate(AuthenticationSchema.refreshTokenPayloadSchema), AuthenticationController.logout);

export default AuthenticationRouter;
