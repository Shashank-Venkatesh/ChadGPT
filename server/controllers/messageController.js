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


//Image Generation Message Controller

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prompt, chatId, isPublished } = req.body;

    if (!prompt || !chatId) {
      return res.json({
        success: false,
        message: "Prompt and chatId are required",
      });
    }
    
    
    // Atomic credit check + deduction
    const user = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: 2 } },
      { $inc: { credits: -2 } },
      { new: true }
    );
    
    if (!user) {
      return res.json({
        success: false,
        message: "You don't have enough credits",
      });
    }
    
    // Find chat
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }
    
    // Save user message
    chat.message.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
    });
    
    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt);
    
    // ImageKit AI generation URL
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/chadgpt/${Date.now()}.png?tr=w-800,h-800`;
    
    // Fetch generated image
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });
    
    // Convert to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data
    ).toString("base64")}`;
    
    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "chadgpt",
    });
    
    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamps: Date.now(),
      isImage: true,
      isPublished,
    };
    
    // Save assistant message
    chat.message.push(reply);
    await chat.save();
    
    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// console.log("User ID:", userId);
// console.log("Chat ID:", chatId);
// console.log("Chat ID type:", typeof chatId);
// console.log("upload fn:", typeof imagekit.upload);