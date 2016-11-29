'use strict';

var crypto = require('crypto');

var Aes128 = function() {
    this.mode = "aes-128-cbc";
    this.iv = "asdfghjklpoiuytr";
};

Aes128.prototype.encrypt = function(key, data) {
	var self = this;
	var key  = (key instanceof Buffer) ? key : new Buffer(key, 'hex') ;

	var cipher = crypto.createCipheriv( self.mode, key, self.iv);
	var result = cipher.update(data, 'utf8', 'base64');
	result += cipher.final("base64");
	return result;
};

Aes128.prototype.decrypt = function(key, data) {
	var self = this;
	var key  = (key instanceof Buffer) ? key : new Buffer(key, 'hex') ;

	var decipher = crypto.createDecipheriv( self.mode, key, self.iv);
	var s = decipher.update(data, 'base64', 'utf8');
	var result = s + decipher.final('utf8');
	return result;
};

module.exports = new Aes128();