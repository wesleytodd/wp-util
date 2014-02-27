// Requirements
var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	mysql = require('mysql'),
	_ = require('lodash'),
	winston = require('winston'),
	config = require('./config');

// The interface
var WpDatabase = module.exports = function(options) {

	// Extend the default options
	this.options = _.extend({}, WpDatabase.defaultOptions, options);

	// The connection
	this.db = null;

	// Logger
	this.logger = options.logger;

	// Set the credentials
	this.host = this.options.host;
	this.user = this.options.user;
	this.password = this.options.password;
	this.name = this.options.name;
	
	// Log options
	this.logger.log('verbose', 'WP Database Options: %j', this.options);

	// Call event emitter constructor
	EventEmitter.call(this);

};

// Extends Event Emiter
util.inherits(WpDatabase, EventEmitter);

WpDatabase.defaultOptions = {
	logger: winston,
	host: 'localhost',
	user: 'root',
	password: '',
	name: 'wordpress',
	prefix: 'wp_',
};

// Connect to the database
WpDatabase.prototype.connect = function(cb) {

	// Already connected
	if (this.db) {
		// Always async
		process.nextTick(function() {
			cb(null, this.db);
		}.bind(this));

		// Chainable
		return this;
	}

	// Create connection
	connection = mysql.createConnection({
		host: this.host,
		user: this.user,
		password: this.pass,
		name: this.name,
	});

	// Remove db on connection end
	connection.on('end', function() {
		this.db = null;
	}.bind(this));

	// Emit errors
	connection.on('error', function(err) {
		if (err.fatal) this.db = null;
		this.emit('error', err);
	}.bind(this));

	// Do the actual connecting
	connection.connect(function(err) {
		// Fail on error
		if (err) return cb(err);

		// Save connection
		this.db = connection;

		// Connected
		cb(null, this.db);
	}.bind(this));
};

// Connects to and creates the database
WpDatabase.prototype.createIfNotExists = function(cb) {
	// Connect
	this.connect(function(err, conn) {
		// Fail on connection error
		if (err) return cb(err);

		// Create DB
		conn.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(this.name), function(err, res) {
			// Fail on query error
			if (err) return cb(err);

			// Done
			cb(null, res);
		});

	}.bind(this));

	// Chainable
	return this;
};
