const express = require('express');
const passport = require('passport')
const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const config = require('../../../blogsite/server/config')
const {data} = require("express-session/session/cookie");

const router = express.Router();

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
                res.sendStatus(500)
            }
            else {
                req.login(newUser, (err) => {
                    if(err) {
                        console.log(err)
                        res.sendStatus(500)
                    }
                    else {
                        res.sendStatus(200)
                    }
                })
            }
        }
    )
})

router.post('/login', async (req, res) => {
    const login = await passport.authenticate('local', {}, (err) => {
        if (err) {
            console.log('err' + err)
        }
    })

    if (login) {
        const user = async () => {
            const response = await fetch(`http://localhost:5000/api/user/view/${req.body.username}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            try {
                const id = await response.json();
                console.log('id' + JSON.stringify(id))
                return id
            }
            catch (err) {
                console.log(err)
            }
        };

        const id = await user();

        try {
            const token = jwt.sign({
                    id: id._id,
                    username: req.params.username
                },
                config.JWTsecret
            )
            res.json({token: token})
        }
        catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    } else {
        res.sendStatus(400)
    }
});

router.get('/view/:username', (req, res, next) =>  {
    User.findOne({'username': req.params.username}, '_id', (err, oneUser) => {
        if(err) {
            console.log('err' + err)
            res.sendStatus(500);
        }
        else if(oneUser === null){
            res.sendStatus(404);
        }
        else{
            res.json(oneUser);
        }
    })
})

module.exports = router;