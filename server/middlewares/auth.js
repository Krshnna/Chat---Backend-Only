const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).send("Login Required");
      }
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.__id);
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};
