import { Router } from "express";
import notes from "../services/notes/routes/index.js";

const routes = Router();

routes.use("/", notes);

export default routes;
