# ChadGPT 

ChadGPT is an AI-powered chat application that supports **text generation, image generation, persistent chat history, and credit-based usage**.  
The platform integrates modern AI APIs and provides a clean workflow for users to generate responses and images while maintaining chat sessions.

---

# 🌐 Live Demo

**Deployed Application**

https://chad-gpt-taupe.vercel.app/

---

# ✨ Features

- AI text generation using Gemini API  
- AI image generation using ImageKit GenAI  
- Persistent chat history stored in MongoDB  
- Credit-based usage system  
- Stripe payment integration  
- Secure webhook handling using Svix  
- Real-time saving of user prompts and AI responses  
- Scalable backend architecture  

---

#  Tech Stack

## Frontend
- React
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## AI & Media Services
- Gemini API (text generation)
- ImageKit GenAI (image generation)

## Payments & Webhooks
- Stripe
- Svix

## Deployment
- Vercel

---

#  Development Challenges & Debugging Journey

During development, several real-world backend integration issues appeared.  
Resolving these problems helped improve the system architecture and strengthened debugging skills for production-level systems.

---

# ⏳ Development Timeline & API Evolution

Unlike many projects that are built in one focused development cycle, **ChadGPT was developed across multiple timelines**. Development was done intermittently due to other academic work and projects.

This approach revealed an important real-world engineering challenge: **rapid API evolution**.

Each time the project was revisited after a break, some parts of the application stopped working due to **updates in external APIs**.

These changes included:

- SDK updates
- Endpoint modifications
- Request/response format changes
- Model availability changes

This required updating dependencies, verifying API documentation, and refactoring integration code.

This experience highlighted the importance of:

- **API versioning**
- **Dependency management**
- **Backward compatibility**
- **Continuous software maintenance**

It reinforced the idea that modern applications must **continuously evolve with the services they depend on**.

---

# 🛠 Backend Debugging & Fixes

## Timestamp Handling Issue

### Problem

The controller was sending a `timestamp` field while the Mongoose schema expected `timestamps`.

### Solution

Aligned the schema and controller and simplified timestamp handling using Mongoose's built-in feature:

```js
{ timestamps: true }
```

This removed the need to manually manage timestamps.

---

# 🖼 Image Generation Feature — Development Journey

While implementing AI image generation using **ImageKit GenAI**, several integration issues occurred.

---

## 1️⃣ Chat Not Found Error

### Issue

The backend repeatedly returned:

```
Chat not found
```

### Cause

- Schema mismatch (`message` vs `messages`)
- Incorrect `chatId` handling
- Frontend sending incorrect `_id`

### Fix

- Standardized schema field names (`message`)
- Validated `chatId` format
- Ensured the frontend sends the correct `_id`

---

## 2️⃣ ImageKit 404 / Axios Errors

### Issue

Attempting to download generated images using `axios` caused **404 errors**.

### Cause

ImageKit GenAI URLs are **virtual URLs** and do not point to actual downloadable files.

### Fix

- Removed the download and re-upload workflow
- Used the **ImageKit GenAI URL directly** in chat messages (recommended workflow)

---

## 3️⃣ Schema Validation Errors

### Error Example

```
message.2.timestamps: Path 'timestamps' is required
```

### Cause

The schema expected `timestamps` but the controller sent `timestamp`.

### Fix

Updated all message objects to use:

```js
timestamps
```

This ensured MongoDB schema validation passed.

---

## 4️⃣ JavaScript Scope Error

### Error

```
Cannot access 'generatedImageUrl' before initialization
```

### Cause

`generatedImageUrl` was used before `encodedPrompt` was declared.

### Fix

Declared and initialized `encodedPrompt` before constructing the image URL.

---

# 💳 Payment Integration

The application implements a **credit-based system** for AI usage.

### Stripe

Stripe was used for payment processing because it provides:

- Well-documented APIs
- Easy developer integration
- Secure payment workflows

### Svix

Svix was used to manage **webhook events** securely for handling payment confirmations and updating user credits.

---

#  Final Solution Summary

Key improvements implemented:

- Standardized **Chat schema structure**
- Simplified timestamp handling using Mongoose
- Used **ImageKit GenAI URLs directly**
- Improved **error handling and validation**
- Fixed **variable initialization issues**
- Implemented **secure payment and webhook handling**

---

# Final Outcome

After resolving the issues:

- Gemini API responses generate correctly
- AI images are generated and stored in chat history
- Messages persist reliably in MongoDB
- Credit deduction works as expected
- The backend system is more stable and maintainable

This project significantly improved my understanding of:

- Debugging production-level backend systems
- Managing third-party API integrations
- Handling real-world software maintenance challenges

---

# 📚 Key Learnings

- AI APIs evolve faster than most traditional frameworks.
- Always verify **SDK versions, API compatibility, and model availability**.
- Effective debugging requires isolating layers:

```
API → Controller → Database
```

- Schema consistency is critical for stable backend systems.
- Real-world integration often requires **continuous monitoring and maintenance**.

---

# Future Improvements

- Streaming AI responses
- Chat session sharing
- Improved UI/UX
- Usage analytics dashboard
- Better caching and performance optimization

---

# Author

**Shashank**

Second-year Computer Science student building full-stack applications with modern AI integrations.
