import dotenv from 'dotenv';

import Express from 'express';
import ErrorHandler from '../middlewares/Error.js';
import router from '../routes/index.js';

dotenv.config();

const app = Express();

app.use(Express.json());
app.use(router);
app.use(ErrorHandler);

export default app;
