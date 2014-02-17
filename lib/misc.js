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

	// List the tags
	git.listRemote('--tags ' + wpMisc.urls.gitRepo, function(err, tagsList) {
		// Fail on error, return default
		if (err) return cb(err, latestVersion);

		// Split the tags on new lines
		tagList = ('' + tagsList).split('\n');

		// The last line is empty
		tagList.pop();

		// The next to last line is the most recent tag
		lastTag = /\d\.\d\.\d/ig.exec(tagList.pop());

		// If there was a match, set it
		if (lastTag !== null) {
			latestVersion = lastTag[0];
		}

		// Done
		cb(null, latestVersion);
	});
};
