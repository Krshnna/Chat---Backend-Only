const User = require("../models/user");
const Chat = require("../models/chat");

exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send("UserId invalid");
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: { $elemMatch: { $eq: req.user._id } },
        },
        {
          users: { $elemMatch: { $eq: userId } },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.status(201).send(isChat[0]);
    } else {
      let UserChat = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createChat = await Chat.create(UserChat);
        const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
          "users",
          "-password"
        );
        return res.status(201).send(FullChat);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchUserChat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.CreateGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(500).send("Please fill all the details");
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("Expected users are atleast three");
  }

  users.push(req.user);

  try {
    const grpChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    grpChat.groupAdmin.isAdmin = true;

    const needChat = await Chat.findOne({ _id: grpChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).send(needChat);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const newChatName = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!newChatName) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(newChatName);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addToGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updateChat) {
      return res.status(500).send("Chat Not Found");
    }
    res.send(updateChat);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    const removeChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removeChat) {
      return res.status(500).send("Chat Not Found");
    }
    res.send(removeChat);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
