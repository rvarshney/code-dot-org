/**
 * The level test driver.
 * Tests collections are specified in .js files in the solutions directory.
 * To extract the xml for a test from a workspace, run the following code in
 * your console:
 * Blockly.Xml.domToText(Blockly.Xml.blockSpaceToDom(Blockly.mainBlockSpace));
 */

// todo - should we also have tests around which blocks to show as part of the
// feedback when a user gets the puzzle wrong?

var path = require('path');
var assert = require('chai').assert;
//var wrench = require('wrench');

var child_process = require('child_process');

var testUtils = require('./util/testUtils');
testUtils.setupLocales();

describe('Level tests', function() {
  var studioApp;

  beforeEach(function () {
    testUtils.setupTestBlockly();
    studioApp = testUtils.getStudioAppSingleton();
  });

  getTestCollections().forEach(function (item) {
    runTestCollection(item);
  });

});

var dataItem;

// Get all json files under directory path
function getTestCollections () {
  //var files = wrench.readdirSyncRecursive(directory);

  // require-globify transform
  var files = require('./solutions/maze/*.js', {hash: 'path'});
  var testCollections = [];
  Object.keys(files).forEach(function (file) {
    if (/data$/.test(file)) {
      console.log('got data!');
      dataItem = files[file];
    } else if (/\/2_1$/.test(file)) {
      testCollections.push({path: file, data: files[file]});
    }
  });
  return testCollections;
}

// Loads a test collection at path and runs all the tests specified in it.
function runTestCollection (item) {
  var path = item.path;
  var testCollection = item.data;

  var app = testCollection.app;

  describe(path, function () {
    testCollection.tests.forEach(function (testData, index) {
      // todo - maybe change the name of expected to make it clear what type of
      // test is being run, since we're using the same JSON files for these
      // and our getMissingRequiredBlocks tests (and likely also other things
      // in the future)
      if (index == 0 && testData.expected) {
        runTest(testCollection, testData);
      }
    });
  });
}

function runTest (testCollection, testData) {
  it(testData.description, function () {
    console.log('Running test: ' + testData.description);

    // can specify a test specific timeout in json file.
    if (testData.timeout !== undefined) {
      this.timeout(testData.timeout);
    }

    var runLevelTest = require('./util/runLevelTest');
    runLevelTest(testCollection, testData, dataItem);
    console.log('ran level test');
  });
}
