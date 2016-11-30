'use strict';

var crypto = require('crypto');

var Aes128 = function() {
    this.mode = "aes-128-cbc";
};

Aes128.prototype.encrypt = function(key, data) {
	var key  = (key instanceof Buffer) ? key : new Buffer(key, 'hex');
	var iv = crypto.randomBytes(16);
	var cipher = crypto.createCipheriv( this.mode, key, iv);
	var result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
	return new Buffer( result ).toString('base64');
};

Aes128.prototype.decrypt = function(key, b64_data) {
	var key  = (key instanceof Buffer) ? key : new Buffer(key, 'hex') ;
	var raw_data = new Buffer(b64_data, 'base64');
	var iv = raw_data.slice(0,16);
	var data = raw_data.slice(16);
	var decipher = crypto.createDecipheriv( this.mode, key, iv);
	var buf1 = decipher.update(data);
    var buf2 = decipher.final();
	return Buffer.concat([buf1, buf2]).toString('utf8');
};

module.exports = new Aes128();