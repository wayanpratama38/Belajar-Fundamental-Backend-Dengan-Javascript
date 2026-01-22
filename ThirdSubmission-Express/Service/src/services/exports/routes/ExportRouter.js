import { Router } from 'express';
import AuthMiddleware from '../../../middlewares/Auth.js';
import Validate from '../../../middlewares/Validator.js';
import ExportSchema from '../validator/Schema.js';
import ExportController from '../controller/ExportController.js';

const ExportRouter = Router();

ExportRouter.post('/export/playlists/:id', AuthMiddleware, Validate(ExportSchema.postExportPayloadSchema), ExportController.exportPlaylist);

export default ExportRouter;
