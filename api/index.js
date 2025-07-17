import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import AuthRoute from './routes/AuthRoute.js';
import QrRoute from './routes/QrRoute.js';

dotenv.config()

const PORT = process.env.PORT;
const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))


//route setup

app.use('/api/auth',AuthRoute)
app.use('/api/qr', QrRoute);



mongoose.connect(process.env.MONGODB)
.then(()=>{
    console.log("database is conneted");
}) 
.catch(()=>{
    console.log("database is failed to connect")
}) 

app.listen(PORT, ()=>{
    console.log('server is running on port : ', PORT);
})