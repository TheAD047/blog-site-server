var express = require('express');
const Blog = require("../models/Blogs");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/discover', (req, res, next) => {
  Blog.find((err, tenBlogs) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log(tenBlogs)
      res.render('discover', {title: 'Discover' , tenBlogs: tenBlogs});
    }
  }).limit(10).lean();
})

module.exports = router;
