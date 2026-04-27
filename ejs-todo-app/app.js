const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// View Engine
app.set("view engine","ejs");

// Routes
const authRoutes=require("./routes/authRoutes");
const todoRoutes=require("./routes/todoRoutes");

app.use("/",authRoutes);
app.use("/todos",todoRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() =>console.log("MongoDB Connected"))
.catch(err =>console.log(err));

// Server
app.listen(3000, () => {
console.log("Server running on port 3000");
});