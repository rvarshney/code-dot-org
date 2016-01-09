/**
 * @file Custom import rule for node-sass that allows us to inline plain CSS
 *       files by prefixing the import path with "CSS:" and leaving off the
 *       extension.
 *
 * @example @import "CSS:video.js/dist/video-js/video-js";
 *
 * Based on fetch/node-sass-css-importer, which in turn borrows its syntax
 * from chriseppstein/sass-css-importer.
 * @see https://github.com/chriseppstein/sass-css-importer
 * @see https://github.com/fetch/node-sass-css-importer
 */
'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// TODO: Don't duplicate these from build-css.js
var import_paths = [
  'node_modules',
  'src/css',
  '../shared/css'
];

/**
 * A node-sass importer is a function that, given a raw import URL, can
 * modify the import URL, perform the import itself, or decide not to act
 * on that particular import statement.
 * @see https://github.com/sass/node-sass#importer--v200---experimental
 *
 * A JavaScript file used as a node-sass importer should export only the
 * importer function.
 * @see https://github.com/sass/node-sass#command-line-interface
 */
module.exports = function(url, prev, done) {
  // Skip this import unless it has our special prefix.
  if (url.slice(0, 4) !== 'CSS:') {
    return done();
  }
  var css_path = url.slice(4) + '.css';

  // Add the requesting file's directory, to make relative imports work
  if (fs.existsSync(prev)) {
    import_paths.unshift(path.dirname(prev));
  }

  var possibleFilePaths = import_paths.map(function (p) {
    return path.join(p, css_path);
  });

  var firstValidPath = _.find(possibleFilePaths, function (p) {
    return fs.existsSync(p);
  });

  if (firstValidPath) {
    fs.readFile(firstValidPath, function(err, data) {
      if (err) {
        return done(err);
      }
      done({contents: data.toString()});
    });
  } else {
    return done(new Error('CSS file not found: "' + css_path + '" referenced from "' + prev + '"'));
  }
};
