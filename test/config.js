var WpConfig = require('../lib/config'),
	path = require('path'),
	assert = require('assert');

describe('WordPress Config', function() {

	// Create a new config object for each test
	var config;
	beforeEach(function() {
		config = new WpConfig();
	});
	
	describe('find()', function() {
		it('should report an error if it cannot find the file', function(done) {
			config.find(function(err, file) {
				assert(err, 'didn\' report an error when the file doesn\'t exist');
				done();
			});
		});
		it('should find a wp-config.php file in a directory', function(done) {
			var p = path.join(__dirname, 'mocks');
			config.find(p, function(err, file) {
				assert.equal(err, null, 'threw an error');
				assert.equal(file, path.resolve(path.join(p, 'wp-config.php')), 'did not report the right file path');
				done();
			});
		});
		it('should find a wp-config.php file one directory above the cwd', function(done) {
			var p = path.join(__dirname, 'mocks', 'dir', 'sub-dir');
			config.find(p, function(err, file) {
				assert.equal(err, null, 'threw an error');
				assert.equal(file, path.resolve(path.join(p, '..', 'wp-config.php')), 'did not report the right file path');
				done();
			});
		});
	});

	describe('load()', function() {
		it('should report an error if it cannot find the file', function(done) {
			config.load(function(err, file) {
				assert(err, 'didn\' report an error when the file doesn\'t exist');
				done();
			});
		});
		it('should find and load a wp-config.php file', function(done) {
			var p = path.join(__dirname, 'mocks');
			config.load(p, function(err, content) {
				assert.equal(err, null, 'threw an error');
				assert.equal(content.indexOf('<?php'), 0, 'did not return content');
				done();
			});
		});
	});

	describe('getDbCredentials()', function() {
		it('should find the database credentials in a given wp-config.php file', function(done) {
			var p = path.join(__dirname, 'mocks');
			config.load(p, function(err, content) {
				config.getDbCredentials(content, function(err, db) {
					assert.equal(err, null, 'threw an error');
					assert.equal(db.name, 'test_db', 'did not correctly identify database name');
					assert.equal(db.user, 'test_user', 'did not correctly identify database user');
					assert.equal(db.pass, 'test_pass', 'did not correctly identify database password');
					assert.equal(db.host, 'test_host', 'did not correctly identify database host');
					assert.equal(db.prefix, 'wp_', 'did not correctly identify database prefix');
					done();
				});
			});
		});
		it('should find the file and load the config when not passed content directly', function(done) {
			var p = path.join(__dirname, 'mocks', 'dir');
			config.load(p, function(err, content) {
				config.getDbCredentials(content, function(err, db) {
					assert.equal(err, null, 'threw an error');
					assert.equal(db.name, 'test_db', 'did not correctly identify database name');
					assert.equal(db.user, 'test_user', 'did not correctly identify database user');
					assert.equal(db.pass, 'test_pass', 'did not correctly identify database password');
					assert.equal(db.host, 'test_host', 'did not correctly identify database host');
					assert.equal(db.prefix, 'wp_', 'did not correctly identify database prefix');
					done();
				});
			});
		});
	});

	describe('getLanguage()', function() {
		it('should get the an empty string from a config file', function(done) {
			var p = path.join(__dirname, 'mocks');
			config.load(p, function(err, content) {
				config.getLanguage(content, function(err, lang) {
					assert.equal(err, null, 'threw an error');
					assert.equal(lang, '', 'did not correctly identify language');
					done();
				});
			});
		});
		it('should get the language from a config file', function(done) {
			var p = path.join(__dirname, 'mocks', 'dir');
			config.load(p, function(err, content) {
				config.getLanguage(content, function(err, lang) {
					assert.equal(err, null, 'threw an error');
					assert.equal(lang, 'es_ES', 'did not correctly identify language');
					done();
				});
			});
		});
	});
});
