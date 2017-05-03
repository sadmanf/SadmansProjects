'use strict'

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../db');
const Group = mongoose.model('Group');
const User = mongoose.model('User');
const Song = mongoose.model('Song');

var SpotifyWebApi = require('spotify-web-api-node');

var scopes = ['playlist-read-collaborative', 'playlist-read-private'],
	redirectUri = 'http://localhost:3000',
	clientId = '67fa3b90b8f849d39e21ed5cdb866c53',
	state = 'some-state-of-my-choice';


var uri = encodeURIComponent('http://localhost:3000/selection')

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : 'ee53513a44904f7083a5f7f783b2a5eb',
  redirectUri : uri
});


let playlists = [];


router.get('/', (req, res, next) => {
	if (req.session.hasOwnProperty('passport') && req.session.passport.hasOwnProperty('user')){
		console.log("I am logged in as", req.session.passport.user);
		Group.find({users: req.session.passport.user}, (err, docs) => {
			res.render('groups', {groups: docs, user:req.session.passport.user});
		});
	}else{
		res.redirect('/login');
	}

});

// Displays all the songs in a group
router.get('/group/:groupSlug', (req, res) => {
	// console.log(req.params.groupSlug);
	if (!req.session.hasOwnProperty('passport')){
		res.render('error', {message: "please log in"});
	}else{
		Group.findOne({slug: req.params.groupSlug, users:req.session.passport.user}, (err, group) => {
			if (err){
				console.log(err);
			}else if (group === null){
				res.render('error', {message: "no group found"});
			}else{
				state = req.params.groupSlug;
				const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
				console.log(authorizeURL);
				// Calculate the amount of songs uploaded by each user
				const numUploaded = [];
				group.users.forEach((user) => {
					const num = group.songs.reduce((sum, song) => {
						if (song.uploader === user){
							return sum + 1;
						} return sum;
					}, 0);
					numUploaded.push({user:user, num:num});
				});
				console.log(numUploaded);

				res.render('groupPage', {users:numUploaded, songs:group.songs, groupName:group.name, url:authorizeURL});
			}
		});
	}
});


// This is a POST request to add a user to a group
router.post('/group/:groupName', (req, res) => {
	const groupName = req.params.groupName;

	// Searches for the right user
	User.findOne({username: req.body.member}, (err, user) => {
		if (err){
			console.log(err);
		}else if (user === null){
			res.render('error', {message: 'That user was not found.'})
		}else{
			// The user has been found. Time to add them to the group.
			Group.findOne({slug: groupName}, (err, group) => {
				if (err){
					console.log(err);
				}else if (group === null){
					res.render("error", {message: "no group found"});
				}else{
					group.users.push(user.username);
					group.save((err) => { if (err){ console.log(err); } });
					res.redirect('/group/' + groupName);
				}
			});
		}
	});
});

// The user should be authorized at this page, and they can 
// select which playlists they wish to import.
//
// The error message is set within the success promise
// so that it will only store the possible errors up until
// the last success.
router.get('/selection', (req, res) => {
	let errorMessage = 'Not authorized!';

	console.log(req.query.code);

	// The Spotify API will give an OAuth token (req.query.code)
	// if the clientID and clientSecret are valid
	// var code = 'BQBv2eA4fbUiUZLxGiO6_tTn1ekYCB13y9eeSMdtrcaEA0nJzCNIMvlJFJTIX77y3FyQUPZ2G9pLkKi8deADQZCqnnPGkR7pk3FTYdaxadru2PVkKj6PXlDHDK3fCMKTKnkbNTifvaXDxmQVbhSBOvP0nfU7Fo6BTb1HMiqbd-1Z1BZfgbAjKlvux0CezPEgQzXTJvOleKip';
	spotifyApi.authorizationCodeGrant('BQBv2eA4fbUiUZLxGiO6_tTn1ekYCB13y9eeSMdtrcaEA0nJzCNIMvlJFJTIX77y3FyQUPZ2G9pLkKi8deADQZCqnnPGkR7pk3FTYdaxadru2PVkKj6PXlDHDK3fCMKTKnkbNTifvaXDxmQVbhSBOvP0nfU7Fo6BTb1HMiqbd-1Z1BZfgbAjKlvux0CezPEgQzXTJvOleKip')
	.then(function(data) {
		console.log("I AM WORKING!!!");
		spotifyApi.setAccessToken(data.body['access_token']);
		spotifyApi.setRefreshToken(data.body['refresh_token']);
		return spotifyApi.getMe();
	}, function(err) {
		console.log(err);
		return Promise.reject(err);
	})

	// data contains information about 
	// the current authorized user
	.then(function(data){
		errorMessage = 'Incorrect access tokens';
		return spotifyApi.getUserPlaylists(data.body.id);
	}, function(err) {
		return Promise.reject(err);
	})


	// data contains all of the user's playlists
	.then(function(data){
		playlists = [];
		data.body.items.forEach((ele) => {
			playlists.push({name:ele.name, id:ele.id, owner:ele.owner.id});
		});
		errorMessage = 'Cannot access playlist!';
		res.render('selection', {playlists:playlists, state:req.query.state});
	},function(err) {
		res.render('error', {message: errorMessage});
	});	    
});


// The user should have selected all the playlists 
// that they wish to import. Now we just need to 
// convert their contents into mongoose Songs.
router.post('/postSpotify/:groupSlug', function(req, res){
	const playlistIDs = Object.keys(req.body);

	// Filter out only the playlists that were selected
	playlists = playlists.filter((ele) => {
		for (let x = 0; x < playlistIDs.length; x++){
			if (ele.id === playlistIDs[x]) return true;
		}return false;
	});

	// Access current group
	Group.findOne({slug: req.params.groupSlug}, (err, group) => {
		if (err) console.log(err);
		else{
			// Repeat for each playlist 
			playlists.forEach((p) => {
				spotifyApi.getPlaylist(p.owner, p.id)
				.then(function(data) {
					const songList = data.body.tracks.items;

					// Repeat for each song
					songList.forEach((s) => {
						const artists = s.track.artists.map((artist) => {
							return artist.name;
						});

						// IDs of each song already in the group
						const groupSongs = group.songs.map((song) => {
							return song.id;
						});

						// Add song if not contained in the group
						if (groupSongs.indexOf(s.track.id) < 0){
							const newSong = Song({
								id: s.track.id,
								title: s.track.name,
								artists: artists,
								uploader: req.session.passport.user,
								checked: false,
							});
							newSong.save( (err) => {if (err) console.log(err)} );
							group.songs.push(newSong);
						}else{
							console.log("THE SONG ALREADY EXISTS IN THE PLAYLIST");
						}
					})					
					group.save( (err) => {if (err) console.log(err)}) 
				},
				function(err){
					console.log("Error retrieving playlist songs", err);
				})
			})
		}
	})
	res.redirect('/group/' + req.params.groupSlug);
});


module.exports = router;