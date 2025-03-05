# UGOKU Backend repository

This is a backend application built with Express.js and Prisma as the ORM. The app is configured to use environment variables for sensitive configurations.

## Features
- RESTful API endpoints
- Database interaction using Mongoose
- Environment variable configuration
- Easy setup and scalability

## Requirements
Node.js >= 20.x
npm or yarn
A supported database MongoDB
Need firebase cli to deploy and use google cloud functions

## Main structures:
- functions (google)
- src

```sh
/root
  │
  ├── functions
  │   ├── firebase-json    # Need to configure this file
  │   └── src/             # Functions exists here and all imported in index.ts
  ├── src
  │   ├── api              # Api per functionality (Each functionality consists of router, service and controller)
  │   └── common
  │       ├── middlewares  # Middleware for handling unexpected requests and Prisma-specific error logging
  │       ├── types        # Type classes (etc. ServiceResponse for consistent API success and failure responses)
  │       └── utils        # Utility classes (environment settings, http handlers and logger classes)
  │   ├── index.ts         # Node.js server initilization with Prisma, environment settings, and handling shutdown.
  │   └── server.ts        # Express API with CORS, task routing, error handling, and observability functionalities decleration.
  │
  └── README.md
  

```

## Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/ugoku-be.git
cd your-repo
```

2. Install dependencies
```bash
npm install
```
3. Set up your environment variables
Create a .env file in the root directory and configure it (templated included inside project env.template).

4. Initialize Firebase Cli
```bash
npm install -g firebase-tools
```

5. Install Firebase
```bash
firebase init
```

## Running the Application

Development and Production
```bash
npm start
```
