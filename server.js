const express=require('express');

const app=express();

const db=require('./db');

require('dotenv').config();


const bodyParser=require('body-parser');

app.use(bodyParser.json());

const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');

app.use('/',userRoutes);

app.use('/admin',candidateRoutes);


const PORT=process.env.PORT||3000

app.listen(PORT,()=>{
    console.log("server is live");
})

