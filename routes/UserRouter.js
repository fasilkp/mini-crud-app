import express from 'express'
import UserModel from '../models/UserModel.js';
import verifyUser from '../middlewares/verifyUser.js';
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10);

const router=express.Router()

router.get("/",verifyUser, async (req, res)=>{
    res.render("userHome", {userName:req.session.user.name});
});
router.get("/signup", (req, res)=>{
    if(req.session.user){
        res.redirect("/")
    }else{
        res.render("userSignup")
    }
});
router.get("/login", (req, res)=>{
    if(req.session.user){
        res.redirect("/")
    }else{
        res.render("userLogin")
    }
});
router.post("/signup", (req, res)=>{
    const {name, email, password, mobile}=req.body;
    if(mobile.toString().length!=10){
        return res.render("userSignup",{numberNotValid:true, message:"Mobile number must be 10 digits"})    
    }
    if(name=="" || email=="" || password=="")
    {
        return res.render("userSignup",{error:true, message:"Please enter all fields"})
    }
    var hashPassword = bcrypt.hashSync(password, salt);
    let user = new UserModel({name, email, password:hashPassword, mobile})
    user.save((err, data)=>{
        if(err) {
            console.log(err)
            res.render("userSignup",{error:true, message:"Something went wrong"})
        }
        else {
            req.session.user={
                name,
                id:user._id
            }
            res.redirect("/")
        }
    })

})
router.post("/login", async (req, res)=>{
    const {email, password}=req.body;
    let user = await UserModel.findOne({email});
    if(user){
        if(bcrypt.compareSync(password, user.password)){
            req.session.user={
                name:user.name,
                id:user._id
            }
            res.redirect("/");
        }else{
            res.render("userLogin", {error:true})
        }
    }else{
        res.render("userLogin", {error:true})
    }
})
router.get("/logout", (req, res)=>{
    req.session.user=null;
    res.redirect("/login")
})

router.get("/check/:id", (req,res)=>{
    res.send(req.params.id)
})

export default router;