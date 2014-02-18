// Requirements
var path = require('path'),
	_ = require('lodash'),
	winston = require('winston'),
	WpConfig = require('./config'),
	WpDatabase = require('./database');

// Base object for working with a wordpress site
var WpSite = module.exports = function(options) {

	// Extend the default options
	this.options = _.extend({}, WpSite.defaultOptions, options);

	// Process basic options
	this.logger = this.options.logger;
	this.siteRoot = path.resolve(this.options.siteRootDirectory);
	this.contentDirectory = path.normalize(path.join(this.siteRoot, this.options.contentDirectory));
	this.wpBaseDirectory = path.normalize(path.join(this.siteRoot, this.options.wpBaseDirectory));

	// Log info about our settings
	this.logger.log('verbose', 'WP Site Options: %j', this.options);
	this.logger.log('verbose', 'Site Root: %s', this.siteRoot);
	this.logger.log('verbose', 'Content Directory: %s', this.contentDirectory);
	this.logger.log('verbose', 'WordPress Base Directory: %s', this.wpBaseDirectory);

	// Create a config object
	this.config = new WpConfig({
		logger: this.logger
	});

	// Create a database object
	this.database = new WpDatabase({
		logger: this.logger,
		host: options.databaseCredentials.host,
		user: options.databaseCredentials.user,
		password: options.databaseCredentials.password,
		name: options.databaseCredentials.name,
		prefix: options.databaseCredentials.prefix,
	});

};

// Defaults for a Site
WpSite.defaultOptions = {
	logger: winston,
	siteRootDirectory: process.cwd(),
	contentDirectory: 'wp-content',
	wpBaseDirectory: '.',
	databaseCredentials: {},
};
