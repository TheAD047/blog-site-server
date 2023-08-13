const express = require('express');
const mongoose = require('mongoose');
const config = require('../../blogsite/server/config');
const router = express.Router();

const Blog = require('./models/Blogs');

const passport = require('passport')
const passjwt = require('passport-jwt')
const passjwtcc = require('passport-jwt-cookiecombo')
const session = require('express-session')

const User = require('./models/Users')

const blogRouter = require('./Routes/Blog')
const reportRouter = require('./Routes/Report')
const userRouter = require('./Routes/User')

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(session({
    secret: 'blog-site-secret',
    resave: false,
    saveUninitialized: false
}))

server.use(passport.initialize());
server.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new passjwt.Strategy({
        jwtFromRequest: passjwt.ExtractJwt.fromExtractors([
            (req) => {
                return req.cookie["_auth"];
            }
        ]),
        secretOrKey: config.JWTsecret
    },
    (payload, done) => {
        return User.findOne({where: {'_id': payload.id} })
            .then((user) => {
                return done(null, user)
            })
            .catch((err) => {
                return done(err)
            })
    }
))

mongoose
    .connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((message) =>{
        console.log('connected!')
    })
    .catch((err) => {
        console.log('DB not connected ' + err)
    })

server.get('/api', (req, res, next) => {
    res.json({'users': ['user1', 'user2', 'user3']})
})

router.get('/api/discover', (req, res, next) => {

    Blog.find((err, tenBlogs) => {
        if(err) {
            console.log(err)
        }
        else {
            res.json(tenBlogs);
        }
    }).limit(10);
})

server.use('/', router)
server.use('/api/Blog', blogRouter);
server.use('/api/Report', reportRouter)
server.use('/api/User', userRouter)

server.listen(5000, () => {
    console.log("Server started")
})