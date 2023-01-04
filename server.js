import express from 'express'
import {engine} from 'express-handlebars'
import 'dotenv/config'
import path from 'path';
import connectDB from './config/dbConnect.js';
import UserRouter from "./routes/UserRouter.js"
import AdminRouter from "./routes/AdminRouter.js"

const app=express()
connectDB()

app.engine("hbs", engine({extname:".hbs"}));
app.set("view engine", "hbs");
const __dirname = path.resolve();

app.use(express.static(__dirname + '/public'));
app.use(express.json())

app.use("/", UserRouter)
app.use("/admin", AdminRouter)

app.listen(5000, ()=>{
    console.log("Server Running on http://localhost:5000/")
})