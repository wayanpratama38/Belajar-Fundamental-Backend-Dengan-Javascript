import {Router} from 'express';
import AuthMiddleware from '../../../middlewares/Auth.js';
import Validate from '../../../middlewares/Validator.js';
import CollaborationSchema from '../validator/Schema.js';
import CollaborationController from '../controller/CollaborationController.js';

const CollaborationRouter = Router();

CollaborationRouter.post('/collaborations',AuthMiddleware,Validate(CollaborationSchema.createCollaborationPayloadSchema),CollaborationController.createNewCollaborator);
CollaborationRouter.delete('/collaborations',AuthMiddleware,Validate(CollaborationSchema.deleteCollaborationPayloadSchema),CollaborationController.deleteCollaborator)

export default CollaborationRouter;