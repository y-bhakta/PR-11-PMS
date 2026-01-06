import { Router } from "express";
import webctl from "../controllers/webctl.js";
import userAuth from "../middlewares/userAuth.js";
import upload from "../middlewares/uploads.js";

const webrouter=Router();

//Login Roue
webrouter.get('/login',webctl.loginPage);
webrouter.post('/login',webctl.login);
//SignUp
webrouter.get('/signup',webctl.signuppage);
webrouter.post('/signup',webctl.signup);
webrouter.use(userAuth);
webrouter.get('/',webctl.dashboard);
webrouter.get('/view-users',webctl.viewUsers);
webrouter.get('/logout',webctl.logout);
webrouter.get('/addProduct',webctl.addProductPage);
webrouter.post('/addProduct',upload.single('image'),webctl.addProduct);
webrouter.get('/view-products',webctl.viewproducts);
webrouter.get('/addCategory',webctl.addcategoryPage);
webrouter.post('/addCategory',upload.single('image'),webctl.addcategory);
webrouter.get('/view-category',webctl.viewcategory);
webrouter.get('/delete-category/:id',webctl.deletecategory);
webrouter.get('/edit-category/:id',webctl.editcategorypage);
webrouter.post('/edit-category/:id',upload.single('image'),webctl.editcategory);
webrouter.get('/delete-product/:id',webctl.deleteproduct);
webrouter.get('/edit-product/:id',webctl.editproductpage);
webrouter.post('/edit-product/:id',upload.single('image'),webctl.editproduct);
webrouter.get('/view-all-products',webctl.viewallproducts);
webrouter.get('/product-details/:id',webctl.productdetailspage);
export default webrouter;