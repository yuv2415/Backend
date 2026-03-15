require('dotenv').config();
const express=require('express');
const app=express();
const PORT=3000;

app.get('/',(req,res)=>{
    res.send("Server is running");
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});








