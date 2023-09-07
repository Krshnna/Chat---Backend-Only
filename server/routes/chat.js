const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { accessChat, fetchUserChat, CreateGroupChat, renameGroup, addToGroup, removeUser } = require("../controllers/chat");
const router = express.Router();

router.route("/").post(isAuthenticated, accessChat).get(isAuthenticated, fetchUserChat);
router.route("/groupChat").post(isAuthenticated, CreateGroupChat);
router.route("/renameChat").put(isAuthenticated, renameGroup);
router.route("/addUser").put(isAuthenticated, addToGroup);
router.route("/removeUser").delete(isAuthenticated, removeUser);

module.exports = router;