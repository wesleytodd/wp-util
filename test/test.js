var wp = require('../lib/index.js'),
	fs = require('fs'),
	assert = require('assert');

describe('WordPress Utilities', function() {

	describe('Mist Helpers', function() {
		it('getSaltKeys() should correctly retreive salt keys', function(done) {
			this.timeout(10000);
			wp.getSaltKeys(function(err, keys) {
				assert.equal(err, null, 'threw an error.');
				assert(keys, 'did not return the keys');
				assert.equal(typeof keys, 'string', 'did not return the keys as a string');
				assert.equal(keys.indexOf('AUTH_KEY'), 8, 'did not return something that looks like salt keys');
				done();
			});
		});
		it('getCurrentVersion() should correctly retreive salt keys', function(done) {
			this.timeout(10000);
			wp.getCurrentVersion(function(err, ver) {
				assert.equal(err, null, 'threw an error.');
				assert(ver, 'did not return a version');
				assert(/\d+\.\d+\.\d+/.match(ver), 'did not return something that looks like version');
				done();
			});
		});
	});

	describe('Config Helpers', function() {

		describe('findFile()', function() {
			it('should report an error if it cannot find the file', function(done) {
				wp.config.findFile(function(err, file) {
					assert(err, 'didn\' report an error when the file doesn\'t exist');
					assert.equal(file, null, 'did not return null when cannot find the file');
					done();
				});
			});
			it('should find a wp-config.php file in the cwd', function(done) {
				wp.config.findFile('./test/mocks/dir', function(err, file) {
					assert.equal(err, null, 'threw an error');
					assert.equal(file, 'test/mocks/dir/wp-config.php', 'did not report the right file path');
					done();
				});
			});
			it('should find a wp-config.php file one directory above the cwd', function(done) {
				wp.config.findFile('./test/mocks/other-dir', function(err, file) {
					assert.equal(err, null, 'threw an error');
					assert.equal(file, 'test/mocks/wp-config.php', 'did not report the right file path');
					done();
				});
			});
		});
		
		describe('loadFile()', function() {
			it('should report an error if it cannot find the file', function(done) {
				wp.config.loadFile(function(err, file) {
					assert(err, 'didn\' report an error when the file doesn\'t exist');
					done();
				});
			});
			it('should return the file content of the config file', function(done) {
				wp.config.loadFile('./test/mocks/dir', function(err, content) {
					assert.equal(err, null, 'threw an error');
					assert.equal(content, fs.readFileSync('./test/mocks/dir/wp-config.php', {encoding: 'utf8'}), 'did not return the contents of the file correctly');
					done();
				});
			});
		});

		describe('getDbCredentials()', function() {
			it('should find the database credentials in a given wp-config.php file', function(done) {
				wp.config.loadFile('./test/mocks/dir', function(err, content) {
					wp.config.getDbCredentials(content, function(err, db) {
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
				var cwd = process.cwd();
				process.chdir('test/mocks');
				wp.config.getDbCredentials(function(err, db) {
					assert.equal(err, null, 'threw an error');
					assert.equal(db.name, 'test_db', 'did not correctly identify database name');
					assert.equal(db.user, 'test_user', 'did not correctly identify database user');
					assert.equal(db.pass, 'test_pass', 'did not correctly identify database password');
					assert.equal(db.host, 'test_host', 'did not correctly identify database host');
					assert.equal(db.prefix, 'wp_', 'did not correctly identify database prefix');
					process.chdir(cwd);
					done();
				});
			});
		});

	});

});
