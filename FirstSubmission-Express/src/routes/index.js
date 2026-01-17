import { Router } from "express";
import AlbumRouter from "../services/albums/routes/AlbumRouter.js";

const router = Router();

router.use(AlbumRouter);

export default router;
