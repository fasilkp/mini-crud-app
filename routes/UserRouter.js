import express from 'express'
import UserModel from '../models/UserModel.js';
import verifyUser from '../middlewares/verifyUser.js';

const router=express.Router()

router.get("/",verifyUser, async (req, res)=>{
    res.render("userHome")
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
    const {name, email, password}=req.body;
    let user = new UserModel({name, email, password})
    user.save((err, data)=>{
        if(err) {
            console.log(err)
            res.send("insert failed")
        }
        else {
            req.session.user={
                name
            }
            res.redirect("/")
        }
    })

})
router.post("/login", async (req, res)=>{
    const {email, password}=req.body;
    let user = await UserModel.findOne({email});
    if(user){
        if(user.password===password){
            req.session.user={
                name:user.name
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

export default router;