var aes128 = require('./aes128');
var request = require('request');
var xmlbuilder = require('xmlbuilder');
var xml2js = require('xml2js');
var config = require('./config.json');

var Pgs = function() {
    this.canal = "W";
};

Pgs.prototype.setBussiness = function( data ) {
	this.id_company = data.id_company || "";
	this.id_branch = data.id_branch || "";
	this.user = data.user || "";
	this.pwd = data.pwd || "";
	
	if( !(this.id_company && this.id_branch && this.user && this.pwd)){
		var err = new Error('Todos los cambios del "business" son requeridos')
		throw err;
	}
};

Pgs.prototype.setReference = function( reference ) {
	this.reference = reference;
};

Pgs.prototype.setAmount = function( amount ) {
	this.amount = amount;
};

Pgs.prototype.buildXML = function( id, data ) {
	var pgs = xmlbuilder.create('pgs',{version: '1.0'});
	pgs.ele('data0').txt(id);
	pgs.ele('data').txt(data);
	return pgs.end();
};

Pgs.prototype.buildData = function() {
	var p = xmlbuilder.create('P',{version: '1.0', encoding: 'UTF-8', standalone: true});
	var business = p.ele('business');
	business.ele('id_company').txt(this.id_company);
	business.ele('id_branch').txt(this.id_branch);
	business.ele('user').txt(this.user);
	business.ele('pwd').txt(this.pwd);
	
	var url = p.ele('url');
	url.ele('reference').txt( this.reference );
	url.ele('amount').txt( this.amount );
	url.ele('canal').txt( this.canal );
	
	return p.end();
};

Pgs.prototype.callAPI = function( callback ) {
	var params = {};
	var enc_data = aes128.encrypt( config.key, this.buildData() );
	params.xml = this.buildXML( config.id, enc_data );
	
	require('request').debug = true;
	
	//params.xml = '<?xml version="1.0"?><pgs><data0>9265654571</data0><data>fpv90LcuzLc1qwS+oV0O7K4NaaAbjlrQwWpAJykNMDyNR6TNaMQOhe2E+Q9JutkquGxTQo9107Ux/bBEMVScwY/iHBnehhTWVPcFHwmkKKaOf7A1Z8Lkv0RH6dFlSBtgd3SIGzyGyrl5r4Usq4nVI9kZ0vPdFsKwMDQlbVso6gW414pZGWclHOD63LLn1VEu+dnADxRapvdt1KbXwhZoKsWA7EMzDxW6MI0vyRypQ9IquPOFgM9CmQbPpyMtbZeK2pXrIj+TRIgDrSVRuf7cR7J9dHB71Km3v5ioFZbbq9wWeaHQDhSWbU28mh6EvHpTnOHUsdR384bl4svynGC2F980zISZgI00usKigGfSksHRR151mYNq3OZU0A6Nn4zl</data></pgs>';
	
	var options = {
		url: config.endpoint,
		form: params,
		method: "POST",
		followRedirect: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	
	request.post( options , function(error, response, data){
		if (error) {
			throw new Error(error);
		}
	
		console.log( data );
	
		var xmlString = aes128.decrypt( config.key, data );
		if( xmlString ){
			var parser = new xml2js.Parser();
			parser.parseString(xmlString, function (err, result) {
				if(err){
					throw new Error(err);
				}
				
				callback( result );
			});	
		}else{
			throw new Error('Pgs - No response');
		}
	});
};

module.exports = new Pgs();


