import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path';

import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import {connectDB} from './lib/db.js'
import { app, server } from './lib/socket.js';

dotenv.config()

const port = process.env.PORT || 5124;
const __dirname = path.resolve()

app.use(
  cors({         
    origin: ["http://localhost:5173"],
    credentials:true,
  })
)  // this allows reqests from port 5173 whithout giving CORS error

app.use(express.json({limit: "7mb"}))   // aa che new line, image upload karva mate, default 100kb hoy che, 7mb karva mate limit set kari che, express.json() middleware use karva thi json body parse thai jay che, ane limit set karva thi image upload karva mate size limit set thai jay che
app.use(cookieParser()) // allow kare che cookie parse karva mate, auth middleware ma token parse karva mate use thai che

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Image too large. Please upload under 7MB.' });
  }
  next(err);
});

// routes
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

// Server Frontend
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req,res)=> {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

server.listen(port, () => {
  console.log("Server is running on port :", port);
  connectDB()
})
