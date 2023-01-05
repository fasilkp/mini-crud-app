import express from 'express'
import UserModel from '../models/UserModel.js';

const router=express.Router()
let userDeleted=false;


router.get("/", async(req, res)=>{
    try{
        let users= await UserModel.find({}).lean();
        res.render("adminHome", {users, userDeleted})

    }catch(err){
        console.log(err)
        res.json(err)
    }
});


router.get("/signup", (req, res)=>{
    res.render('adminSignup')
});


router.get("/login", (req, res)=>{
    res.render('adminLogin')
});


router.get("/delete-user/:id", (req, res)=>{
    const _id=req.params.id;
    UserModel.deleteOne({ _id }).then(function(){
        console.log("deleted Successfull");
        userDeleted=true;
        res.redirect("/admin/")
     }).catch(function(error){
        console.log("error : "+error);
     });
});
router.get("/remove-alert", (req,res)=>{
    userDeleted=false;
    res.redirect("/admin/")
})

export default router;