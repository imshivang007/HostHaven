const express = require("express");
const router = express.Router();
const messages = require("../controllers/messages");
const { isLoggedIn } = require("../middleware");

// Send a message (from listing page)
router.post("/messages/send", isLoggedIn, messages.sendMessage);

// Get inbox
router.get("/messages/inbox", isLoggedIn, messages.getInbox);

// Get sent messages
router.get("/messages/sent", isLoggedIn, messages.getSent);

// Read a message
router.get("/messages/:messageId", isLoggedIn, messages.readMessage);

// Delete a message
router.post("/messages/:messageId/delete", isLoggedIn, messages.deleteMessage);

// Reply to a message
router.post("/messages/:messageId/reply", isLoggedIn, messages.replyMessage);

module.exports = router;
