import express from 'express';
import dotenv from './configs/dotenv.js';
import router from './routes/index.js';
import db from "./configs/db.js";
import cookieParser from 'cookie-parser';

const app=express();
const port=dotenv.PORT || 3000;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/',router);

app.listen(port,(err)=>{
    if(!err){
        console.log(`Server is running on port http://localhost:${port}`);
    }else{
        console.log(err);
    }
});