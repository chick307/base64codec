/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var assert;
if (assert == null)
	assert = require('assert');

var base64codec;
if (base64codec == null)
	base64codec = require('..');

var hasTypedArray = typeof ArrayBuffer !== 'undefined' &&
	typeof Uint8Array !== 'undefined';

describe('base64codec', function() {
	describe('encode', function() {
		it('\\0', function() {
			assert.strictEqual(base64codec.encode('\0'), 'AA==');
		});

		it('\\0\\0', function() {
			assert.strictEqual(base64codec.encode('\0\0'), 'AAA=');
		});

		it('\\0\\0\\0', function() {
			assert.strictEqual(base64codec.encode('\0\0\0'), 'AAAA');
		});

		it('ABCDEFG', function() {
			assert.strictEqual(base64codec.encode('ABCDEFG'), 'QUJDREVGRw==');
		});
	});

	describe('encodeUtf8', function() {
		it('あいうえお', function() {
			assert.strictEqual(
				base64codec.encodeUtf8('あいうえお'), '44GC44GE44GG44GI44GK');
		});
	});

	describe('encodeBuffer', function() {
		if (!hasTypedArray)
			return;

		var aiueo;

		before(function() {
			aiueo = new Uint8Array([0xE3, 0x81, 0x82, 0xE3,
				0x81, 0x84, 0xE3, 0x81, 0x86, 0xE3, 0x81,
				0x88, 0xE3, 0x81, 0x8A]).buffer;
		});

		it('あいうえお', function() {
			assert.strictEqual(
				base64codec.encodeBuffer(aiueo), '44GC44GE44GG44GI44GK');
		});

		context('when passed the large buffer', function() {
			it('does not throw `RangeError`', function() {
				assert.doesNotThrow(function() {
					var largeBuffer = new ArrayBuffer(1000000);
					assert.doesNotThrow(function() {
						base64codec.encodeBuffer(largeBuffer);
					});
				});
			});
		});
	});

	describe('decode', function() {
		it('AA==', function() {
			assert.strictEqual(base64codec.decode('AA=='), '\0');
		});

		it('AAA', function() {
			assert.strictEqual(base64codec.decode('AAA'), '\0\0');
		});

		it('AAA=', function() {
			assert.strictEqual(base64codec.decode('AAA='), '\0\0');
		});

		it('AAAA', function() {
			assert.strictEqual(base64codec.decode('AAAA'), '\0\0\0');
		});

		it('QUJDREVGRw==', function() {
			assert.strictEqual(base64codec.decode('QUJDREVGRw=='), 'ABCDEFG');
		});
	});

	describe('decodeUtf8', function() {
		it('44GC44GE44GG44GI44GK', function() {
			assert.strictEqual(
				base64codec.decodeUtf8('44GC44GE44GG44GI44GK'), 'あいうえお');
		});
	});

	describe('decodeBuffer', function() {
		if (!hasTypedArray)
			return;

		it('44GC44GE44GG44GI44GK', function() {
			var buffer = base64codec.decodeBuffer('44GC44GE44GG44GI44GK');
			assert(buffer instanceof ArrayBuffer,
				'The return value needs to be a ArrayBuffer.');
			assert.strictEqual(buffer.byteLength, 15);

			var array = new Uint8Array(buffer);
			assert.deepEqual(array, new Uint8Array([
				0xE3, 0x81, 0x82, 0xE3, 0x81, 0x84, 0xE3, 0x81,
				0x86, 0xE3, 0x81, 0x88, 0xE3, 0x81, 0x8A]));
		});
	});

	describe('decode (strip line-feed)', function() {
		it('AA\\nAA', function() {
			assert.strictEqual(base64codec.decode('AA\nAA'), '\0\0\0');
		});
	});

	describe('decodeUtf8 (strip line-feed)', function() {
		it('AA\\nAA', function() {
			assert.strictEqual(base64codec.decodeUtf8('AA\nAA'), '\0\0\0');
		});
	});

	describe('decodeBuffer (strip line-feed)', function() {
		if (!hasTypedArray)
			return;

		it('AA\\nAA', function() {
			var buffer = base64codec.decodeBuffer('AA\nAA');
			var array = new Uint8Array(buffer);
			assert.deepEqual(array, new Uint8Array([0, 0, 0]));
		});
	});

	describe('decode (strip line-feed) throws Error', function() {
		it('AA\\nAA', function() {
			var base64String = 'AA\nAA';
			var options = {stripLinefeed: false};
			assert.throws(function() {
				base64codec.decode(base64String, options);
			});
		});
	});

	describe('decodeUtf8 (strip line-feed) throws Error', function() {
		it('AA\\nAA', function() {
			var base64String = 'AA\nAA';
			var options = {stripLinefeed: false};
			assert.throws(function() {
				base64codec.decodeUtf8(base64String, options);
			});
		});
	});

	describe('decodeBuffer (strip line-feed) throws Error', function() {
		if (!hasTypedArray)
			return;

		it('AA\\nAA', function() {
			var base64String = 'AA\nAA';
			var options = {stripLinefeed: false};
			assert.throws(function() {
				base64codec.decodeBuffer(base64String, options);
			});
		});
	});

	describe('issue#3', function() {
		var base64String = 'cyJ9XX0=';
		var expected = 's"}]}';

		it('decode(' + JSON.stringify(base64String) + ')', function() {
			var actual = base64codec.decode(base64String);
			assert.strictEqual(actual, expected);
		});
	});
});
