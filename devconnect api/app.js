const express = require('express');
const app = express();

const Post = require('./src/models/Post');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const methodOverride = require('method-override');

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method')); 
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// test route
app.get('/', (req, res) => {
  res.send('DevConnect API Running');
});

// EJS routes
app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get('/dashboard', auth, async (req, res) => {
  const posts = await Post.find();
  res.render('pages/dashboard', { posts });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// routes import
const postRoutes = require('./routes/postRoutes');
app.use('/posts', postRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

module.exports = app;