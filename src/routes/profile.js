const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { validateUpdate } = require("../utils/helper");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //we get user from req attached in middleware
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    if (!validateUpdate(req.body)) {
      throw new Error("update not allowed");
    } else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (field) => (loggedInUser[field] = req.body[field]),
      );

      await loggedInUser.save();
    }

    //await User.findByIdAndUpdate("68321c6d9f49640a83f33e96",{lastName:"Don"})

    // await User.findOneAndUpdate({lastName:"Boss"},{lastName:"Don"})
    res.send("updated successfully");
  } catch (error) {
    res.send("update not successful" + error.message);
  }
});

profileRouter.delete("/deleteUser", async (req, res) => {
  try {
    //  await User.deleteOne({emailId:"khan@gmail.com"}) //Deletes the first document that matches conditions from the collection

    await User.findByIdAndDelete("6832112d3b3ab1cf41d4f306");
    res.send("user deleted successfully");
  } catch (error) {
    res.send("user not deleted succesfully");
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, newPassword, confirmPassword } = req.body;

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new Error("old password is incorrect");
    } else if (password === newPassword) {
      throw new Error("new password cannot be same as old password");
    } else {
      if (newPassword !== confirmPassword) {
        throw new Error("new password and confirm password do not match");
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.send("password changed successfully");
    }
  } catch (error) {
    res.send("password change failed: " + error.message);
  }
});

module.exports = profileRouter;
