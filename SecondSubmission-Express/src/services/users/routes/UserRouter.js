import {Router} from 'express';
import Validate from '../../../middlewares/Validator.js';
import UserSchema from '../validator/Schema.js';
import UserController from '../controller/UserController.js';

const UserRouter = Router();

UserRouter.post('/users',Validate(UserSchema.createUserPayloadSchema),UserController.postNewUser);

export default UserRouter;