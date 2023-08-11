const User = require('../models/Users')

const isAdmin = (req, res, next) => {
    let username = req.user.username;

    User.findOne({'username': username}, 'admin', (err, oneUser) => {
        if(err) {
            res.render('/error', {message: 'internal server error'})
        }
        else if(JSON.stringify(oneUser).includes('admin')){
            return next();
        }
        else{
            res.render('error', {message: 'Unauthorised'})
        }
    })
}

module.exports = isAdmin;