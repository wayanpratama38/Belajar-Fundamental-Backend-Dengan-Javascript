import { Router } from 'express';
import Validate from '../../../middlewares/Validator.js';
import SongSchema from '../validator/Schema.js';
import SongController from '../controller/SongsController.js';

const SongRouter = Router();

SongRouter.post(
  '/songs',
  Validate(SongSchema.createSongPayloadSchema),
  SongController.postNewSong,
);
SongRouter.get(
  '/songs',
  Validate(SongSchema.getSongQuerySchema),
  SongController.getAllSongs,
);
SongRouter.get('/songs/:id', SongController.getSongById);
SongRouter.put(
  '/songs/:id',
  Validate(SongSchema.updateSongPayloadSchema),
  SongController.updateSongById,
);
SongRouter.delete('/songs/:id', SongController.deleteSongById);

export default SongRouter;
