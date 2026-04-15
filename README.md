# 🧠 BrainFizz - Full-Stack AI Blog Application

BrainFizz is a modern, responsive, full-stack blogging platform built with the MERN stack. It features secure user authentication, complete CRUD capabilities for articles, and a unique integration with Google's Gemini AI to automatically generate professional blog content.

🚀 **[View Live Demo Here](https://blog-app-one-mu-75.vercel.app)** ---

## ✨ Key Features

* **AI Content Generation:** Integrated with the Google Gemini API to instantly generate blog drafts based on user-provided titles and categories.
* **Secure Authentication:** Robust user login and registration system using JSON Web Tokens (JWT) and bcrypt password hashing. Handles secure, cross-domain cookies for modern cloud deployment.
* **Role-Based Access Control (RBAC):** Distinct permissions for standard users and administrators.
* **Complete CRUD Operations:** Users can seamlessly create, read, update, and delete their own blog posts.
* **Image Uploads:** Supports profile and blog cover image uploads.
* **Responsive UI:** Fully responsive and modern user interface styled with Tailwind CSS.

---

## 🛠️ Technology Stack

**Frontend:**
* React (Vite)
* Tailwind CSS
* Axios (for API requests)
* React Router DOM

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens (JWT) & Cookie Parser (Auth)
* Google Generative AI SDK (Gemini)
* Bcrypt.js (Password Encryption)

**Deployment:**
* Frontend hosted on **Vercel**
* Backend hosted on **Render**
* Database hosted on **MongoDB Atlas**

---

## 💻 Local Setup & Installation

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/ManjunathS2/brainfizz-app.git](https://github.com/ManjunathS2/brainfizz-app.git)
cd brainfizz-app
```
### 2. Setup the Backend
Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```
Create a .env file in the backend folder and add the following variables:
```
PORT=4001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_secret_jwt_key
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

# Cloudinary Variables 

```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_SECRET_KEY=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

3. Setup the Frontend

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```
Start the React development server:

```bash
npm run dev
```
