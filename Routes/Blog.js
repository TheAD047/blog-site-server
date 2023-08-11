const express = require('express');
const router = express.Router();
const Blog = require('../models/Blogs')
const User = require('../models/Users')
const auth = require('../util/AuthCheck')

router.get('/add', auth, (req, res, next) => {
    console.log(req.user.username)
    res.render('addBlog', {user: req.user})
})

//add a new blog
router.post('/add', auth, (req ,res, next) => {

    Blog.create({
        heading: req.body.heading,
        body: req.body.body,
        username: req.user.username
    }, (err, newBlog) => {
        if(err) {
            console.log(err);
            res.render('error', {message: 'There was an internal server error', user: req.user})
        }
        else {
            res.redirect(`/blogs/${req.user.username}/blogs`)
        }
    })
})

//delete a certain blog
router.get('/delete/:id', auth, (req, res, next) => {
    var id = req.params.id;
    
    Blog.findOne({'_id': id}, 'heading body date username', (err, oneBlog) => {
        console.log(oneBlog)
        if(err) {
            console.log(err)
            res.render('error', {message: 'There was an internal server error', user: req.user})
        }
        else if (oneBlog === null) {
            res.sendStatus(404)
        }
        else {
            if(oneBlog.username === req.user.username) {
                Blog.deleteOne({'_id': id}, (err) => {
                    if (err) {
                        console.log(err);
                        res.render('error', {message: 'There was an internal server error'});
                    } else {
                        res.redirect(`/blogs/${req.user.username}/blogs`)
                    }
                })
            }
            else {
                res.render('error', {message: 'Unauthorised', user: req.user})
            }
        }
    })
})

//get a certain blog
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    console.log(id);

    // get the blog from db
    Blog.findOne({'_id': id}, 'heading body date username', (err, oneBlog) => {
        if(err) {
            console.log(err)
            res.render('error', {message: 'There was an internal server error', user: req.user})
        }
        else if(oneBlog === null) {
            res.render('error', {message: '404 not found', user: req.user})
        }
        else {
            res.render('blogDetails', {blog: oneBlog, user: req.user})
        }
    })
})

router.get('/edit/:id', auth, (req, res, next) => {
    let id = req.params.id

    Blog.findOne({'_id': id}, 'heading body username', (err, oneBlog) => {
        if(req.user.username === oneBlog.username) {
            res.render('editBlog', {blog: oneBlog})
        }
        else{
            res.render('error', {'message': 'unauthorised', user: req.user})
        }
    })
})

//edit handler for blog
router.post('/edit/:id', auth,(req, res, next) => {
    var id = req.params.id;

    Blog.findOne({'_id': id}, 'username', (err, oneBlog) => {
        if(req.user.username === oneBlog.username) {
            Blog.updateOne(
                {'_id': id},
                {
                    heading: req.body.heading,
                    body: req.body.body
                },
                (err, updatedBlog) => {
                    if (err) {
                        console.log(err)
                        res.render('error', {message: 'There was an internal server error', user: req.user})
                    }
                    else {
                        res.redirect(`/blogs/${req.user.username}/blogs`)
                    }
                }
            )
        }
        else{
            res.render('error', {'message': 'unauthorised',  user: req.user})
        }
    })
})

router.get('/:username/blogs',  (req, res ,next) => {
    let username = req.params.username;
    let isAuthor = false

    if(req.user) {
        console.log('yup')
        if(req.user.username === username) {
            isAuthor = true
            console.log(isAuthor)
        }
    }

    User.findOne({'username': username},(err, oneUser) => {
        if(err || oneUser === null) {
            res.render('/error', {message: '404 Not found',  user: req.user})
        }
        else {
            oneUser.username = oneUser.username.split('@')[0]
            let isAdmin = false;
            if(oneUser.admin) {
                isAdmin = true;
            }
            Blog.find({'username': username}, (err, blogs) => {
                if(err){
                    console.log(err)
                    res.render('error', {err: err, message: 'There was an internal server error',  user: req.user})
                }
                else {
                    res.render('userBlogs', {blogs: blogs, author: oneUser, isAuthor: isAuthor, user: req.user, isAdmin: isAdmin})
                }
            })
        }
    })
})

module.exports = router;