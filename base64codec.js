/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 *
 * References:
 * - http://tools.ietf.org/html/rfc3548
 */

void function(global, callback) {
	if (typeof module === 'object') {
		// For Node.
		module.exports = callback();
	} else if (typeof define === 'function') {
		// For RequireJS.
		define(callback);
	} else {
		// For web browsers.
		global.base64codec = callback();
	}
}(this, function() {
	var Buffer = (function() {
		if (typeof require === 'function') {
			var buffer = require('buffer');
			if (buffer && buffer.Buffer)
				return buffer.Buffer;
		}
		return null;
	}());

	if (Buffer !== null) {
		// For Node.
		return {
			encode: function encode(binaryString) {
				var buffer = new Buffer(binaryString + '', 'binary');
				return buffer.toString('base64');
			},
			encodeUtf8: function encodeUtf8(utf8String) {
				var buffer = new Buffer(utf8String + '', 'utf8');
				return buffer.toString('base64');
			},
			encodeBuffer: function encodeBuffer(buffer) {
				if (!(buffer instanceof Buffer)) {
					if (!(buffer instanceof ArrayBuffer)) {
						throw new Error(
							'First argument needs to be a ArrayBuffer.');
					}
					buffer = new Buffer(new Uint8Array(buffer));
				}
				return buffer.toString('base64');
			},
			decode: function decode(base64String) {
				var buffer = new Buffer(base64String + '', 'base64');
				return buffer.toString('binary');
			},
			decodeUtf8: function decodeUtf8(base64String) {
				var buffer = new Buffer(base64String + '', 'base64');
				return buffer.toString('utf8');
			},
			decodeBuffer: function decodeBuffer(base64String) {
				var buffer = new Buffer(base64String + '', 'base64');
				var array = new Uint8Array(buffer.length);
				var i = array.length;
				while (i--)
					array[i] = buffer[i];
				return array.buffer;
			}
		};
	}

	// For web browsers.

	var btoa = (function() {
		if (typeof window === 'object' && typeof window.btoa === 'function') {
			// For modern web browsers.
			return window.btoa;
		} else {
			// For the other web browsers.
			var BTOA_TABLE = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
				'abcdefghijklmnopqrstuvwxyz0123456789+/').slice('');
			return function btoa(binaryString) {
				var i = 0, l = binaryString.length, length = l - l % 3;
				var block, result = '';
				while (i < length) {
					block = (binaryString.charCodeAt(i++) & 0xFF) << 16 |
						(binaryString.charCodeAt(i++) & 0xFF) << 8 |
						(binaryString.charCodeAt(i++) & 0xFF);
					result += BTOA_TABLE[block >>> 18 & 0x3F];
					result += BTOA_TABLE[block >>> 12 & 0x3F];
					result += BTOA_TABLE[block >>> 6 & 0x3F];
					result += BTOA_TABLE[block & 0x3F];
				}
				if (i < l) {
					block = (binaryString.charCodeAt(i++) & 0xFF) << 16 |
						(i < l ? binaryString.charCodeAt(i) & 0xFF : 0) << 8;
					result += BTOA_TABLE[block >>> 18 & 0x3F];
					result += BTOA_TABLE[block >>> 12 & 0x3F];
					result += i < l ? BTOA_TABLE[block >>> 6 & 0x3F] : '=';
					result += '=';
				}
				return result;
			};
		}
	}());

	var atob = (function() {
		if (typeof window === 'object' && typeof window.atob === 'function') {
			// For modern web browsers.
			return window.atob;
		} else {
			// For the other web browsers.
			var ATOB_TABLE = {
				'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7,
				'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14,
				'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21,
				'W': 22, 'X': 23, 'Y': 24, 'Z': 25, 'a': 26, 'b': 27, 'c': 28,
				'd': 29, 'e': 30, 'f': 31, 'g': 32, 'h': 33, 'i': 34, 'j': 35,
				'k': 36, 'l': 37, 'm': 38, 'n': 39, 'o': 40, 'p': 41, 'q': 42,
				'r': 43, 's': 44, 't': 45, 'u': 46, 'v': 47, 'w': 48, 'x': 49,
				'y': 50, 'z': 51, '0': 52, '1': 53, '2': 54, '3': 55, '4': 56,
				'5': 57, '6': 58, '7': 59, '8': 60, '9': 61, '+': 62, '/': 63
			};
			return function atob(base64String) {
				base64String = base64String.replace(/[\n\r]+|=+$/g, '');
				if (/[^A-Z0-9\+\/]/i.test(base64String) ||
					base64String.length % 4 === 1) {
					throw new Error('Invalid character error.');
				}
				var i = 0, l = base64String.length, length = l - l % 4;
				var block, result = '';
				while (i < length) {
					block = ATOB_TABLE[base64String.charAt(i++)] << 18 |
						ATOB_TABLE[base64String.charAt(i++)] << 12 |
						ATOB_TABLE[base64String.charAt(i++)] << 6 |
						ATOB_TABLE[base64String.charAt(i++)];
					result += String.fromCharCode(
						block >>> 16 & 0xFF, block >>> 8 & 0xFF, block & 0xFF);
				}
				if (i < l) {
					block = ATOB_TABLE[base64String.charAt(i++)] << 18 |
						ATOB_TABLE[base64String.charAt(i++)] << 12;
					result += String.fromCharCode(block >>> 16 & 0xFF);
					if (i < l) {
						block |= base64String.charAt(i) << 6;
						result += String.fromCharCode(block >>> 8 & 0xFF);
					}
				}
				return result;
			};
		}
	}());

	var encode = function encode(binaryString) {
		return btoa(binaryString + '');
	};

	var encodeUtf8 = function encodeUtf8(utf8String) {
		var binaryString = unescape(encodeURIComponent(utf8String + ''));
		return btoa(binaryString);
	};

	var decode = function decode(base64String) {
		return atob(base64String + '');
	};

	var decodeUtf8 = function decodeUtf8(base64String) {
		var binaryString = atob(base64String + '');
		return decodeURIComponent(escape(binaryString));
	};

	if (typeof ArrayBuffer === 'function' &&
		typeof Uint8Array === 'function') {
		// For modern web browsers.
		return {
			encode: encode,
			encodeUtf8: encodeUtf8,
			encodeBuffer: function encodeBuffer(buffer) {
				if (!(buffer instanceof ArrayBuffer)) {
					throw new Error(
						'First argument needs to be a ArrayBuffer.');
				}
				var array = new Uint8Array(buffer);
				var binaryString = String.fromCharCode.apply(String, array);
				return btoa(binaryString);
			},
			decode: decode,
			decodeUtf8: decodeUtf8,
			decodeBuffer: function decodeBuffer(base64String) {
				var binaryString = atob(base64String + '');
				var i, length = binaryString.length;
				var result = new Uint8Array(length);
				for (i = 0; i < length; i++)
					result[i] = binaryString.charCodeAt(i);
				return result.buffer;
			}
		};
	}

	return {
		encode: encode,
		encodeUtf8: encodeUtf8,
		decode: decode,
		decodeUtf8: decodeUtf8
	};
});
