var pgs = require('./pgs');

try{
	pgs.setBussiness({
		"id_company":"0002",
		"id_branch":"8710",
		"user":"0002PEOP",
		"pwd":"TEMPORAL1"
	});

	pgs.setReference('AAA123');
	pgs.setAmount('25.00');

	pgs.callAPI(function(result){
		console.log( result )
	});
} catch (err) {
	console.error("Error:", err );
}


