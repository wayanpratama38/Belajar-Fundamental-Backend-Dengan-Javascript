import { Router } from 'express';
import AlbumRouter from '../services/albums/routes/AlbumRouter.js';
import SongRouter from '../services/songs/routes/SongRouter.js';
import UserRouter from '../services/users/routes/UserRouter.js';
import AuthenticationRouter from '../services/authentications/routes/AuthenticationRoute.js';
import PlaylistRouter from '../services/playlists/routes/PlaylistRotes.js';

const router = Router();

router.use(AlbumRouter);
router.use(SongRouter);
router.use(UserRouter)
router.use(AuthenticationRouter)
router.use(PlaylistRouter)

export default router;
