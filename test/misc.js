var wp = require('../lib/misc'),
	assert = require('assert');

describe('Misc Helpers', function() {
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
			assert(ver.match(/\d\.\d\.\d/), 'did not return something that looks like version');
			done();
		});
	});
});
