const express = require("express");
const { registerUser, loginUser, logoutUser, getAllUser } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/").get(isAuthenticated, getAllUser);

module.exports = router;