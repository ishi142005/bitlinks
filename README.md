# Bitlinks – Custom URL Shortener

Bitlinks is a modern URL shortener built with **Next.js**, **MongoDB**, and **Tailwind CSS**.  
Users can sign up, create custom short URLs, and manage their links securely.


---

## 🧠 Features

- 🔐 User authentication (Login & Signup)
- ✂️ Custom short URLs
- 🧾 User-specific link history
- ☁️ MongoDB for link storage
- 🎨 Tailwind CSS for modern UI
- 🌐 Ready for deployment (Vercel)

---

## 📦 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Database:** MongoDB Atlas
- **Styling:** Tailwind CSS
- **Auth & API:** JSON Web Tokens, SendGrid (optional)
- **Deployment:** Vercel

---


## Getting Started

Follow these instructions to get a copy of the project running on your local machine for development and testing.

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/ishi142005/bitlinks.git
cd bitlinks
```

### Step 2:  Install Dependencies

Open your terminal and run:
```
npm install
```

### Step 3:  Set Up Environment Variables

```
touch .env.local
```

### Step 4:  Get Your Credentials

Here’s how you can get each required credential:

#### MONGODB_URI:
Sign up on MongoDB Atlas, create a cluster, whitelist your IP address, and get your connection string.

#### JWT_SECRET:
Generate a strong random string (use online password generators or **openssl rand -base64 32**).

#### GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET:
Create OAuth credentials via Google Cloud Console for Google sign-in.



### Step 5: Run the Development Server
Start your app locally by running:
```bash:
npm run dev
```
Or if you use Yarn:
```bash:
yarn dev
```
Open your browser and visit:
```
http://localhost:3000
```