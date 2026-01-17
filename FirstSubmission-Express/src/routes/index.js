import { Router } from "express";
import AlbumRouter from "../services/albums/routes/AlbumRouter.js";
import SongRouter from "../services/songs/routes/SongRouter.js";

const router = Router();

router.use(AlbumRouter);
router.use(SongRouter);

export default router;
