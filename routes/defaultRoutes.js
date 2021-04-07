const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'default';
    next();
})

router.route('/')
    .get(defaultController.index);

//Passport
passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
        if(!user){
            return done(null, false, req.flash('error-message', 'Nie znaleziono użytkownika z takim adresem email.'));
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if(err){
                return err;
            }

            if(!passwordMatched){
                return done(null, false, req.flash('error-message', 'Zły adres email lub hasło.'));
            }

            return done(null, user, req.flash('success-message', 'Zalogowałeś się!'));
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }) ,defaultController.loginPost)

router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

router.route('/post/:id')
    .get(defaultController.getSinglePost)
    .post(defaultController.submitComment);

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success-message', 'Wylogowano pomyślnie!');
    res.redirect('/');
});

module.exports = router;