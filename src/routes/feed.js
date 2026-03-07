const express = require("express");
const feedRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

feedRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const SAFE_DATA = ["firstName", "lastName", "emailId", "skills", "age"];
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); //select do select only necessary fields given

    const hideFromFeed = new Set(); //using set to store ids of users to hide from feed as it will be faster to check if a user is in set or not

    connections.forEach((connection) => {
      //set will automatically handle duplicates so we don't have to worry about that and it will only store unique ids of users to hide from feed, even ours id too
      hideFromFeed.add(connection.fromUserId.toString());
      hideFromFeed.add(connection.toUserId.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromFeed) } }, //using $nin (not in array) operator to find users whose ids are not in hideFromFeed set

        { _id: { $ne: loggedInUser._id } }, //also excluding logged in user from feed using $ne (not equal) operator
      ],
    }).select(SAFE_DATA); //selecting only safe data to send in feed

    res.send(feed);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch feed" });
  }
});

module.exports = feedRouter;
