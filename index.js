var path = require('path');

function configFactory () {
	var THROW_ON_MISSING = false;
	function $config (dataPath, defaultValue) {
		var data = $config.$$data,
			parts = dataPath.match($config.$$PATH_RE),
			i, len = data.length,
			x, depth = parts.length,
			out;

		moduleLoop:
		for (i = 0; i < len; i++) {
			out = data[i];
			for (x = 0; x < depth; x++) {
				out = out[parts[x]];
				if (!$config.isValue(out)) {
					continue moduleLoop;
				}
			}
			return out;
		}
		if (THROW_ON_MISSING) {
			throw new Error('Missing config value for ' + dataPath);
		}
		return defaultValue;
	}

	$config.BASE = null;
	$config.$$data = [];
	$config.$$PATH_RE = /((?!\[|\]|\.(?![^\[]*\])).)+/g;

	$config.get = $config;
	$config.ENV = process.env.NODE_ENV;

	$config.isValue = function (value) {
		return (typeof value !== 'undefined') && (value !== null);
	};

	$config.load = function (configPath) {
		if (Array.isArray(configPath)) {
			for (var i = 0; i < configPath.length; i++) {
				$config.load(configPath[i]);
			}
		} else {
			if ($config.BASE) {
				configPath = path.join($config.BASE, configPath);
			}
			$config.$$data.push(require(configPath));
		}
		return $config;
	};

	$config.throwOnMissingValue = function (shouldThrow) {
		THROW_ON_MISSING = shouldThrow;
	};



	function snakeToCamel (str) {
		return str.toLowerCase()
			.replace(/_(.)/g, function (x, c) {
				return c.toUpperCase();
			});
	}

	function convertToPath (name) {
		return name.split('__').slice(1).map(snakeToCamel)
	}

	$config.loadFromEnv = function (prefix) {
		var re = new RegExp('^' + prefix);
		var data = {};
		var stack = Object
			.keys(process.env)
			.filter(function (name) {
				return re.test(name);
			})
			.forEach(function (name) {
				var path = convertToPath(name),
					last = path.pop(),
					len = path.length,
					target = data;
				for (var i = 0; i < len; i++) {
					target = target[path[i]] || (target[path[i]] = {});
				}
				target[last] = process.env[name];
			});

		$config.$$data.push(data);
	}

	$config.reset = function () {
		$config.$$data = [];
		return $config;
	};

	return $config;
}

module.exports = configFactory();
