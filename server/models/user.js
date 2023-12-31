const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide the email"],
    },
    password: {
      type: String,
      required: [true, "Please provide the password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = async function () {
  return jwt.sign({ __id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
