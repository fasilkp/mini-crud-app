import express from "express";
import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();
let userDeleted = false;
let userUpdated = false;
router.get("/",verifyAdmin, async (req, res) => {
  try {
    let users = await UserModel.find({}).lean();
    res.render("adminHome", { users, userDeleted, userUpdated });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.get("/signup", (req, res) => {
  if(req.session.admin){
    res.redirect("/admin/")
  }else{
    res.render("adminSignup");
  }
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  let admin = new AdminModel({ name, email, password });
  admin.save((err, data) => {
    if (err) {
      console.log(err);
      res.render("adminLogin", {error:true})
    } else {
      req.session.admin={
        name
      }
      res.redirect("/");
    }
  });
});

router.get("/login", (req, res) => {
  if(req.session.admin){
    res.redirect("/admin/")
  }else{
    res.render("adminLogin");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let admin = await AdminModel.findOne({ email });
  if (admin) {
    if (admin.password === password) {
      req.session.admin={
        name:admin.name
      }
      res.redirect("/admin/");
    } else {
      res.render("adminLogin", { error: true });
    }
  } else {
    res.render("adminLogin", { error: true });
  }
});

router.get("/delete-user/:id",verifyAdmin, (req, res) => {
  const _id = req.params.id;
  UserModel.deleteOne({ _id })
    .then(function () {
      console.log("deleted Successfull");
      userDeleted = true;
      res.redirect("/admin/");
    })
    .catch(function (error) {
      console.log("error : " + error);
    });
});
router.get("/update-user/:id",verifyAdmin, async (req, res) => {
  const _id = req.params.id;
  const user= await UserModel.findById(_id);
  console.log(user)
  res.render("updateUser", { _id, name:user.name, email:user.email });
});
router.post("/update-user", (req, res) => {
  const { name, email, _id } = req.body;
  UserModel.findByIdAndUpdate(
    _id,
    { $set: { name, email } },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
        userUpdated=true;
        res.redirect("/admin/")
      }
    }
  );
});

router.get("/remove-alert", (req, res) => {
  userDeleted = false;
  userUpdated = false;
  res.redirect("/admin/");
});

export default router;
