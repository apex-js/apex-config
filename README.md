# apex-config
Simple configuration management

# Usage

```javascript

var CONFIG = require('apex-config');

// set the base to avoid having to use path.join
CONFIG.BASE = __dirname;

switch (CONFIG.ENV) { // defaults to process.env.NODE_ENV;
	case 'local':
		CONFIG.load('../../path/to/local-env-specific.js');
		break;
	case 'remote':
		CONFIG.load('../../path/to/remote-env-specific.js');
		break;
}

CONFIG.load('../../path/to/non-env-specific.js');

var app = require('express')();

app.listen(CONFIG('http.port'), function (err) {
	console.log('App running in env', CONFIG.ENV, ' on port ', CONFIG('http.port'));
})


```