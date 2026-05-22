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
// configure CORS to allow multiple origins and localhost in development
const rawOrigins = process.env.FRONTEND_URL || '';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
if (process.env.NODE_ENV === 'development') {
    if (!allowedOrigins.includes('http://localhost:5173')) {
        allowedOrigins.push('http://localhost:5173');
    }
}
console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin like mobile apps or curl
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));


//route setup

app.use('/api/auth',AuthRoute)
app.use('/api/qr', QrRoute);



mongoose.connect(process.env.MONGODB)
.then(()=>{
    console.log("Database Connected");
}) 
.catch(()=>{
    console.log("Database is failed to connect")
}) 

app.listen(PORT, ()=>{
    console.log('server is running on port : ', PORT);
})