import express from "express";
import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);

const router = express.Router();
let userDeleted = false;
let userUpdated = false;

router.get("/", verifyAdmin, async (req, res) => {
  let users = await UserModel.find({}, { password: 0 }).lean();
  res.render("adminHome", {
    users,
    userDeleted,
    userUpdated,
    adminName: req.session.admin.name,
  });
});

router.get("/signup", (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin/");
  } else {
    res.render("adminSignup");
  }
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (name == "" || email == "" || password == "") {
    return res.render("adminSignup", {
      error: true,
      message: "Please enter all fields",
    });
  }
  var hashPassword = bcrypt.hashSync(password, salt);
  let admin = new AdminModel({ name, email, password: hashPassword });
  admin.save((err, data) => {
    if (err) {
      console.log(err);
      res.render("adminSignup", {
        error: true,
        message: "Something went wrong",
      });
    } else {
      req.session.admin = {
        name,
      };
      res.redirect("/");
    }
  });
});

router.get("/login", (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin/");
  } else {
    res.render("adminLogin");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let admin = await AdminModel.findOne({ email });
  if (admin) {
    if (bcrypt.compareSync(password, admin.password)) {
      req.session.admin = {
        name: admin.name,
      };
      res.redirect("/admin/");
    } else {
      res.render("adminLogin", { error: true });
    }
  } else {
    res.render("adminLogin", { error: true });
  }
});

router.get("/delete-user/:id", verifyAdmin, (req, res) => {
  const _id = req.params.id;
  UserModel.deleteOne({ _id })
    .then(function () {
      console.log("deleted Successfull");
      if(_id==req.session.user.id){
        req.session.user=null;
      }
      userDeleted = true;
      res.redirect("/admin/");
    })
    .catch(function (error) {
      res.json({ error: "delete Failed" });
      console.log("error : " + error);
    });
});
router.get("/update-user/:id", verifyAdmin, async (req, res) => {
  const _id = req.params.id;
  const user = await UserModel.findById(_id);
  res.render("updateUser", {
    _id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
});

router.post("/update-user", verifyAdmin, (req, res) => {
  const { name, email, _id, mobile } = req.body;
  UserModel.findByIdAndUpdate(
    _id,
    { $set: { name, email, mobile } },
    function (err, docs) {
      if (err) {
        res.render("updateUser", { error: true });
      } else {
        userUpdated = true;
        res.redirect("/admin/");
      }
    }
  );
});

router.get("/remove-alert", verifyAdmin, (req, res) => {
  userDeleted = false;
  userUpdated = false;
  res.redirect("/admin/");
});

router.get("/logout", (req, res) => {
  req.session.admin = null;
  res.redirect("/admin/login");
});

router.post("/search-user", async (req, res) => {
  const { key } = req.body;
  const users = await UserModel.find({ name: new RegExp(key, "i") }).lean();
  res.render("adminHome", { users });
});

router.get("/create-user", verifyAdmin, (req, res) => {
  res.render("createUser");
});

router.post("/create-user", verifyAdmin, (req, res) => {
  const { name, email, password, mobile } = req.body;
  if(mobile.toString().length!=10){
    return res.render("createUser",{numberNotValid:true, message:"Mobile number must be 10 digits"})    
  }
  if (name == "" || email == "" || password == "") {
    return res.render("createUser", {
      error: true,
      message: "Please enter all fields",
    });
  }
  var hashPassword = bcrypt.hashSync(password, salt);
  let user = new UserModel({ name, email, password: hashPassword, mobile });
  user.save((err, data) => {
    if (err) {
      console.log(err);
      res.render("createUser", { error: true, message:"Something went wrong" });
    } else {
      res.redirect("/admin/");
    }
  });
});



export default router;
