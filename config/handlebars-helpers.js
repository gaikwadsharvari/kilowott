/* jshint node: true, esversion: 9 */
'use strict';


var helpers = require('handlebars-helpers')();


helpers.ifEquals = function(arg1, arg2, options) {
	return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
};
helpers.ifNotEquals = function(arg1, arg2, options) {
	return (arg1 == arg2) ? options.inverse(this) : options.fn(this);
};


module.exports = helpers;