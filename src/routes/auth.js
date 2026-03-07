const express = require("express");
const authRouter = express.Router();
const { validateSignupData, validateLoginData } = require("../utils/helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //user validation
    const isValid = validateSignupData(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    if (isValid) {
      //hashing password
      const hashPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword, //store hashed password
      });
      await user.save();
      res.status(200).send("user saved successfully");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const isvalidlogin = validateLoginData(req.body);

    const { emailId, password } = req.body;

    if (isvalidlogin) {
      const user = await User.findOne({ emailId: emailId }); //find user
      if (!user) {
        throw new Error("Invalid credientials");
      }

      const isvalidPassword = await user.validatePassword(password); //user password in DB is same as entered password??

      if (!isvalidPassword) {
        throw new Error("Invalid crediential");
      } else {
        //creating a jwt token
        const token = await user.getJWT(); //we have simply used logic in schema methods instead here to make code more readable

        //sending cookie(jwt token)
        //we can also expire cookie, httpOnly mean cookie will be stored for http site only not https
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
          httpOnly: true,
        }); // cookie will be removed after 8 hours
        res.send("Login successfully");
      }
    }
  } catch (error) {
    res.send("ERORR:" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.send("logout successful");
});

module.exports = authRouter;
