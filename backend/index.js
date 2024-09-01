import express from 'express';
import mainRouter from './routes/index1.js'
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/v1',mainRouter);

app.listen(3000,()=>{
    console.log("Server running on port : 3000")
})

