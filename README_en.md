<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/logo.png?raw=true" alt="drawing" width="500"/> </p>

# Zero Movie - Next.js Project [![My Skills](https://skillicons.dev/icons?i=nextjs)](https://skillicons.dev)

<p align="center">
   
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) 
</p>

<a href="https://github.com/ChickenSoup269/Zero_Movie/blob/main/README.md"> Tiếng Việt</a> | English

## Introduction

**Zero Movie** Zero Movie is an online movie ticket booking platform that makes it easy for users to search, book tickets, and enjoy cinema in the most modern way. With the combination of AI and 3D View technology, users can not only book tickets but also preview the real perspective from their selected seat towards the screen.

## Key Features

- **Online movie ticket booking:** Choose movies, showtimes, seats, and make payments easily.

- **AI integration:** Suggest movies based on user preferences and viewing history.

- **3D seat view:** Experience a realistic perspective from the chosen seat before booking.

- **Account management:** Booking history, membership benefits, e-wallet.

- **Cinema API integration:** Real-time showtime updates.

- **Gemini API integration for user suppor:** Users can ask anything related to movies.

## Technology Stack

**Tech & version:**  
[![Generic badge](https://img.shields.io/badge/nextjs-15.3.0-white.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/tailwind-3.4.1-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/react-19.0.0-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/framer--motion-12.4.10-purple.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/three.js-0.176.0-green.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/typescript-5-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/MongoDB-none-1abc9c.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/shadcn%2Fui-latest-black.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/emailjs-4.4.1-orange.svg)](https://shields.io/)

- **Next.js:** Build fast and optimized web interfaces.

- **Tailwind CSS:** Create modern and customizable UI.

- **Three.js:** Render 3D seat view simulation.

- **API AI Gemini:** Answer user queries

- **AI Recommendation System:** Suggest personalized movies for users.

- **MongoDB:** Store user data, tickets, and showtimes.

## Installation & Setup Guide

## 1. Download the Python folder (instructions are in the README.md located at the same level as zeroMovies)

https://github.com/ChickenSoup269/recommendationMovies

### If you encounter Python-related errors, copy this snippet into backend/src/controllers/movieController.ts:

```bash
// Run Python script
const { stdout } = await execPromise(
  `python3 ..\\..\\{name of the python folder you just downloaded}\\models\\recommend.py ${userId}`
)
```

## 2. Add .env file

To run the project, please contact the team to get the API key.

### file .env [frontend]

```bash
NEXT_PUBLIC_API_URL = "your_api_url_here"
NEXT_PUBLIC_IMAGES_API_URL = "your_images_api_url_here"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "your_emailjs_public_key_here"
NEXT_PUBLIC_EMAILJS_SERVICE_ID = "your_emailjs_service_id_here"
NEXT_PUBLIC_EMAILJS_TEMPLATE_PASSWORD_ID = "your_emailjs_template_password_id_here"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_MOVIE_ID = "your_emailjs_template_order_movie_id_here"
NEXT_PUBLIC_GEMINI_API_KEY = "your_gemini_api_key_here"
```

### file .env [backend]

```bash
MONGO_URI = 'your_mongo_uri_here'
TMDB_API_KEY = 'your_tmdb_api_key_here'
JWT_SECRET = 'your_jwt_secret_here'
JWT_REFRESH_SECRET = 'your_jwt_refresh_secret_here'
PAYPAL_CLIENT_ID = 'your_paypal_client_id_here'
PAYPAL_SECRET = 'your_paypal_secret_here'
PAYPAL_API_URL = 'your_paypal_api_url_here'
EMAIL_USER = 'your_email_user_here'
EMAIL_PASS = 'your_email_pass_here'
```

## 3. Overview projects structure

```bash
Directory structure:
└── chickensoup269-zero_movie/
    ├── README.md
    ├── backend/
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── .gitignore
    │   ├── src/
    │   └── uploads/
    └── frontend/
        ├── README.md
        ├── components.json
        ├── eslint.config.mjs
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        ├── tailwind.config.ts
        ├── tsconfig.json
        ├── .gitignore
        ├── public/
        │   ├── CinemaTheater.glb.json
        │   └── images/
        └── src/
```

## 4. Screenshots

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/trangchinh.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/chitietphim.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/trailer.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/binhluan.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/chitietrap.png" alt="drawing" width="800"/> </p>

## 5. Total of code

[![Generic badge](https://img.shields.io/badge/frontend-19.7.0-blue.svg)](https://shields.io/)

<img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/frontend.png" alt="drawing" width="500">
  
[![Generic badge](https://img.shields.io/badge/backend-19.7.0-orange.svg)](https://shields.io/)

<img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/backend.png" alt="drawing" width="500">
                     
## 6. Check data this repo here

https://gitingest.com/ChickenSoup269/Zero_Movie

**NOTE**:<p style="color: red">The PayPal account is in sandbox mode. Please contact us if needed.</p>

### 7. Install frontend & backend dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 8. Run project

Start the development servers with the following commands:

frontend

```bash
npm run dev
```

backend

```bash
npm run start now
```

Then, from the frontend terminal, visit http://localhost:3000 to view the application.

### 9. Build project

To build the project for production, run:

```bash
npm run build
```

## Clone repo

Clone the project

```bash
  git clone https://github.com/ChickenSoup269/Zero_Movie.git
```

Go to the project directory

```bash
  cd my-project
```

## 10. Video demo

link: https://www.youtube.com/watch?v=Hv5FI1u5by8
