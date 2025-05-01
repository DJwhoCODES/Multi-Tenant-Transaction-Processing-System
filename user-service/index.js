require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const userController = require('./controllers/userController');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());

// app.use(authMiddleware);

app.post('/create-user', userController.createUser);

app.listen(process.env.PORT, () => console.log(`User service running on port ${process.env.PORT}`));
