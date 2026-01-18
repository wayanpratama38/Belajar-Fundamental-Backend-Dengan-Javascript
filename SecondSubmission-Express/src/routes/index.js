import { Router } from 'express';
import AlbumRouter from '../services/albums/routes/AlbumRouter.js';
import SongRouter from '../services/songs/routes/SongRouter.js';
import UserRouter from '../services/users/routes/UserRouter.js';

const router = Router();

router.use(AlbumRouter);
router.use(SongRouter);
router.use(UserRouter)

export default router;
