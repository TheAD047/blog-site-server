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
      res.json(tenBlogs);
    }
  }).limit(10);
})


module.exports = router;
