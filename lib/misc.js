// Requirements
var https = require('https'),
	git = require('simple-git')();

// The Interface
var wpMisc = module.exports = {};

// Some helper url's
wpMisc.urls = {
	saltKeys: 'https://api.wordpress.org/secret-key/1.1/salt/',
	gitRepo: 'git://github.com/WordPress/WordPress.git',
	translate: 'http://translate.wordpress.org/projects/wp/dev/%s/default/export-translations?format=%s',
};

// Default salt keys for fallback
var defaultSaltKeys = [
	"define('AUTH_KEY',         'put your unique phrase here');",
	"define('SECURE_AUTH_KEY',  'put your unique phrase here');",
	"define('LOGGED_IN_KEY',    'put your unique phrase here');",
	"define('NONCE_KEY',        'put your unique phrase here');",
	"define('AUTH_SALT',        'put your unique phrase here');",
	"define('SECURE_AUTH_SALT', 'put your unique phrase here');",
	"define('LOGGED_IN_SALT',   'put your unique phrase here');",
	"define('NONCE_SALT',       'put your unique phrase here');",
].join('\n');


// Get some salt keys
wpMisc.getSaltKeys = function(cb) {
	https.get(wpMisc.urls.saltKeys, function(res) {
		if (res.statusCode != 200) {
			return cb(new Error(res), defaultSaltKeys);
		}
		var keys = '';
		res.on('data', function(d) {
			keys += '' + d;
		}).on('end', function() {
			cb(null, keys);
		});
	});
};

// Get the most up to date version from the GitHub Repo
wpMisc.getCurrentVersion = function(cb) {
	// Default version
	var latestVersion = '3.8';

	// Get the most recent WP version from the Wordpress version API
	https.get(wpMisc.urls.version, function(res) {
		if (res.statusCode != 200) {
			return cb(new Error(res), latestVersion);
		}

		var body = '';
		var response;

		res.on('data', function(c){
			body += c;
		}).on('end', function(){
			response = JSON.parse(body);

			latestVersion = response.offers[0].current ? response.offers[0].current : latestVersion;
			return cb(null, latestVersion);
		});

	}).on('error', function(err){
		console.error('Error getting Wordpress version: ' + err);
		return cb(new Error(res), latestVersion);
	});

};
