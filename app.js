import express from 'express';
import adminRouter from './routes/adminRoutes.js';
import authRouter from './middleware/authentication.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
import cors from 'cors';
import  apiRoutes from './routes/index.js';

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Pitique server is listening at http://localhost:${port}`);
});

