const Message = require("../models/message");
const Listing = require("../models/listing");
const User = require("../models/user");

// Send a message to a host
module.exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, listingId, subject, body } = req.body;

        // Validate input
        if (!recipientId || !subject || !body) {
            req.flash("error", "Please fill in all required fields!");
            return res.redirect(`/listings/${listingId}`);
        }

        // Don't allow messaging yourself
        if (recipientId === req.user._id.toString()) {
            req.flash("error", "You cannot send a message to yourself!");
            return res.redirect(`/listings/${listingId}`);
        }

        const message = new Message({
            sender: req.user._id,
            recipient: recipientId,
            listing: listingId,
            subject,
            body
        });

        await message.save();

        req.flash("success", "Message sent successfully!");
        res.redirect(`/listings/${listingId}`);
    } catch (error) {
        console.error("Error sending message:", error);
        req.flash("error", "Failed to send message!");
        return res.redirect(`/listings/${req.body.listingId}`);
    }
};

// Get user's inbox
module.exports.getInbox = async (req, res) => {
    try {
        const messages = await Message.find({ recipient: req.user._id })
            .populate("sender", "username profileImage")
            .populate("listing", "title image")
            .sort({ createdAt: -1 });

        // Count unread messages
        const unreadCount = messages.filter(m => !m.isRead).length;

        res.render("messages/inbox.ejs", { messages, unreadCount });
    } catch (error) {
        console.error("Error fetching inbox:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Get user's sent messages
module.exports.getSent = async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.user._id })
            .populate("recipient", "username profileImage")
            .populate("listing", "title image")
            .sort({ createdAt: -1 });

        res.render("messages/sent.ejs", { messages });
    } catch (error) {
        console.error("Error fetching sent messages:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings");
    }
};

// Read a message
module.exports.readMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId)
            .populate("sender", "username email profileImage")
            .populate("recipient", "username email profileImage")
            .populate("listing", "title image location");

        if (!message) {
            req.flash("error", "Message not found!");
            return res.redirect("/messages/inbox");
        }

        // Check if user is sender or recipient
        const isSender = message.sender._id.equals(req.user._id);
        const isRecipient = message.recipient._id.equals(req.user._id);

        if (!isSender && !isRecipient) {
            req.flash("error", "You don't have permission to view this message!");
            return res.redirect("/messages/inbox");
        }

        // Mark as read if recipient
        if (isRecipient && !message.isRead) {
            message.isRead = true;
            await message.save();
        }

        res.render("messages/show.ejs", { message, isSender });
    } catch (error) {
        console.error("Error reading message:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/messages/inbox");
    }
};

// Delete a message
module.exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            req.flash("error", "Message not found!");
            return res.redirect("/messages/inbox");
        }

        // Check if user is sender or recipient
        const isSender = message.sender.equals(req.user._id);
        const isRecipient = message.recipient.equals(req.user._id);

        if (!isSender && !isRecipient) {
            req.flash("error", "You don't have permission to delete this message!");
            return res.redirect("/messages/inbox");
        }

        await Message.findByIdAndDelete(req.params.messageId);

        req.flash("success", "Message deleted!");
        res.redirect("/messages/inbox");
    } catch (error) {
        console.error("Error deleting message:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/messages/inbox");
    }
};

// Reply to a message
module.exports.replyMessage = async (req, res) => {
    try {
        const originalMessage = await Message.findById(req.params.messageId);

        if (!originalMessage) {
            req.flash("error", "Message not found!");
            return res.redirect("/messages/inbox");
        }

        // Only recipient can reply
        if (!originalMessage.recipient.equals(req.user._id)) {
            req.flash("error", "You can only reply to messages you received!");
            return res.redirect("/messages/inbox");
        }

        const { subject, body } = req.body;

        const reply = new Message({
            sender: req.user._id,
            recipient: originalMessage.sender,
            listing: originalMessage.listing,
            subject: `Re: ${subject}`,
            body
        });

        await reply.save();

        req.flash("success", "Reply sent!");
        res.redirect(`/messages/${reply._id}`);
    } catch (error) {
        console.error("Error replying to message:", error);
        req.flash("error", "Failed to send reply!");
        return res.redirect("/messages/inbox");
    }
};

// Get unread message count (for navbar badge)
module.exports.getUnreadCount = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ unreadCount: 0 });
        }
        
        const unreadCount = await Message.countDocuments({
            recipient: req.user._id,
            isRead: false
        });
        
        res.json({ unreadCount });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.json({ unreadCount: 0 });
    }
};
