var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../db');
const Group = mongoose.model('Group');


router.get('/', (req, res, next) => {
	res.render("create");
});

// Lets the user create a group
router.post('/', (req, res, next) => {
	if (req.session.passport.hasOwnProperty('user')){
		Group.findOne({name: req.body.groupName, users:req.session.passport.user}, (err, result, count) => {
			if (result){
				res.send("Group exists");
			}else{
				const newGroup = new Group({
					name: req.body.groupName,
					users: [req.session.passport.user],
				});
				console.log("> GROUP :", newGroup);
				newGroup.save((err, link) => {
					res.redirect('/');
				});
			}
		});
	}else{
		res.send("please log in!!");
	}

});

module.exports = router;