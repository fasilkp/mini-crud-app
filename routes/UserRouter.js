import express from 'express'

const router=express.Router()

router.get("/", (req, res)=>{
    res.send("User working")
});
router.get("/signup", (req, res)=>{
    res.render("userSignup")
});
router.get("/login", (req, res)=>{
    res.render("userLogin")
});

export default router;