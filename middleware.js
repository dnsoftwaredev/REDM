module.exports.isLoggedIn = (req, res, next) => { // middleware to help specifying if a user is currently logged in
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // help remember last place so can redirect user back after login
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}
