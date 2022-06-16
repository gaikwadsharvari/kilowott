/* jshint node: true, esversion: 9 */
'use strict';

var convict = require('convict');

var conf = convict({
	notifier: {
		emailer: {
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'sharvari.v.gaikwad@gmail.com',
				pass: ''
			}
		}
	}
});

conf.validate();
module.exports = conf;
