# base64codec.js

Base64 encoding/decoding library for JavaScript.

## Installation

### npm

```shell
$ npm install base64codec
```

### bower

```shell
$ bower install base64codec
```

### jam

```shell
$ jam install base64codec
```

## Usage

### NodeJS

```javascript
var base64codec = require('base64codec');
base64codec.encode('\0\0\0'); // -> 'AAAA'
base64codec.decode('AAAA'); // -> '\0\0\0'
```

### RequireJS

```javascript
require(['base64codec'], function(base64codec) {
	base64codec.encode('\0\0\0'); // -> 'AAAA'
	base64codec.decode('AAAA'); // -> '\0\0\0'
});
```

### web browsers

```javascript
window.base64codec.encode('\0\0\0'); // -> 'AAAA'
window.base64codec.decode('AAAA'); // -> '\0\0\0'
```
