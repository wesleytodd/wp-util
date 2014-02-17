// Requirements
var fs = require('fs'),
	util = require('util'),
	path = require('path'),
	_ = require('lodash'),
	winston = require('winston');

// Match a PHP constant definition, #awesomeRegex
var defineKey = 'define\\([\\s]*([\\"\'])%s\\1[\\s]*,[\\s]*([\\"\'])((\\\\\\2|.)*)?\\2[\\s]*\\)';

// The interface
var WpConfig = module.exports = function(options) {

	// Extend the default options
	this.options = _.extend({}, WpConfig.defaultOptions, options);

	// Logger
	this.logger = this.options.logger;

	// Allow for extra config files
	this.filename = this.options.filename;

	// The absolute path to the config file we found
	this.absPath = this.options.absPath;

	// The config file content
	this.content = this.options.content;
	
	// Log options
	this.logger.log('verbose', 'WP Config Options: %j', this.options);

};

// Default options
WpConfig.defaultOptions = {
	logger: winston,
	filename: 'wp-config.php',
	absPath: null,
	content: null,
};

// Find the wp-config.php file
WpConfig.prototype.find = function(dir, cb) {

	// dir defaults to cwd
	if (typeof dir === 'function') {
		cb = dir;
		dir = process.cwd();
	}

	// Only try to fine the file once
	if (this.absPath) {
		// Always be async
		process.nextTick(function() {
			cb(null, this.absPath);
		}.bind(this));

		// Chainable
		return this;
	}

	// First look in current directory
	var file = path.join(dir, this.filename);
	fs.exists(file, function(exists) {
		if (exists) {
			this.absPath = path.resolve(file);
			cb(null, this.absPath);
		} else {
			// Then look up one directory
			file = path.join(dir, '..', this.filename);
			fs.exists(file, function(exists) {
				if (exists) {
					this.absPath = path.resolve(file);
					cb(null, this.absPath);
				} else {
					// Not found
					cb(new Error('Cannot find ' + this.filename));
				}
			}.bind(this));
		}
	}.bind(this));

	// Chainable
	return this;
};

// Load the wp-config.php file
WpConfig.prototype.load = function(dir, cb) {

	// dir defaults to cwd
	if (typeof dir === 'function') {
		cb = dir;
		dir = process.cwd();
	}

	// Only load the file once
	if (this.content) {
		// Always be async
		process.nextTick(function() {
			cb(null, this.content);
		}.bind(this));

		// Chainable
		return this;
	}

	// Find the file
	this.find(dir, function(err, file) {
		// Could not find file
		if (err) return cb(err);

		// Load the file content as a string
		fs.readFile(file, {encoding: 'utf8'}, function(err, content) {
			// Read error
			if (err) return cb(err);

			// Save content
			this.content = content;

			// Done
			cb(null, this.content);
		}.bind(this));
		
	});

	// Chainable
	return this;
};

// Parse out database credentials
WpConfig.prototype.getDbCredentials = function(content, cb) {

	// If content not provided, find and load the config
	if (typeof content === 'function') {
		// Re-assign callback
		cb = content;

		// Load content and re-call method
		this.load(function(err, content) {
			if (err) return cb(err);
			this.getDbCredentials(content, cb);
		}.bind(this));

		// Chainable
		return this;
	}

	var data = {},

		// Collect the errors
		errors = [],

		// This is just a silly way to not write the error checking for each item,
		// the first item in each array is the regex to match, the second,
		// is the index of the capturing group to send back
		parts = {
			name: [new RegExp(util.format(defineKey, 'DB_NAME')), 3],
			user: [new RegExp(util.format(defineKey, 'DB_USER')), 3],
			pass: [new RegExp(util.format(defineKey, 'DB_PASSWORD')), 3],
			host: [new RegExp(util.format(defineKey, 'DB_HOST')), 3],
			prefix: [/[\s]*\$table_prefix[\s]*=[\s]*(["'])((?:\\\1|.)*)\1[\s]*;/, 2],
		};

	// Loop through the parts
	for (var i in parts) {
		// Try to find a match
		var match = content.match(parts[i][0]);
		if (!match) {
			errors.push(new Error('Value not found for: ' + i));
		} else {
			data[i] = match[parts[i][1]];
		}
	}

	// Always async
	process.nextTick(function() {
		cb(errors.length ? errors : null, data);
	});

	// Chainable
	return this;
};

// Parse out language setting
WpConfig.prototype.getLanguage = function(content, cb) {

	// If content not provided, find and load the config
	if (typeof content === 'function') {
		// Re-assign callback
		cb = content;

		// Load content and re-call method
		this.load(function(err, content) {
			if (err) return cb(err);
			this.getLanguage(content, cb);
		}.bind(this));

		// Chainable
		return this;
	}

	// Try to find a match
	var match = content.match(new RegExp(util.format(defineKey, 'WPLANG')));
	if (!match) {
		// Fail on error, return en_US
		return cb(new Error('Language not found in wp-config.php'), 'en_US');
	}

	// Always async
	process.nextTick(function() {
		cb(null, match[3] || '');
	});

	// Chainable
	return this;

};
