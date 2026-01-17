# ChadGPT


Things used:

Frontend new Learning:
    Moment
    react-markdown
    prismjs
    reset-tw
    timeout
    useLocation

Library prebuild ui

new package for backend 

open ai for text based output frm ai
imagekit.io for image based out frm ai
encodeURIComponent

⚙️ Gemini API Integration – Challenges & Learnings

While integrating the Gemini API into this project, I faced several non-obvious challenges that significantly deepened my understanding of modern AI SDKs, API versioning, and backend debugging.

🚧 Key Challenges Faced

Outdated Tutorials & API Drift
I initially followed a YouTube tutorial that used an OpenAI-compatible Gemini endpoint. Although the code worked in the video, it failed in my setup due to:

Deprecated OpenAI-style endpoints

Breaking changes in the latest SDKs

Removed or renamed Gemini models

This highlighted how fast AI APIs evolve and how quickly tutorials can become outdated.

Model Availability & Version Confusion
Gemini models such as gemini-pro and gemini-1.5-flash returned 404 Model Not Found errors even though they appeared valid in documentation.
The root cause was:

API version mismatch (v1beta)

Limited model availability per API key / region

The issue was resolved by identifying and using a universally supported model:
gemini-1.0-pro.

Half-Migrated SDK Usage
During the transition from OpenAI to Gemini, I initially imported the Gemini SDK but still had leftover OpenAI logic in the controller.
This resulted in silent failures and misleading errors, reinforcing the importance of fully removing legacy code during migrations.

Mongoose Schema Validation Errors
Even after the API integration worked, message saving failed due to a schema mismatch:

The schema required a timestamps field

The controller was sending timestamp instead

This was fixed by aligning the schema and controller and simplifying timestamp handling using Mongoose’s built-in { timestamps: true }.

🧠 What I Learned

AI APIs change faster than most frontend or backend frameworks

Always verify SDK versions, model availability, and API compatibility

Debugging is often about isolating layers (API → controller → database)

Schema consistency is just as important as API correctness

Real-world integration is rarely “plug and play” — persistence matters

✅ Outcome

After resolving these issues:

Gemini API responses are generated correctly

Messages are stored reliably in MongoDB

Credit deduction logic works as expected

The system is now more stable and future-proof

This process, although challenging, significantly improved my confidence in debugging production-level backend issues.




Image Generation Feature — Development Journey

Challenge:
While implementing AI image generation using ImageKit.io GenAI
, I faced multiple issues:

Chat Not Found Error:

Initially, the backend kept returning "Chat not found".

Cause: a mismatch between the Chat schema and the frontend data (message vs messages) and incorrect handling of chatId.

Fix: Aligned schema field names (message) with the database, validated chatId format, and ensured the frontend sends the correct _id.

ImageKit 404 / Axios Failures:

Attempted to download generated images via axios and re-upload them.

Cause: ImageKit GenAI URLs are virtual and do not point to actual files. Downloading them caused 404 errors.

Fix: Removed downloading and re-upload logic, and used the GenAI URL directly in the chat messages, which is the official ImageKit workflow.

Schema Validation Errors:

Backend threw errors like "message.2.timestamps: Path 'timestamps' is required".

Cause: The schema expected timestamps but I was using timestamp.

Fix: Updated all message objects to use timestamps consistently, ensuring MongoDB schema validation passes.

JavaScript Scope Errors:

Error: "Cannot access 'generatedImageUrl' before initialization"

Cause: generatedImageUrl was used before declaring encodedPrompt.

Fix: Declared and initialized encodedPrompt before using it to build the URL.

Solution Summary:

Standardized the Chat schema (message array, timestamps field).

Used ImageKit GenAI URLs directly without downloading.

Ensured proper order of variable declarations in the controller.

Added validation and error handling to prevent future failures.

✅ Result: The AI image generation feature now works end-to-end, saving the user prompt and assistant-generated image URL in the chat, while deducting user credits correctly.