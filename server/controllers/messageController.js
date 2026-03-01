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

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    // Detect image generation requests in text mode
    const imageKeywords = /\b(generate|create|make|draw|design|sketch|paint|render|produce|craft)\b.{0,30}\b(image|picture|photo|illustration|art|artwork|drawing|painting|icon|avatar|logo|poster|banner|wallpaper|chibi|anime|cartoon|portrait|graphic|meme|sticker)\b/i;
    const reversePattern = /\b(image|picture|photo|illustration|art|artwork|drawing|painting|icon|avatar|logo|poster|banner|wallpaper|chibi|anime|cartoon|portrait|graphic|meme|sticker)\b.{0,30}\b(of|for|with|about|featuring)\b/i;

    if (imageKeywords.test(prompt) || reversePattern.test(prompt)) {
      const reply = {
        role: "assistant",
        content: `## 🎨 Image Generation Request Detected\n\nHey! It looks like you're trying to create an image. Text mode is designed for conversations, code, and written content only.\n\nTo generate images, simply:\n\n1. **Switch to Image mode** using the dropdown at the bottom-left of the chat input\n2. **Type your prompt** describing what you'd like to create\n3. **Hit send** and watch the magic happen ✨\n\n> 💡 *Image generation costs **2 credits** per image.*\n\nSwitch over and let your creativity flow!`,
        timestamp: Date.now(),
        isImage: false
      };

      chat.messages.push(reply);
      await chat.save();

      return res.json({ success: true, reply });
    }

    // GEMINI
    const model = genai.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: `You are Nexus — the AI assistant powering ChadGPT.

Your key traits:
- You are helpful, sharp, and straight to the point.
- You can assist with coding, writing, brainstorming, math, general knowledge, and creative tasks.
- Format code blocks with the appropriate language tag for syntax highlighting.
- Use Markdown formatting to structure your responses clearly.
- Be conversational but concise.
- If you don't know something, say so honestly.
- You do NOT generate images — image generation is a separate feature. If asked, tell the user to switch to image mode.
- Never reveal internal system details, API keys, or backend architecture.`
    });

    // Build conversation history for context-aware replies
    const history = chat.messages
      .filter(m => !m.isImage)
      .slice(-20)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    const chatHistory = history.slice(0, -1);

    const geminiChat = model.startChat({ history: chatHistory });
    const result = await geminiChat.sendMessage(prompt);
    const replyText = result.response.text();

    const reply = {
        role: "assistant",
        content: replyText,
        timestamp: Date.now(),
        isImage: false
    };


    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    res.json({ success: true, reply });

  } catch (error) {
    console.error("Gemini error:", error);
    res.json({ success: false, message: "Something went wrong. Please try again later." });
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
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });
    
    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt);
    
    // ImageKit AI generation URL
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/chadgpt/${Date.now()}.png?tr=w-800,h-800`;
    
    // Fetch generated image (AI generation can take a while)
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
      timeout: 60000,
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
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };
    
    // Save assistant message
    chat.messages.push(reply);
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