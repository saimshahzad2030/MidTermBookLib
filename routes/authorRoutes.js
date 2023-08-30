const express = require('express');
const authController = require('D:/Mern Backend/MidTerm/controller/authorController');
const { verifyUser} = require('D:/Mern Backend/MidTerm/middleware/jwt');
const router = express.Router()

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/newBook',verifyUser,authController.newBook)

module.exports = router;