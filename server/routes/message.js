const express = require("express");
const { sendMessage, getAllMessage } = require("../controllers/message");
const {isAuthenticated} = require("../middlewares/auth");
const router = express.Router();

router.route("/").post(isAuthenticated, sendMessage);
router.route("/:chatId").get(isAuthenticated, getAllMessage);


module.exports = router;