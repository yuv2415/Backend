const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token; // 🔥 change here

    if (!token) {
      return res.redirect('/login'); // 🔥 redirect instead of JSON
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.redirect('/login');
  }
};