const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');



const User = new mongoose.Schema({
	username: String, // username
	password: String, // password
	groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}] // an array of references to Group documents
	// I should have a field for Spotify/SoundCloud accounts, but I still need to figure out how to do that
});

const Song = new mongoose.Schema({
	id: String, // song id
	title: String, // song title
	artists: [String], // song artist
	uploader: String, // the user that uploaded the song
	checked: Boolean, // lets users select songs to remove
});

const Group = new mongoose.Schema({
	name: String, // group name
	songs: {type : [Song] , unique : true, dropDups: true }, // an array of embedded songs
	users: [String], // list of all users in a group
});

User.plugin(passportLocalMongoose);
Group.plugin(URLSlugs('name'));

mongoose.model("User", User);
mongoose.model("Song", Song);
mongoose.model("Group", Group);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
// console.log(process.env);
if (process.env.NODE_ENV === 'PRODUCTION') {
	// if we're in PRODUCTION mode, then read the configration from a file
	// use blocking file io to do this...
	var fs = require('fs');
	var path = require('path');
	var fn = path.join(__dirname, 'config.json');
	var data = fs.readFileSync(fn);
	 // our configuration file will be in json, so parse it and set the
	// conenction string appropriately!
	var conf = JSON.parse(data);
	var dbconf = conf.dbconf;
} else {
	// if we're not in PRODUCTION mode, then use
	// dbconf = 'mongodb://sf2658:VcvdciYB@class-mongodb.cims.nyu.edu/sf2658';
	dbconf = 'mongodb://localhost/finalprojectconfig';
}

mongoose.Promise = global.Promise;
mongoose.connect(dbconf);