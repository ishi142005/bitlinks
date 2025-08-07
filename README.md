# Bitlinks — A Full-Stack URL Shortening Service

Bitlinks is a modern, full-stack URL shortener built with Next.js, Node.js, and MongoDB. It provides a secure, user-centric platform for creating, managing, and tracking custom short links. This project demonstrates a comprehensive understanding of modern web development practices, including secure authentication, API design, and database management.

**[[Link to Live Demo](https://bitlinks-bice.vercel.app/)]** - **[[Link to GitHub Repo](https://github.com/ishi142005/bitlinks)]**

---

## ✨ Key Features

-   **Secure User Authentication:** Implements a robust JWT-based authentication system with salted password hashing (bcrypt) to ensure user data is protected.
-   **Custom Short URL Creation:** Allows users to create personalized, human-readable short links instead of random strings.
-   **User Dashboard:** Provides each user with a private dashboard to view, manage, and delete their own links.
-   **High-Performance Redirection:** Utilizes Next.js server-side logic and MongoDB indexing for near-instantaneous redirection from short links to their original destination.

---

## 🛠️ Tech Stack & Architecture

-   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
-   **Backend:** Node.js, Next.js API Routes
-   **Database:** MongoDB for data modeling and validation.
-   **Authentication:** JSON Web Tokens (JWT), bcrypt
-   **Deployment:** Vercel (with automated CI/CD pipeline)

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/ishi142005/bitlinks.git
cd bitlinks

 ```

## Install Dependencies
```bash
npm install
```

## Set Up Environment Variables
Create a .env.local file in the root of your project directory. You can do this by copying the example file:
```bash
cp .env.example .env.local
```

- **MONGODB_URI**: Your connection string from MongoDB Atlas.
Now, open .env.local and add the following required credentials:
- **JWT_SECRET**: A strong, secret key for signing tokens. You can generate one using openssl rand -base64 32 in your terminal.
- **GOOGLE_CLIENT_ID**: Your Google OAuth Client ID from the Google Cloud Console.
- **GOOGLE_CLIENT_SECRET**: Your Google OAuth Client Secret.

## Run the Development Server
```bash
npm run dev
```
The application should now be running at http://localhost:3000.

