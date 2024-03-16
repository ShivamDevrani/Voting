const mongoose=require('mongoose');

require('dotenv').config();

const LOCAL_URL= process.env.URL;
const DB_URL=process.env.DB_URL;

mongoose.connect(DB_URL);

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('mongodb is connected');
})


db.on('disconnected',()=>{
    console.log('mongodb is disconnected');
})

db.on('error',()=>{
    console.log('error in db connection:',err);
})


module.exports=db;