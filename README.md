### 2. Backend Repository ke liye `README.md`

Is file ko apne **Backend** folder ke root me `README.md` naam se save karein.

<div align="center">
  <h1>🍔 Craver - Backend API </h1>
  <p><strong>The robust RESTful API and server architecture powering Craver.</strong></p>

<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" /></a>
<a href="https://expressjs.com/"><img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" /></a>
<a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>

</div>

<br />

## 📖 About The Backend

This repository contains the backend server for **Craver**, a social food delivery platform. Built with Node.js and Express, it handles complex relational data between Users, Food Partners, and Food Reels. It manages secure authentication, file uploads, social interactions (likes, saves, comments), and seamless data retrieval for the frontend.

## ✨ Key Features

- **Dual Authentication System:** Secure, JWT-based authentication with HTTP-only cookies. Separate models and middlewares for **Users** and **Food Partners**.
- **Video & Image Uploads:** Integrated `Multer` for parsing `multipart/form-data` and handling high-quality video (reels) and profile picture uploads to cloud storage.
- **Social Data Logic:** Efficient controllers for toggling likes, handling nested comments, saving posts, and tracking user followings.
- **Public & Protected Endpoints:** Designed public routes for shared reel previews and heavily guarded private routes for interactions and account management.
- **Optimized Queries:** Uses Mongoose population and aggregation to fetch complete reel data (partner info, comment counts) in minimal requests.

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database & ODM:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt (Password Hashing)
- **File Handling:** Multer, Cloud Storage integration
- **Security & Utility:** CORS, Cookie Parser, dotenv

## 🚀 Run Locally

1. **Clone the repo**
   ```sh
   git clone [https://github.com/dev-aditya99/craver-backend.git](https://github.com/dev-aditya99/craver-backend.git)
   cd craver-backend
   ```

```

```
