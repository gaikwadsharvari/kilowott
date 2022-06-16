const express = require('express');
var router = express.Router();
const bookshelf = require("../db-config");
const CryptoJS = require("crypto-js");
const helper = require("../lib/helper");
const moment = require("moment");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const maxSize = 500 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = './uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    let date = moment(new Date()).format("DDMMYYhhmmss");
    cb(null, date + "-" + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize
  },
  fileFilter: function (req, file, cb) {
    var filetypes = /png|jpg|jpeg/;
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    return cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
        filetypes
      )
    );
  }
});
const User = bookshelf.Model.extend({
  tableName: "users",
});

//GET of users list (non admin users)
router.get("/", async (req, res, next) => {
  let users = null;
  try {
    users = await User.where({
      is_admin: false
    }).fetchAll()
      .then(function (data) {
        return data.toJSON();
      });
  } catch (err) {
    err.message = "Error while retrieving users list:";
    return next(err);
  }

  let data = {
    title: "List of Users",
    isUserList: true,
    bodyClass: "user-list",
    users: users,
  };
  res.format({
    "text/html": function () {
      return res.render("user-list", data);
    },
  });
});

//For user add
router.get("/add", async (req, res) => {
  res.render("user-add", {
    title: "User Add",
    bodyClass: "user-add",
    isUserAdd: true
  });
});
router.post("/add", upload.single('photo'), async (req, res, next) => {
  let photoPath = null;
  let isAdmin = null;
  let hashPassword = null;

  if (req.body.isAdmin == 'false') {
    isAdmin = false;
    hashPassword = CryptoJS.SHA512('Welcome@kilowott').toString(CryptoJS.enc.Hex);
  }
  else{
    isAdmin = true;
    hashPassword = CryptoJS.SHA512(req.body.password).toString(CryptoJS.enc.Hex);
  }
  if (req.file) {
    photoPath = req.file.path;
  }
  try {
    new User({
      first_name: req.body.name,
      last_name: req.body.surname,
      email: req.body.username,
      address_home:req.body.addressHome,
      address_work:req.body.addressWork,
      profile_pic: photoPath,
      password: hashPassword,
      is_active: true,
      is_admin: isAdmin,
      is_delete: false,
      created_when: new Date(),
      modified_by: 0,
      modified_when: new Date()
    }).save(null, {
      method: "insert",
    }).then(function(model) {
      if (!isAdmin) {
        helper.sendEmail(req.body.username,req.body.name,req.body.surname);
        res.redirect("/users");
      }
      else{
        res.redirect("/login");
      }
    });
  } catch (err) {
    err.message = "Error while saving user:";
    return next(err);
  }
  
});

//GET of user edit
router.get("/edit/:id", async (req, res, next) => {
  let userId = req.params.id;
  let editUser = null;
  try {
    editUser = await User.where({
      id: userId,
    })
      .fetch()
      .then(function (model) {
        return model.toJSON();
      });

  } catch (err) {
    err.message = "Error while retrieving user edit:";
    return next(err);
  }
  res.render("user-edit", {
    title: "Edit User",
    isUserEdit: true,
    bodyClass: "user-edit",
    editUser: editUser,
  });
});

//POST of user edit
router.post("/edit/:id", function (req, res, next) {
  let userId = req.params.id;
  try {
    User.where({
      id: userId,
    })
      .save(
        {
          username: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.mobileNumber,
          modified_by: req.user.id,
          modified_when: new Date(),
        },
        {
          patch: true,
        }
      )
      .then(function (data) {
        res.redirect("/users");
      });
  } catch (err) {
    err.message = "Error while saving user:";
    return next(err);
  }
});

//GET of user delete
router.get('/delete/:id', async (req, res, next) => {
  let userId = req.params.id;
  let deleteUser = null;
  try {
    deleteUser = await User.where({
      id: userId,
    })
      .fetch()
      .then(function (model) {
        return model.toJSON();
      });

  } catch (err) {
    err.message = "Error while retrieving user delete";
    return next(err);
  }
  res.render("user-delete", {
    title: "Delete User",
    isUserEdit: true,
    bodyClass: "user-delete",
    deleteUser: deleteUser,
  });
});

//POST of user delete
router.post('/delete/:id', async (req, res, next) => {
  let userId = req.params.id;
  try {
    User.where({
      'id': userId
    }).save({
      is_delete: true,
      modified_when: new Date(),
      modified_by: req.user.id,
    }, {
      patch: true
    }).then(function (model) {
      res.redirect('/users');
    });
  } catch (err) {
    if (err.name === "Error") {
      return next(err);
    } else {
      err.message = "Error while saving deleted user";
      return next(err);
    }
  }
});

//POST of user enable/disable
router.post('/action/:activity/:id', async (req, res, next) => {
  console.log('inside route');
  let userId = req.params.id;
  try {
    User.where({
      'id': userId
    }).save({
      is_active: req.params.activity,
      modified_when: new Date(),
      modified_by: req.user.id,
    }, {
      patch: true
    }).then(function (model) {
      res.send({
				isSuccess: true
			});
    });
  } catch (err) {
    if (err.name === "Error") {
      return next(err);
    } else {
      err.message = "Error while saving user";
      return next(err);
    }
  }
});

// //change password
router.get("/change-password", async (req, res) => {
  res.render("change-password", {
    title: "Change Password",
    bodyClass: "change-password",
    isChangePassword: true
  });
});
//To save change password details
router.post("/change-password", async (req, res, next) => {
  let hashOldPassword = CryptoJS.SHA512(req.body.oldPassword).toString(CryptoJS.enc.Hex);
  try {
    if (hashOldPassword === req.user.password) {
      if (req.body.newPassword === req.body.confirmPassword) {
        let hashPassword = CryptoJS.SHA512(req.body.newPassword).toString(CryptoJS.enc.Hex);
        await User.where("email", req.user.email).save(
          {
            password: hashPassword,
          },
          {
            patch: true,
          }
        );
      }
    } else {
      console.log("err");
      throw Error("Old password is incorrect");
    }
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    if (err.name === "Error") {
      return next(err);
    } else {
      err.message = "Old password is not correct";
      return next(err);
    }
  }
});
module.exports = router;