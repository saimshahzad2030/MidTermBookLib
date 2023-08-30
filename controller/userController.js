
const User = require('D:/Mern Backend/MidTerm/model/userModel');
const Book = require('D:/Mern Backend/MidTerm/model/bookModel');
const jwt = require('D:/Mern Backend/MidTerm/middleware/jwt')
const borrowedBooksModel = require('D:/Mern Backend/MidTerm/model/borrowedBooksModel');
const BlockedUser = require('D:/Mern Backend/MidTerm/model/blockedUserModel')
const bcrypt = require('bcrypt');
const userController = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(404).json({ message: "all fields required" })
            }
            // Check if the user already exists
            const exitingUser = await User.findOne({ email });
            const existingBlockedUser = await BlockedUser.findOne({ email });
            if (exitingUser) {
                return res.status(409).json({ message: "email already exist" })
            }
            else if(existingBlockedUser){
                return res.status(409).json({ message: "You are blocked user and u cannot create your account" })

            }
            else{
                // Hash the password
            const hashPaswd = await bcrypt.hash(password, 10)
            //create user
            const newUser = new User({

                email,
                password: hashPaswd,

            })
            await newUser.save()

            const token = jwt.sign(req.body, password)
            res.status(200).json({ token })
            }
        }
        catch (error) {
            res.status(520).json({ message: "internal server error", error: error.message })
        }

    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(401).json({ message: "Enter Password & email both" })

            }
            //find user
            else {
                const user = await User.findOne({ email })
                const isPaswd = await bcrypt.compare(password, user.password)
                // console.log(user)
                if (!user) {
                    return res.status(401).json({ message: "invalid email or password" })
                }
                //compare password
                else if (!isPaswd) {
                    return res.status(401).json({ message: "wrong password" })
                }
                //generate jwt

                // const authHeader = req.headers.authorization;

                else {
                    const token = jwt.sign(req.body, password)
                    res.status(200).send(token)
                }
            }
        }
        catch (error) {
            return res.status(520).json({ message: "internal server error", error: error.message })
        }
    },
    async getBook(req, res) {
        try {
            const { bookname, author } = req.body;
            if (!bookname || !author) {
                return res.status(404).json({ message: "all fields required" })
            }

            else {
                const findBook = await Book.findOne({ bookname })
                if (findBook) {
                    // // console.log("book found");
                    const [bearer, token, secretKey, email] = req.headers.authorization.split(" ");
                    const date = new Date();


                    const threeDaysAfter = new Date(date.getTime() + (3 * 24 * 60 * 60 * 1000));

                    // console.log(findBook)
                    const newBorrowedBook = new borrowedBooksModel({
                        bookname,
                        author,
                        borrowedby: email,
                        borrowedDate: date.toString(),

                        returnDate: threeDaysAfter.toString()
                    })
                    await newBorrowedBook.save()
                    await Book.deleteOne({bookname:bookname})
                    res.status(200).send(newBorrowedBook)
                }

                else {
                    // //create Job
                    // const newBook = new book({
                    //     bookname,author,price
                    // })
                    // await newBook.save()

                    // // const token = jwt.sign(req.body)
                    // res.status(200).json({newBook})
                    res.status(402).send("No Book found")
                }
            }

        }
        catch (error) {
            res.status(520).send(error)
        }
    },
    async returnBook(req,res){
        try {
            const { bookname, author } = req.body;
            if (!bookname || !author) {
                return res.status(404).json({ message: "all fields required" })
            }

            else {
                const findBook = await borrowedBooksModel.findOne({ bookname })
                if (findBook) {
                
                    const newBook = new Book({
                        bookname,
                        author
                        
                    })
                    await newBook.save()
                    await borrowedBooksModel.deleteOne({bookname:bookname})
                    res.status(200).send(newBook)
                }

                else {
                 
                    res.status(402).send("No Book found")
                }
            }

        }
        catch (error) {
            res.status(520).send(error)
        }
    }
}


module.exports = userController