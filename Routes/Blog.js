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
            res.render('error', {message: 'There was an internal server error'})
        }
        else {
            res.redirect(`/blogs/${req.user.username}/blogs`)
        }
    })
})

//delete a certain blog
router.post('/delete/:id', auth, (req, res, next) => {
    var id = req.params.id;
    
    Blog.findOne({'_id': id}, 'heading body date', (err, oneBlog) => {
        if(err) {
            console.log(err)
            res.render('error', {message: 'There was an internal server error'})
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
                res.render('error', {message: 'Unauthorised'})
            }
        }
    })
})

//get a certain blog
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    console.log(id);

    // get the blog from db
    Blog.findOne({'_id': id}, 'heading body date', (err, oneBlog) => {
        if(err) {
            console.log(err)
            res.render('error', {message: 'There was an internal server error'})
        }
        else if(oneBlog === null) {
            res.sendStatus(404)
            console.log('404')
        }
        else {
            res.json(oneBlog);
        }
    })
})

//edit handler for blog
router.post('/edit/:id', auth,(req, res, next) => {
    var id = req.params.id;

    Blog.updateOne(
        {'_id': id},
        {
            heading: req.body.heading,
            body: req.body.body
        },
        (err, updatedBlog) => {
            if (err) {
                console.log(err)
                res.render('error', {message: 'There was an internal server error'})
            }
            else {
                res.redirect(`/blogs/${req.user.username}/blogs`)
            }
        }
    )
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
            res.render('/error', {message: '404 Not found'})
        }
        else {
            oneUser.username = oneUser.username.split('@')[0]
            Blog.find({'username': username}, (err, blogs) => {
                if(err){
                    console.log(err)
                    res.render('error', {err: err, message: 'There was an internal server error'})
                }
                else {
                    res.render('userBlogs', {blogs: blogs, author: oneUser, isAuthor: isAuthor, user: req.user})
                }
            })
        }
    })
})

module.exports = router;