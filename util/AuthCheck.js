
const isAuthenticated = (req, res ,next) => {
    if(req.isAuthenticated()){
        console.log('hit')
        return next();
    }
    res.redirect('/user/login')
}

module.exports = isAuthenticated;