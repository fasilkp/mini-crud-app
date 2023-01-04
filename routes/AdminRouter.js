import express from 'express'

const router=express.Router()

router.get("/", (req, res)=>{
    res.send("admin working")
});
router.get("/signup", (req, res)=>{
    res.render('adminSignup')
});
router.get("/login", (req, res)=>{
    res.render('adminLogin')
});

export default router;