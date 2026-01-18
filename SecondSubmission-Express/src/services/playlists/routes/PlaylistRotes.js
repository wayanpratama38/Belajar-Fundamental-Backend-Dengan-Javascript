import {Router} from 'express';
import Validate from '../../../middlewares/Validator.js';
import PlaylistSchema from '../validator/Schema.js';
import PlaylistController from '../controller/PlaylistController.js';
import AuthMiddleware from '../../../middlewares/Auth.js';

const PlaylistRouter = Router();


PlaylistRouter.post('/playlists',AuthMiddleware,Validate(PlaylistSchema.createNewPlaylistPayloadSchema),PlaylistController.createNewPlaylist);
PlaylistRouter.get('/playlists',AuthMiddleware,PlaylistController.getAllPlaylists)
PlaylistRouter.delete('/playlists/:id',AuthMiddleware,PlaylistController.deletePlaylistById)
PlaylistRouter.post('/playlists/:id/songs',AuthMiddleware, Validate(PlaylistSchema.addSongInPlaylistPayloadSchema),PlaylistController.addSongInPlaylist)
PlaylistRouter.get('/playlists/:id/songs',AuthMiddleware, PlaylistController.getSongInPlaylist)
PlaylistRouter.delete('/playlists/:id/songs',AuthMiddleware,Validate(PlaylistSchema.deleteSongInPlaylistPayloadSchema), PlaylistController.deleteSongInPlaylist)

export default PlaylistRouter;