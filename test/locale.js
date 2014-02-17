var wp = require('../lib/locale'),
	path = require('path'),
	fs = require('fs'),
	rimraf = require('rimraf'),
	winston = require('winston'),
	assert = require('assert');

// The temp directory for writing
var tmpDir = path.join(__dirname, 'tmp');

// Set logger to verbose
//wp.setLogger(new winston.Logger({
//	transports: [new winston.transports.Console({level: 'verbose'})]
//}));

describe('WordPress Locale', function() {

	// These ones take a while
	this.timeout(20000);

	// Clean tmpDir before each test
	beforeEach(function() {
		rimraf.sync(tmpDir);
	});

	describe('downloadLanguageFile()', function() {
		it('should download a language file', function(done) {
			wp.downloadLanguageFile('es_ES', function(err, res) {
				assert.equal(err, null, 'threw an error');
				assert.equal(res.statusCode, 200, 'Did not return a successful response');
				assert.equal(res.req.path, '/projects/wp/dev/es/default/export-translations?format=mo', 'Did not request the correct path');
				done();
			});
		});
		it('should download a po format language file', function(done) {
			wp.downloadLanguageFile('es', 'po', function(err, res) {
				assert.equal(err, null, 'threw an error');
				assert.equal(res.statusCode, 200, 'Did not return a successful response');
				assert.equal(res.req.path, '/projects/wp/dev/es/default/export-translations?format=po', 'Did not request the correct path');
				done();
			});
		});
		it('should download a specific sub-project language file', function(done) {
			wp.downloadLanguageFile('es', 'mo', 'admin', function(err, res) {
				assert.equal(err, null, 'threw an error');
				assert.equal(res.statusCode, 200, 'Did not return a successful response');
				assert.equal(res.req.path, '/projects/wp/dev/admin/es/default/export-translations?format=mo', 'Did not request the correct path');
				done();
			});
		});
	});
	
	describe('saveLanguageFile()', function() {
		it('should save a sub-project language file', function(done) {
			wp.saveLanguageFile('es_ES', tmpDir, 'admin', function(err, savepath) {
				assert.equal(err, null, 'threw an error');
				var p = path.join(tmpDir, 'languages', 'admin-es_ES.mo');
				assert.equal(savepath, p, 'Did not save to the correct location');
				fs.exists(p, function(exists) {
					assert.ok(exists, 'File does not exist');
					done();
				});
			});
		});
		it('should save a language file in po format', function(done) {
			wp.saveLanguageFile('es_ES', tmpDir, '', 'po', function(err, savepath) {
				assert.equal(err, null, 'threw an error');
				var p = path.join(tmpDir, 'languages', 'es_ES.po');
				assert.equal(savepath, p, 'Did not save to the correct location');
				fs.exists(p, function(exists) {
					assert.ok(exists, 'File does not exist');
					done();
				});
			});
		});
	});

	describe('getLanguage()', function() {
		it('should get all files for a given language', function(done) {
			// This one takes especially long
			this.timeout(180000);

			wp.getLanguage('es_ES', tmpDir, function(err) {
				assert.equal(err, null, 'threw an error');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'es_ES.mo')), 'Did not create a file');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'admin-es_ES.mo')), 'Did not create a file');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'admin-network-es_ES.mo')), 'Did not create a file');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'themes', 'twentyeleven-es_ES.mo')), 'Did not create a file');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'themes', 'twentytwelve-es_ES.mo')), 'Did not create a file');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'themes', 'twentythirteen-es_ES.mo')), 'Did not create a file');
				assert.ok(fs.existsSync(path.join(tmpDir, 'languages', 'themes', 'twentyfourteen-es_ES.mo')), 'Did not create a file');
				done();
			});
		});
	});

});
