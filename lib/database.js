// Requirements
var mysql = require('mysql'),
	config = require('./config');

// The interface
var wpUtilDatabase = module.exports = {};

// Connect to the database
var connectionInstances = {};
wpUtilDatabase.connect = function(creds, cb) {
	// Create a key for this connection
	var key = '' + creds.host + creds.user + creds.pass;

	// Check the connection cache
	if (typeof connectionInstances[key] !== 'undefined') {
		return cb(null, connectionInstances[key]);
	}

	// Create connection
	var connection = mysql.createConnection({
		host     : creds.host,
		user     : creds.user,
		password : creds.pass
	});

	// Remove from connection cache on closing connection
	connection.on('end', function() {
		delete connectionInstances[key];
	});

	// Do the actual connecting
	connection.connect(function(err) {
		if (err) return cb(err, null);
		connectionInstances[key] = connection;
		cb(err, connection);
	});
};

// Connects to and creates the database
wpUtilDatabase.createIfNotExists = function(creds, cb) {
	// Connect
	wpUtilDatabase.connect(creds, function(err, conn) {
		if (err) return cb(err);
		// Create DB
		conn.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(creds.name), function(err) {
			if (err) return cb(err);
			conn.end(cb);
		});
	});
};
