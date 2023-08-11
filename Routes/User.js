const express = require('express');
const passport = require('passport')
const User = require('../models/Users')
const config = require('../config/config')

const router = express.Router();

router.get('/register', (req, res,next) => {
    res.render('register')
})

//registration handler
router.post('/register', (req, res, next) => {
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        (err, newUser) => {
            if (err) {
                console.log(err)
                res.redirect('/user/register')
            }
            else {
                req.login(newUser, (err) => {
                    res.redirect('/')
                })
            }
        }
    )
})

router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login?message=true',
    failureMessage: 'Invalid credentials'
}))

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            console.log(err)
        }
        else{
            res.redirect('/user/login')
        }
    })
})

module.exports = router;