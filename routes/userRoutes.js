const express = require('express');
const userController = require('D:/Mern Backend/MidTerm/controller/userController');
const { verifyUser} = require('D:/Mern Backend/MidTerm/middleware/jwt');
const router = express.Router()

router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.get('/getBook',verifyUser,userController.getBook)
router.post('/returnBook',verifyUser,userController.returnBook)

module.exports = router;