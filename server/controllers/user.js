const User = require("../models/user");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !password || !email) {
      return res.status(400).send("Please fill all the fields");
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("Email already exists");
    }
    user = await User.create({
      name,
      email,
      password,
      pic,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(403).send("Email doesn't exists");
    }
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(403).send("Password doesn't match. Please try again!!");
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(201).cookie("token", token, options).send({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const keyword = req.query.search ? {
      $or: [{
        name: {
          $regex: req.query.search, $options: "i"
        }
      },
      {
        email: {
          $regex: req.query.search, $options: "i",
        }
      }
    ]
    } : {};
    const user = await User.find(keyword).find({_id: { $ne: req.user._id } });
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
