# AI Usage Disclosure

This document details how the **Consultation Recording Manager** project was developed using pair-programming with the AI Coding Assistant, **Antigravity**. It serves to explain the collaborative coding process, demonstrating modern software development workflows that utilize AI for efficiency and code quality.

---

## AI Assistant Role and Contributions

During this project's development, the AI assistant was utilized to handle scaffolding, design, routing structure, and backend integrations. Key areas of contribution include:

1. **System Architecture Design**:
   - Layout of a decoupled client-server structure suitable for a college internship assessment.
   - Design of Mongoose database schemas (`User` and `Recording` collections).

2. **Backend Code Generation**:
   - Formulating standard Express server endpoints under `/api/auth` and `/api/recordings`.
   - Implementing security mechanisms: password encryption utilizing `bcryptjs` hooks and JWT route protection.
   - Configuring the Multer storage engine to restrict local uploads to audio types (`audio/mpeg` and `audio/wav`).

3. **Frontend Component Creation**:
   - Structuring the React app using Context API (`AuthContext.jsx`) for authorization management, avoiding complex third-party state libraries like Redux.
   - Crafting responsive layouts using Ant Design elements (`Layout`, `Menu`, `Card`, `Table`, `Upload`, etc.).
   - Designing global themes and stylesheets using vanilla CSS variables for custom styling.

4. **Integration logic**:
   - Setting up local proxy rules in Vite configuration (`vite.config.js`) to route API calls directly to the Express server, avoiding complex CORS configurations.
   - Writing custom Axios client intercepts for token management.

---

## Developer-AI Interactive Design Decisions

Several critical details were aligned upon during the collaboration to keep the project clean, functional, and beginner-friendly:
- **Client-Side CSV Export**: Rather than requiring dedicated server-side library dependencies, a native, browser-based CSV generator was written utilizing `Blob` files.
- **Client-Side Search**: To avoid multiple asynchronous backend queries on typing, real-time filters were implemented inside the React table logic, matching text across multiple database fields instantly.
- **Dynamic File Removal**: Designed controllers to actively listen to updates and deletions to clean up unused physical audio files from `server/uploads/` immediately, maintaining clean local disk utilization.
