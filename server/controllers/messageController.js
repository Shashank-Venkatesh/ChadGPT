import genai from "../configs/gemini.js"
import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import imagekit from "../configs/imagekit.js"

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    if (req.user.credits < 1) {
      return res.json({ success: false, message: "You don't have enough credits" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      userId: userId.toString()
    });

    if (!chat || !Array.isArray(chat.message)) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // save user message
    chat.message.push({
    role: "user",
    content: prompt,
    timestamps: Date.now(),
    isImage: false
    });


    // 🔥 GEMINI CALL
    const model = genai.getGenerativeModel({
        model: "gemini-3-flash-preview"
    });

    const result = await model.generateContent(prompt);
    const replyText = result.response.text();

    const reply = {
        role: "assistant",
        content: replyText,
        timestamps: Date.now(),
        isImage: false
    };


    chat.message.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    res.json({ success: true, reply });

  } catch (error) {
    console.error("Gemini error:", error);
    res.json({ success: false, message: error.message });
  }
};



export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check user credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits"
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    // Find chat and validate
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat || !Array.isArray(chat.message)) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // Save user message first
    chat.message.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
      isPublished: false
    });

    // Encode prompt for ImageKit
    const encodedPrompt = encodeURIComponent(prompt);

    // Generate ImageKit GenAI URL
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/generated.png?tr=genai-prompt:${encodedPrompt},w-800,h-800`;

    // Save assistant message
    const reply = {
      role: "assistant",
      content: generatedImageUrl,
      timestamps: Date.now(),
      isImage: true,
      isPublished
    };

    chat.message.push(reply);

    // Save chat
    await chat.save();

    // Deduct credits
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    // Respond
    return res.json({ success: true, reply });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};


// console.log("User ID:", userId);
// console.log("Chat ID:", chatId);
// console.log("Chat ID type:", typeof chatId);