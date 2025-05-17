# Node.js Project

A basic Node.js project with Express.js setup.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```bash
PORT=3000
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

### Running tests
```bash
npm test
```

## Project Structure

```
├── src/
│   ├── index.js          # Application entry point
│   ├── routes/           # Route definitions
│   ├── controllers/      # Route controllers
│   ├── models/          # Data models
│   └── middleware/      # Custom middleware
├── tests/               # Test files
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
└── package.json        # Project dependencies and scripts
``` 