const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie; //extract token from cookies

    if (!token) {
      res.send("session expired, please login");
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //verify token with secret key, this gove is decoded data
      console.log(decoded);

      const { id } = decoded; //extracting id back which we have signed

      const user = await User.findById(id);
      if (!user) {
        throw new Error("User doesn't exists");
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    res.send("ERROR:" + error.message);
  }
};

module.exports = { userAuth };
