var path = require('path');

function configFactory () {

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

	$config.reset = function () {
		$config.$$data = [];
		return $config;
	};

	return $config;
}

module.exports = configFactory();
