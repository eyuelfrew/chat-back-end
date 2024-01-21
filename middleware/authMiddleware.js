import jwt from "jsonwebtoken";
import User from "../models/userModle.js";
import asynchHandler from "express-async-handler";

const protect = asynchHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).send({ msg: "Not autorized!, token faild!" });
    }
  }
  if (!token) {
    res.status(401).send("Not autorized, no token! probalby");
  }
});
export default protect;
