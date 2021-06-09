import express from 'express';
import cors from 'cors';
import { router } from './routes.js';
const app = express();

app.use(cors());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

app.use('/api', router);
app.get('/', (req, res) => {
    res.send('Hello to my API');
  });
const PORT = process.env.PORT|| 5000;

app.listen(PORT,()=> console.log("server in running on port"+PORT));