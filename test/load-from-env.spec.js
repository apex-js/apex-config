/* eslint-env mocha */
var CONFIG = require('..');
var expect = require('chai').expect;

function toSnakeCase (str) {
	return str.replace(/([A-Z])/g, '_$1').toUpperCase();
}

function objectToEnv (data, prefix, out) {
	out = out || {};
	return Object
		.keys(data)
		.reduce(function (out, key) {
			var value = data[key];
			var name = prefix + '__' + toSnakeCase(key);
			if (typeof value === 'object' && value) {
				return objectToEnv(value, name, out);
			}
			out[name] = value;
			return out;
		}, out);
}

var originalEnv = process.env;

describe('loadFromEnv', function () {
	it('loads data from environment variables ', function () {
		process.env = Object.create(originalEnv);
		objectToEnv({
			server: {
				port: 1234,
				useSsl: true,
				someThingCapitalized: 'asdf'
			}
		}, 'TEST', process.env);
		CONFIG.loadFromEnv('TEST');

		expect(CONFIG('server.port')).to.eql(1234);
		expect(CONFIG('server.useSsl')).to.eql(true);
		expect(CONFIG('server.someThingCapitalized')).to.eql('asdf');
	});
});



