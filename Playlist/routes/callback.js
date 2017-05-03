var express = require('express');
var router = express.Router();
var SC = require('node-soundcloud');



var initOAuth = function(req, res) {
	var url = SC.getConnectUrl();
	 
	res.writeHead(301, { location: url });
	res.end();
};

router.get('/', (req, res, next) => {
	SC.init({
		id: 'your SoundCloud client ID',
		secret: 'your SoundCloud client secret',
		uri: 'your SoundCloud redirect URI',
		accessToken: 'your existing access token'
	});
	initOAuth(res, res);
	// SC.get('/tracks/276882056', function(err, track) {
	// 	if ( err ) {
	// 		throw err;
	// 	} else {
	// 		console.log('track retrieved:', track);
	// 	}
	// });
});

module.exports = router;
