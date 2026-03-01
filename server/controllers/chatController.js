import Chat from '../models/Chat.js'

// API controller for creating a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        };

        const chat = await Chat.create(chatData);
        res.json({ success: true, message: "Chat created", chat });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API controller for getting all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

        res.json({ success: true, chats });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API controller for deleting a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;

        await Chat.deleteOne({ _id: chatId, userId });

        res.json({ success: true, message: "Chat deleted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API controller for renaming a chat
export const renameChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, name } = req.body;

        if (!name || !name.trim()) {
            return res.json({ success: false, message: "Name is required" });
        }

        const chat = await Chat.findOneAndUpdate(
            { _id: chatId, userId },
            { name: name.trim() },
            { new: true }
        );

        if (!chat) {
            return res.json({ success: false, message: "Chat not found" });
        }

        res.json({ success: true, message: "Chat renamed", chat });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API controller for bulk deleting chats
export const bulkDeleteChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatIds } = req.body;

        if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
            return res.json({ success: false, message: "No chats selected" });
        }

        const result = await Chat.deleteMany({ _id: { $in: chatIds }, userId });

        res.json({ success: true, message: `${result.deletedCount} chat(s) deleted` });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
