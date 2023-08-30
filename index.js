const express = require('express')
const cors = require('cors')
require('dotenv').config({path:'D:/Mern Backend/MidTerm/config.env'})
const connectDb = require('D:/Mern Backend/MidTerm/db/db')
const routerAuthor = require('D:/Mern Backend/MidTerm/routes/authorRoutes')
const routerUser = require('./routes/userRoutes')
const schedule = require('node-schedule')




const app = express()
const port =  process.env.PORT || 5000 
//cors
app.use(cors())
//connectDB
const db = connectDb()



//gpt
const deleteExpiredDocuments = async () => {
    // Get the current date
    const currentDate = new Date().toString();
    const borrowedBooksCollection = db.collection('borrowedbooks');
    const BlockedUserCollection = db.collection('BlockedUserInfo');
    const UserCollection = db.collection('userinfos');
    
    const overdueDocuments = await borrowedBooksCollection.find({ returnDate: { $eq: currentDate } });
    const options = {
        batchSize: 100,
        overwrite: true,
        remove: true
      };
      const filter = {
        email: { $eq: borrowedBooksCollection.borrowedby }
      };
    for (const doc of overdueDocuments) {
      await borrowedBooksCollection.deleteOne({ _id: doc._id });
      UserCollection.copyTo(BlockedUserCollection, options, filter);
    //   console.log(`Deleted document with _id: ${doc._id}`);
    }
  };
  
  // Schedule the function to run every day at 00:00
  schedule.scheduleJob('0 0 * * *', deleteExpiredDocuments);



//gpt















//middleware
app.use(express.json())
app.use('/user',routerUser)
app.use('/author',routerAuthor)

//routes
//connect app
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})