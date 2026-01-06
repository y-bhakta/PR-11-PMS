import Usermodel from "../models/usermodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Category from "../models/categorymodel.js";
import fs from 'fs';
import Products from "../models/productmodel.js";

const webctl={
    dashboard(req,res){
        res.render('./index.ejs');
    },
    // Login 
    loginPage(req,res){
        return res.render('./pages/login.ejs');
    },
    async login(req,res){
        try {
            const {email,password}=req.body;
            let userone=await Usermodel.findOne({email});
            if(!userone){
                console.log("User Not Found!");
                return res.redirect('/login');
            }
            const isValid=await bcrypt.compare(password,userone.password);
            if(!isValid){
                console.log("Invalid Password");
                return res.redirect('/login');
            }
            let payload={
                userId:userone._id,
                Role:userone.role
            }
            const token=jwt.sign(payload,"TokenKey");
            res.cookie('token',token);
            console.log("Loged In Success");
            return res.redirect('/');
        } catch (error) {
            console.log(error);
            return res.redirect('/login');
        }
    },
    //Signup
    signuppage(req,res){
        return res.render('./pages/signup.ejs');
    },
    async signup(req,res){
        try {
            const {password,c_password}=req.body;
            if(password!==c_password){
                console.log("Password And ConfirmPassword Not MAtch");
                return res.redirect('/signup');
            }
            req.body.password=await bcrypt.hash(password,10);
            await Usermodel.create(req.body);
            console.log("User Created Success");
            return res.redirect('/login');
        } catch (error) {
            console.log(error);
            return res.redirect('/signup');
        }
    },
    // View Users
    async viewUsers(req,res){
        try {
            const alluser=await Usermodel.find({role:'User'});
            res.render('./pages/view-users.ejs',{alluser});
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    // Logout
    logout(req,res){
        return res.clearCookie('token').redirect('/login');
    },
    // Add Product
    async addProductPage(req,res){
        try {
            const categorys=await Category.find({});
            return res.render('./pages/add-product.ejs',{categorys});
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    async addProduct(req,res){
        try {
            if(req.file){
                req.body.image = req.file.path || req.file?.secure_url || req.file?.url || req.file?.filename || '';
            }
            // Ensure numeric fields are numbers
            if(req.body.price) req.body.price = Number(req.body.price);
            if(req.body.stock) req.body.stock = Number(req.body.stock);
            if(req.body.rating) req.body.rating = Number(req.body.rating);

            await Products.create(req.body);
            return res.redirect('/view-products');
        } catch (error) {
            console.log(error);
            return res.redirect('/addProduct');
        }
    },
    // Add Category
    addcategoryPage(req,res){
        return res.render('./pages/add-category.ejs');
    },
    async addcategory(req,res){
        try {
            req.body.image=req.file.path;
            await Category.create(req.body);
            return res.redirect('/view-category');
        } catch (error) {
            console.log(error);
            return res.redirect('/add-category');
        }
    },
    async viewcategory(req,res){
        try {
            const categorys=await Category.find({});
            return res.render('./pages/view-category.ejs',{categorys});
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    async deletecategory(req,res){
        try {
            const {id}=req.params;
            await Category.findByIdAndDelete(id);
            return res.redirect('/view-category');
        } catch (error) {
            console.log(error);
            return res.redirect('/view-category');
        }
    },
    async editcategorypage(req,res){
        try {
            const {id}=req.params;
            const data=await Category.findById(id);
            return res.render('./pages/edit-category.ejs',{data});
        } catch (error) {
            console.log(error);
            return res.redirect('/view-category');
        }
    },
    async editcategory(req,res){
        try {
            const {id}=req.params;
            if(req.file){
                req.body.image=req.file.path;
            }
            let data=await Category.findByIdAndUpdate(id,req.body);
            if(req.file && data && data.image && fs.existsSync(data.image)){
                try{
                    fs.unlinkSync(data.image);
                }catch(e){
                    console.log('Failed to remove old image:', e);
                }
            }
            return res.redirect('/view-category');
        } catch (error) {
            console.log(error);
            return res.redirect('/view-category');
        }
    },
    async viewproducts(req,res){
        try {
            const product=await Products.find({}).populate('category');
            return res.render('./pages/view-product.ejs',{product});
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    async deleteproduct(req,res){
        try {
            const {id}=req.params;
            await Products.findByIdAndDelete(id);
            return res.redirect('/view-products');
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    async editproductpage(req,res){
        try {
            const {id}=req.params;
            let data=await Products.findById(id);
            let categorys=await Category.find({});
            return res.render('./pages/edit-product.ejs',{data,categorys});
        } catch (error) {
            console.log(error);
            return res.redirect('/view-products');
        }
    },
    async editproduct(req,res){
        try {
            const {id}=req.params;
            if(req.file){
                req.body.image=req.file.path;
            }
            let product=await Products.findByIdAndUpdate(id,req.body);
            return res.redirect('/view-products');
        } catch (error) {
            console.log(error);
            return res.redirect('view-products');
        }
    },
    async viewallproducts(req,res){
        try {
            const products=await Products.find({}).populate('category');
            return res.render('./pages/view-all-products.ejs',{products});
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    async productdetailspage(req,res){
        try {
            const {id}=req.params;
            let oneproduct=await Products.findById(id).populate('category');
            let products=await Products.find({}).populate('category');
            return res.render('./pages/product-details.ejs',{
                oneproduct,products
            }) ;
        } catch (error) {
            console.log(error);
            return res.redirect(req.get('Referre') || '/');
        }
    }
}

export default webctl;