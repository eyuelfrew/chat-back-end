import asynchHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModle.js";
import Message from "../models/messageModel.js";
const accessChat = asynchHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserID param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat.id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.send(error);
    }
  }
});
const fetchChats = asynchHandler(async (req, res) => {
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
    res.send(error.message);
  }
});
const createGroupChat = asynchHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fileds" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required tof orm a group chat!");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.send(error);
  }
});
const renameGroup = asynchHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updateChat) {
    res.status(404).send({ msg: "chat now found!" });
  } else {
    res.json(updateChat);
  }
});
const addToGroup = asynchHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404).send({ msg: "Chat Not Found" });
  } else {
    res.json(added);
  }
});
const removeFromGroup = asynchHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404).send({ msg: "Chat Not Found" });
  } else {
    res.json(removed);
  }
});
const DeletePersonalChat = asynchHandler(async (req, res) => {
  const chatID = req.params.chatId;
  try {
    await Chat.findByIdAndDelete(chatID);
    await Message.deleteMany({ chat: chatID });
    return res.json({ message: "Chat Deleted!", status: 1 });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  DeletePersonalChat,
};
