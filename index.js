// Copyright (c) 2015-2017 David M. Lee, II
'use strict';

/**
 * Local reference to TimeoutError
 * @private
 */
var TimeoutError;

/**
 * Rejects a promise with a {@link TimeoutError} if it does not settle within
 * the specified timeout. (Note: parameter order is arbitrary)
 *
 * @param {Promise} promise The promise.
 * @param {number} timeoutMillis Number of milliseconds to wait on settling.
 * @returns {Promise} representing the given promise or a timeout
 */
var timeout = module.exports.timeout = function(promise, timeoutMillis) {
  var error = new TimeoutError(),
      timeout;

  if ('object' == typeof timeoutMillis && 'number' == typeof promise) {
    let timeoutMillis_ = promise;
    promise = timeoutMillis;
    timeoutMillis = timeoutMillis_;
  }

  return Promise.race([
    promise,
    new Promise(function(resolve, reject) {
      timeout = setTimeout(function() {
        reject(error);
      }, timeoutMillis);
    }),
  ]).then(function(v) {
    clearTimeout(timeout);
    return v;
  }, function(err) {
    clearTimeout(timeout);
    throw err;
  });
};

/**
 * Exception indicating that the timeout expired.
 */
TimeoutError = module.exports.TimeoutError = function() {
  Error.call(this)
  Error.captureStackTrace(this, timeout);
  this.message = 'Timeout';
};

require('util').inherits(TimeoutError, Error);
