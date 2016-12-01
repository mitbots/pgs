var aes128 = require('./aes128');
var request = require('request');
var xmlbuilder = require('xmlbuilder');
var xml2js = require('xml2js');
var config = require('./config.json');

var Pgs = function() {
    this.canal = "W";
	this.debug = false;
	this.id = "";
	this.key = "";
	this.id_company = "";
	this.id_branch = "";
	this.user = "";
	this.pwd = "";
};

Pgs.prototype.setDebug = function( debug ) {
	this.debug = debug || false;
}

Pgs.prototype.setEndpoint = function( endpoint ) {
	this.endpoint = endpoint || "";
	
	if( !(this.endpoint)){
		var err = new Error('Todos los campos del "endpoint" son requeridos')
		throw err;
	}
}

Pgs.prototype.setCipher = function( data ) {
	this.id = data.id || "";
	this.key = data.key || "";
	
	if( !(this.id && this.key)){
		var err = new Error('Todos los campos del "cipher" son requeridos')
		throw err;
	}
}

Pgs.prototype.setBussiness = function( data ) {
	this.id_company = data.id_company || "";
	this.id_branch = data.id_branch || "";
	this.user = data.user || "";
	this.pwd = data.pwd || "";
	
	if( !(this.id_company && this.id_branch && this.user && this.pwd)){
		var err = new Error('Todos los campos del "business" son requeridos')
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
	var self = this;
	var params = {};
	
	if( !this.key || this.key.length != 32 ){
		throw new Error('Pgs - Key must have 32 characters, use setCipher() method to configure');
	}
	
	var enc_data = aes128.encrypt( this.key, this.buildData() );
	params.xml = this.buildXML( this.id, enc_data );
	
	require('request').debug = this.debug;

	var options = {
		url: this.endpoint || config.endpoint,
		form: params,
		method: "POST",
		followRedirect: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	
	request.post( options , function(error, response, data){
		if (error) {
			if( data ){
				throw new Error(data);
			}else{
				throw new Error(error);
			}
		}
		
		var xmlString = aes128.decrypt( self.key, data );
		if( xmlString ){
			var parser = new xml2js.Parser({explicitArray : false});
			parser.parseString(xmlString, function (err, result) {
				if(err){
					throw new Error(err);
				}
				
				if( result.P_RESPONSE ){
					var r = result.P_RESPONSE;
					if( r.cd_response == "success" ){
						callback( r.nb_url );
					}else{
						throw new Error('Pgs - ' + r.nb_response );
					}
				}else{
					throw new Error('Pgs - Malformated');
				}
			});	
		}else{
			throw new Error('Pgs - No response');
		}
	});
};

module.exports = new Pgs();


