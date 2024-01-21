import asynchHandler from "express-async-handler";
import User from "../models/userModle.js";
import generateToken from "../config/generateToken.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
const sendMessage = asynchHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invaid Data Passed into request!");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    console.log(error);
  }
});
const allMessages = asynchHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic email"
    );
    res.json(messages);
  } catch (error) {
    console.log(error.message);
  }
});
export { sendMessage, allMessages };
