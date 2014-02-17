// Requirements
var http = require('http'),
	util = require('util'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	winston = require('winston'),
	mkdirp = require('mkdirp'),
	wpMisc = require('./misc');

// The Interface
var wpLocale = module.exports = {};

// Set the logger
var logger = winston;
wpLocale.setLogger = function(l) {
	logger = l;
};

// Subproject file names
// The key is used to build the request to translate.wordpress.org
// and the value is where to save the file.  Thei first interpolated
// value is the language code, the second is the file format
wpLocale.subProjects = {
	// Main translations file
	'': '%s.%s',
	// Admin translations
	'admin': 'admin-%s.%s',
	// Network admin translations
	'admin/network': 'admin-network-%s.%s',
	// TwentyEleven Theme Translations
	'twentyeleven': path.join('themes', 'twentyeleven-%s.%s'),
	// TwentyTwelve Theme Translations
	'twentytwelve': path.join('themes', 'twentytwelve-%s.%s'),
	// TwentyThirteen Theme Translations
	'twentythirteen': path.join('themes', 'twentythirteen-%s.%s'),
	// TwentyFourteen Theme Translations
	'twentyfourteen': path.join('themes', 'twentyfourteen-%s.%s'),
};

// Downloads a language file form translate.wordpress.org
wpLocale.downloadLanguageFile = function(language, format, subproject, cb) {
	// Sub Project is optional
	if (typeof subproject === 'function') {
		cb = subproject;
		subproject = '';
	}
	// So is format
	if (typeof format === 'function') {
		cb = format;
		subproject = '';
		format = 'mo';
	}

	// File is made up of subproject and language
	var file = (subproject != '') ? subproject + '/' + language : language;

	// Make request
	var u = url.parse(util.format(wpMisc.urls.translate, file, format));
	logger.log('verbose', 'Requesting %s', u);
	return http.get({
		hostname: u.hostname,
		path: u.path,
		// Prevents pooling which speeds up these few requests
		agent: false,
	}, function(res) {
		// Not found
		if (res.statusCode == 404) {
			// Retry with the language code with no region specifier
			if (language.indexOf('_') !== -1) {
				// es_ES => es
				language = language.split('_')[0];
				return wpLocale.downloadLanguageFile(language, format, subproject, cb);
			}
			// Not found
			return cb(res);
		}

		// Success
		cb(null, res);
	}).on('error', cb);
};

// Gets and saves a language file to the content directory
wpLocale.saveLanguageFile = function(language, contentDir, subproject, format, cb) {
	// Format defaults to .mo
	if (typeof format == 'function') {
		cb = format;
		format = 'mo';
	}
	// subproject defaults to the main file
	if (typeof subproject == 'function') {
		cb = subproject;
		format = 'mo';
		subproject = '';
	}

	logger.log('verbose', 'Downloading %s files for %s', subproject, language);
	wpLocale.downloadLanguageFile(language, format, subproject, function(err, res) {
		// Fail on error
		if (err) {
			logger.log('error', 'Error getting language file: %s', err);
			return cb(err);
		}

		// File path
		var filename = util.format(wpLocale.subProjects[subproject], language, format);
		var p = path.join(contentDir, 'languages', filename);

		// Make sure directory is there
		logger.log('verbose', 'Writing file %s', p);
		mkdirp(path.dirname(p), function() {
			// Pipe to file
			res.pipe(fs.createWriteStream(p));
			res.on('end', function() {
				cb(null, p);
			});
		});
	});

};

// Gets all sub-projects for a given language
wpLocale.getLanguage = function(language, contentDir, format, cb) {
	// Format is optional
	if (typeof format == 'function') {
		cb = format;
		format = 'mo';
	}

	logger.log('verbose', 'Downloading all language files for %s', language);
	async.each(Object.keys(wpLocale.subProjects), function(subproject, done) {
		wpLocale.saveLanguageFile(language, contentDir, subproject, format, function(err, p) {
			done();
		});
	}, function(err) {
		if (err) {
			logger.log('error', 'Error getting language files: %j', err);
			return cb(err);
		}
		cb(null);
	});

};

