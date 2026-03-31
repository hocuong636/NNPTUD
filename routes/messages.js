let express = require("express");
let router = express.Router();
let messageController = require("../controllers/messages");
let { CheckLogin } = require("../utils/authHandler");
let { uploadImage } = require("../utils/uploadHandler");
let mongoose = require("mongoose");

// GET "/" - lấy message cuối cùng của mỗi user mà user hiện tại nhắn tin
router.get("/", CheckLogin, async function (req, res, next) {
  try {
    let currentUserId = req.user._id;
    let messages = await messageController.GetLastMessagePerConversation(currentUserId);
    res.send(messages);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET "/:userID" - lấy toàn bộ message giữa user hiện tại và userID
router.get("/:userID", CheckLogin, async function (req, res, next) {
  try {
    let currentUserId = req.user._id;
    let otherUserId = req.params.userID;
    let messages = await messageController.GetMessagesBetweenUsers(currentUserId, otherUserId);
    res.send(messages);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// POST "/" - gửi message (có file hoặc text)
router.post("/", CheckLogin, uploadImage.single("file"), async function (req, res, next) {
  try {
    let from = req.user._id;
    let to = req.body.to;
    let type, text;

    if (req.file) {
      type = "file";
      text = req.file.path;
    } else {
      type = "text";
      text = req.body.text;
    }

    if (!to || !text) {
      return res.status(400).send({ message: "to và text là bắt buộc" });
    }

    let message = await messageController.CreateMessage(from, to, type, text);
    res.send(message);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
