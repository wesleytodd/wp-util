// Requirements
var fs = require('fs'),
	path = require('path');

// The interface
var wpUtilConfig = module.exports = {};

// Find the wp-config.php file
wpUtilConfig.findFile = function(cwd, cb) {

	// cwd is optional
	if (typeof cb === 'undefined') {
		cb = cwd;
		cwd = process.cwd();
	}

	// Callback is required
	if (typeof cb !== 'function') throw new Error('A callback is required');

	// First look in current directory
	var file = path.join(cwd, 'wp-config.php');
	fs.exists(file, function(exists) {
		if (exists) {
			cb(null, file);
		} else {
			// Then look up one directory
			file = path.join(cwd, '..', 'wp-config.php');
			fs.exists(file, function(exists) {
				if (exists) {
					cb(null, file);
				} else {
					// Not found
					cb(new Error('Cannot find wp-config.php'), null);
				}
			});
		}
	});
};

// Load the wp-config.php file
wpUtilConfig.loadFile = function(cwd, cb) {

	// cwd is optional
	if (typeof cb === 'undefined') {
		cb = cwd;
		cwd = process.cwd();
	}

	// Callback is required
	if (typeof cb !== 'function') throw new Error('A callback is required');

	// Find the file
	wpUtilConfig.findFile(cwd, function(err, file) {
		if (err) return cb(err, null);

		// Load the file content as a string
		fs.readFile(file, {encoding: 'utf8'}, function(err, contents) {
			if (err) cb(err, null);
			cb(null, contents);
		});
		
	});

};

// Parse out database credentials
wpUtilConfig.getDbCredentials = function(content, cb) {

	// If content not provided, find and load the config
	if (typeof cb === 'undefined') {
		cb = content;
		wpUtilConfig.loadFile(function(err, content) {
			if (err) return cb(err, {});
			wpUtilConfig.getDbCredentials(content, cb);
		});
		return;
	}

	var data = {},
		errors = null,
		parts = {
			name: /define\(["']DB_NAME["'],[\s]*["'](.*)["']\)/,
			user: /define\(["']DB_USER["'],[\s]*["'](.*)["']\)/,
			pass: /define\(["']DB_PASSWORD["'],[\s]*["'](.*)["']\)/,
			host: /define\(["']DB_HOST["'],[\s]*["'](.*)["']\)/,
			prefix: /\$table_prefix[\s]*=[\s]*["'](.*)["']/
		};

	// Loop through the parts
	for (var i in parts) {
		// Try to find a match
		var match = content.match(parts[i]);
		if (!match) {
			if (!errors) errors = [];
			errors.push(new Error('Value not found for: ' + i));
		} else {
			data[i] = match[1];
		}
	}

	cb(errors, data);
};
