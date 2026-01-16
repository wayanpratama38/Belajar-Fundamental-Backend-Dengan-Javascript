import express from "express";
import routes from "../routes/index.js"
import ErrorHandler from "../middlewares/error.js";


const app = express();

app.use(express.json())
app.use(ErrorHandler)
app.use(routes)


export default app;

