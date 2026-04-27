const Post = require('../models/Post');


// CREATE POST
exports.createPost = async (req, res) => {
  try {
    await Post.create({
      ...req.body,
      author: req.user.userId
    });

    res.redirect('/dashboard');

  } catch (error) {
    res.send(error.message);
  }
};


// GET ALL POSTS (API use ke liye)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: "All posts fetched",
      data: posts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET POST BY ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched",
      data: post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // 🔥 SAFE OWNERSHIP CHECK
    if (!post.author || post.author.toString() !== req.user.userId) {
      return res.status(403).send("Not allowed");
    }

    await Post.findByIdAndUpdate(req.params.id, req.body);

    res.redirect('/dashboard');

  } catch (error) {
    res.send(error.message);
  }
};


// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // OWNERSHIP CHECK
    if (!post.author || post.author.toString() !== req.user.userId) {
      return res.status(403).send("Not allowed");
    }

    await Post.findByIdAndDelete(req.params.id);

    res.redirect('/dashboard');

  } catch (error) {
    res.send(error.message);
  }
};