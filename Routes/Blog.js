const express = require('express');
const router = express.Router();
const Blog = require('../models/Blogs')

//add a new blog
router.post('/add', (req ,res, next) => {
    console.log(req.body)

    Blog.create({
        heading: req.body.heading,
        body: req.body.body,
        username: req.body.username
    }, (err, newBlog) => {
        if(err) {
            console.log(err);
            res.sendStatus(500)
        }
        else {
            res.sendStatus(200)
        }
    })
})

//delete a certain blog
router.post('/delete/:id', (req, res, next) => {
    var id = req.params.id;

    Blog.findOne({'_id': id}, 'heading body date', (err, oneBlog) => {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else if (oneBlog === null) {
            res.sendStatus(404)
        }
        else {
            Blog.deleteOne({'_id': id}, (err) => {
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                }
                else {
                    res.sendStatus(200)
                }
            })
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
            res.sendStatus(500)
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
router.post('/edit/:id', (req, res, next) => {
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
                res.sendStatus(500)
            }
            else {
                res.sendStatus(200)
            }
        }
    )
})

router.get('/:username/blogs', (req, res ,next) => {
    let username = req.params.username;

    Blog.find({'username': username}, (err, blogs) => {

    })
})

module.exports = router;