'use strict'
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
require('../db');
const Group = mongoose.model('Group');
const User = mongoose.model('User');


router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if(user) {
      req.logIn(user, function(err) {
      	// req.session.username = user.username;
		console.log("printing session", req.session);
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});


router.get('/logout', function(req, res){
  req.logout();
  console.log("logged out", req.session);
  res.redirect('/');
});

module.exports = router;