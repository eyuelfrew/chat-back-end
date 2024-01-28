import asynchHandler from "express-async-handler";
import User from "../models/userModle.js";
import generateToken from "../config/generateToken.js";
import CryptoJS from "crypto-js";
// import { v2 as cloudinary } from "cloudinary";
// cloudinary.config({
//   cloud_name: "de4f00fc1",
//   api_key: "479671358929352",
//   api_secret: "P94XQ3vO-5-M9fjUDDaQnfOCdEM",
// });
const registerUser = asynchHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({ msg: "Please Fill All Fields!" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(409)
      .send({ msg: "User Email Already Exists!", status: 409 });
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.send({ status: 201, msg: "user registered" });
    // res.status(201).json({
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   password: user.password,
    //   // pic: user.pic,
    //   token: generateToken(user._id, user.email),
    // });
  } else {
    res.status(400).send({ msg: "Request Faild!" });
  }
});

//*user login controller

const authUser = asynchHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).send({ msg: "User not found!", status: 404 });
  }
  if (userExist && (await userExist.matchPassword(password))) {
    return res.status(200).send({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      password: userExist.password,
      pic: userExist.pic,
      token: generateToken(userExist._id, userExist.email),
    });
    // res.status(201).json({
    // _id: userExist._id,
    // name: userExist.name,
    // email: userExist.email,
    // password: userExist.password,
    // pic: user.pic,
    // token: generateToken(userExist._id, userExist.email),
    // });
  }
  res.status(401).send({ msg: "Login Failed!", status: 401 });
});

// get users
const allUsers = asynchHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//verfifiy email
const verifiyEmail = asynchHandler(async (req, res) => {
  try {
    const emailToken = req.body.emailToken;
    if (!emailToken) return res.status(404).json("Email Token Not Found!");
    const user = await User.findOne({ emailToken });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(userExist._id, userExist.email),
        isVerified: user?.isVerified,
      });
    } else res.status(404).json("Email Verification Faild. invalid token!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

export { registerUser, authUser, allUsers, verifiyEmail };

//  if (req.file) {
//    try {
//      const cloudinaryResponse = cloudinary.uploader
//        .upload(req.file.path, {
//          folder: "chat_app",
//          resource_type: "image",
//        })
//        .then((result) => {
//          const ulr = result.secure_url;
//          res.status(200).json({ success: true, ulr });
//        });
//    } catch (error) {
//      console.error("Error uploading image to Cloudinary:", error);
//      res.status(500).json({ success: false, error: "Internal Server Error" });
//    }
//  } else {
//    console.log("there is no file");
//  }
