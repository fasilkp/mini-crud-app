import express from 'express'
import UserModel from '../models/UserModel.js';

const router=express.Router()

router.get("/", async (req, res)=>{
    res.send("user home")
});
router.get("/signup", (req, res)=>{
    res.render("userSignup")
});
router.get("/login", (req, res)=>{
    res.render("userLogin")
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
            console.log(data)
            res.send("insert successfull")
        }
    })

})
router.post("/login", async (req, res)=>{
    const {email, password}=req.body;
    let user = await UserModel.findOne({email});
    console.log(user)
    if(user){
        if(user.password===password){
            res.redirect("/");
        }else{
            res.send("login failed")
        }
    }
})

export default router;