import Usermodel from "../models/usermodel.js";
import jwt from 'jsonwebtoken';

const userAuth= async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            console.log("No Token Found Form Cookies");            
            return res.redirect('/login');
        }
        let decod=jwt.verify(token,"TokenKey");
        let data = await Usermodel.findById(decod.userId);
        if(!data){
            console.log("User Not Found In DB");
            return res.redirect('/login');
        }
        res.locals.user=data;
        return next();
    } catch (error) {
        console.log(error);
        return res.redirect('/login');
    }
}

export default userAuth;