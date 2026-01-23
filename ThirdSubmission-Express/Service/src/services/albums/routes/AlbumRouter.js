import { Router } from 'express';
import Validate from '../../../middlewares/Validator.js';
import AlbumSchema from '../validator/Schema.js';
import AlbumController from '../controllers/AlbumController.js';
import Upload from '../../storage/upload.js';

const AlbumRouter = Router();

AlbumRouter.post(
  '/albums',
  Validate(AlbumSchema.createAlbumPayloadSchema),
  AlbumController.postNewAlbum,
);
AlbumRouter.get('/albums/:id', AlbumController.getAlbumById);
AlbumRouter.put(
  '/albums/:id',
  Validate(AlbumSchema.updateAlbumPayloadSchema),
  AlbumController.updateAlbumById,
);
AlbumRouter.delete('/albums/:id', AlbumController.deleteAlbumById);
AlbumRouter.post('/albums/:id/covers', Upload.single('cover'), AlbumController.addAlbumCover);

export default AlbumRouter;
