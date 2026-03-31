let messageModel = require("../schemas/messages");

module.exports = {
  GetMessagesBetweenUsers: async function (currentUserId, otherUserId) {
    return await messageModel
      .find({
        $or: [
          { from: currentUserId, to: otherUserId },
          { from: otherUserId, to: currentUserId }
        ]
      })
      .populate("from", "-password")
      .populate("to", "-password")
      .sort({ createdAt: 1 });
  },

  CreateMessage: async function (from, to, type, text) {
    let newMessage = new messageModel({
      from: from,
      to: to,
      messageContent: {
        type: type,
        text: text
      }
    });
    await newMessage.save();
    return await messageModel
      .findById(newMessage._id)
      .populate("from", "-password")
      .populate("to", "-password");
  },

  GetLastMessagePerConversation: async function (currentUserId) {
    let messages = await messageModel
      .find({
        $or: [
          { from: currentUserId },
          { to: currentUserId }
        ]
      })
      .populate("from", "-password")
      .populate("to", "-password")
      .sort({ createdAt: -1 });

    let conversations = {};
    for (let msg of messages) {
      let ids = [msg.from._id.toString(), msg.to._id.toString()].sort();
      let key = ids[0] + "-" + ids[1];
      if (!conversations[key]) {
        conversations[key] = msg;
      }
    }

    return Object.values(conversations);
  }
};
