import express from 'express'
import {engine} from 'express-handlebars'
import 'dotenv/config'
import path from 'path';

const app=express()

app.engine("hbs", engine({extname:".hbs"}));
app.set("view engine", "hbs");

const __dirname = path.resolve();

app.use(express.static(__dirname + '/public'));
app.use(express.json())

app.get("/", (req, res)=>{
    res.render("home")
})

app.listen(5000, ()=>{
    console.log("Server Running on http://localhost:5000/")
})