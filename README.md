# Consultation Recording Manager

A modern, clean, and functional web application for managing consultation recording files. Built with React (Vite + Ant Design) on the frontend and Node.js (Express + MongoDB) on the backend, this project is designed for simplicity, ease of understanding, and features a premium modern UI suitable for a Tech Intern assessment.

## Project Features

1. **Authentication System**:
   - Secure account registration (`POST /api/auth/register`)
   - Secure login validation (`POST /api/auth/login`) using JWT
   - Secure user profile check (`GET /api/auth/profile`)
   - Protected client-side routing & Axios authorization headers injection
   - **Profile Page**: Displays authenticated user details (Name, Email, Access role, Joined date)

2. **Interactive Dashboard**:
   - Summary statistics cards:
     - **Total Recordings**
     - **Pending Recordings**
     - **Reviewed Recordings**
     - **Completed Recordings**
   - **Recent Recordings Table**: Displays the latest 5 session records with quick play/view shortcuts

3. **Recording Management (CRUD)**:
   - Create record (Client Name, Consultant Name, Session Title, Date, Duration, Notes, Status, MP3/WAV Upload)
   - View detailed session metadata, extensive notes, and play audio directly
   - Edit metadata fields and optionally upload a replacement audio file
   - Delete recording (wipes data from database and deletes physical file from storage disk)

4. **Audio File Processing**:
   - Local audio storage on the server using **Multer**
   - Validates file type (allows only `MP3` and `WAV` formats)
   - Serves uploaded audio files statically through proxying

5. **Advanced Recording List**:
   - **Search**: Instant, real-time client-side search by Client Name, Consultant Name, or Session Title
   - **Status Filter**: Dropdown selection (All, Pending, Reviewed, Completed) to filter the sessions list
   - **CSV Export**: Instantly exports the currently filtered recording list to a downloadable CSV spreadsheet
   - **Actions**: Direct buttons for Edit, Delete, and View details of each record

---

## Tech Stack

- **Frontend**: React (Vite), Ant Design, Axios, React Router DOM, React Context API (No Redux)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), Multer (Local File Uploads), JSON Web Tokens (JWT), bcryptjs (Password Hashing)
- **Styling**: Vanilla CSS, Ant Design CSS-in-JS Tokens

---

## Folder Structure

```text
consultation-recording-manager/
├── client/                 # React Frontend
│   ├── public/             # Static Assets
│   ├── src/
│   │   ├── components/     # Reusable components (ProtectedRoute, etc.)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── layouts/        # Layout wrappers (MainLayout with Sidebar)
│   │   ├── pages/          # View Pages (Dashboard, Login, Register, Profile, Lists, Forms, Details)
│   │   ├── services/       # Axios API client, token managers
│   │   ├── App.css         # Custom Page CSS
│   │   ├── App.jsx         # Routes definition
│   │   ├── index.css       # Global design variables & reset
│   │   └── main.jsx        # Mounting point
│   ├── index.html          # SPA HTML Template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Dev server & local API proxying configuration
│
├── server/                 # Express Backend
│   ├── config/             # Database connection setups
│   │   └── db.js           # MongoDB connection handler
│   ├── controllers/        # Route Handlers (Auth, Recordings)
│   ├── middleware/         # Custom Middlewares (JWT check, Multer Upload filter)
│   ├── models/             # Mongoose Schemas (User, Recording)
│   ├── routes/             # API Router definitions
│   ├── uploads/            # Server directory holding local audio uploads
│   ├── .env                # App configuration (secret keys, ports, DB URIs)
│   ├── package.json        # Backend dependencies
│   └── server.js           # Server runner
│
├── README.md               # User manual
└── AI_USAGE.md             # AI assistance disclosure
```

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed:
1. **Node.js** (v16.x or newer)
2. **NPM** (v8.x or newer)
3. **MongoDB Community Server** (running locally on port 27017)

### 1. Database Setup
Ensure that the local MongoDB instance is active.
- **On Windows**: Open Command Prompt/PowerShell as administrator and run `net start MongoDB` or verify the MongoDB Server service is running in `services.msc`.

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Examine/modify the `.env` file configuration (pre-created with defaults):
   ```ini
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/consultation_recording_manager
   JWT_SECRET=super_secret_jwt_token_for_consultation_manager_app_123456
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will start running on **`http://localhost:5000`** and log:
   `Server running on port 5000` -> `MongoDB Connected: localhost`

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will boot up on **`http://localhost:3000`**. Open this URL in your web browser.

---

## Running the Application / Test Flow

1. **User Registration**:
   - Open `http://localhost:3000` in the browser. You will be automatically redirected to `/login`.
   - Click the "Register here" link, fill in your details (e.g., Name: `Tech Intern`, Email: `intern@example.com`, Password: `password123`), and click **Sign Up**.
   - Upon successful signup, you will be logged in and redirected to the **Dashboard**.

2. **Create a Recording**:
   - Click **Add Recording** in the sidebar.
   - Enter consultation metadata:
     - Client Name: `Acme Corp`
     - Consultant Name: `Dr. Emily Jones`
     - Title: `Strategy Alignment Session`
     - Consultation Date: Select today's date
     - Duration: `45` minutes
     - Notes: Add brief bullet points discussed.
     - Upload an audio file: Select a sample `.mp3` or `.wav` file (ensure file is below 50MB).
   - Click **Save Session**.

3. **Dashboard Monitoring**:
   - Verify that the statistical counts for "Total Recordings" and "Pending Recordings" increase.
   - Observe the new entry appear in the "Recent Recordings" table.

4. **Verify Playback & Recording Details**:
   - Click the title of the recording in the table, or click the **View** button.
   - You will see the recording information. Click the play button on the embedded **Audio Player** to test playback.

5. **Modify Status / Editing**:
   - Click **Edit Recording** on the details page or list page.
   - Change the status dropdown from `Pending` to `Reviewed` or `Completed`.
   - Click **Update Session** and verify dashboard metrics update.

6. **User Profile**:
   - Click on the User details block in the Header. You will be redirected to the **Profile** page.
   - Verify the profile details display your registration name, email, role, and joined date.

7. **Export Data to CSV**:
   - Go to **Recordings** page.
   - Use the search bar to search for `Acme`.
   - Click **Export to CSV**. Verify that a `.csv` file downloads containing the filtered row.

8. **Delete Recording**:
   - Click **Delete** on a recording and confirm.
   - Check the `server/uploads/` folder on your machine. You will see that the physical audio file has been deleted from disk.
