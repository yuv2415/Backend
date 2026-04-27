const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");

// Dashboard
router.get("/", auth, async (req,res) => {
	const todos = await Todo.find({ userId:req.user.userId });
	res.render("dashboard", { todos });
});

// Add Todo
router.post("/add", auth ,async (req,res) => {
	await Todo.create({
    title:req.body.title,
    userId:req.user.userId
  }); 
	res.redirect("/todos");
});

// Toggle Complete
router.post("/toggle/:id", auth, async (req,res) => {
	const todo = await Todo.findById(req.params.id);
	todo.completed = !todo.completed;
	await todo.save();
	res.redirect("/todos");
});

// Delete Todo
router.post("/delete/:id", auth, async (req,res) => {
	await Todo.findByIdAndDelete(req.params.id);
	res.redirect("/todos");
});

module.exports=router;