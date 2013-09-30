// Requirements
var https = require('https'),
	git = require('simple-git')();

// The Interface
var wpUtil = module.exports = {};

// Some helper url's
wpUtil.urls = {
	saltKeys: 'https://api.wordpress.org/secret-key/1.1/salt/',
	gitRepo: 'git://github.com/WordPress/WordPress.git'
};

// Load the different helpers
wpUtil.config = require('./config');
wpUtil.database = require('./database');

// Get some salt keys
wpUtil.getSaltKeys = function(cb) {
	var keys = '';
	https.get(wpUtil.urls.saltKeys, function(res) {
		if (res.statusCode != 200) {
			return cb(new Error('Non 200 response: ' + res.statusCode), null);
		}
		res.on('data', function(d) {
			keys += '' + d;
		}).on('end', function() {
			cb(null, keys);
		});
	});
};

// Get the most up to date version from the GitHub Repo
wpUtil.getCurrentVersion = function(callback) {
	var latestVersion = '3.6.1';
	git.listRemote('--tags ' + wpUtil.urls.gitRepo, function(err, tagsList) {
		if (err) return callback(err, latestVersion);
		tagList = ('' + tagsList).split('\n');
		tagList.pop();
		lastTag = /\d\.\d\.\d/ig.exec(tagList.pop());
		if (lastTag !== null) {
			latestVersion = lastTag[0];
		}
		callback(null, latestVersion);
	});
};
