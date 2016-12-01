var pgs = require('./pgs');
 
try{
	/*Set the endpoint (OPTIONAL)*/
	pgs.setEndpoint("https://dev5.mitec.com.mx/p/gen");
	
	/* Cipher config for communication between the app and the gateway (REQUIRED)*/
    pgs.setCipher({
        "id":"9265654571",
        "key":"CB0DC4887DD1D5CEA205E66EE934E430"
    });
	
	/* Your credentials (REQUIRED)*/
	pgs.setBussiness({
        "id_company":"0002",
        "id_branch":"8710",
        "user":"0002PEOP",
        "pwd":"TEMPORAL1"
    });
 
	/* Description/label of the payment (REQUIRED)*/
    pgs.setReference('AAA123');
	
	/* Amount of the payment (REQUIRED)*/
    pgs.setAmount('25.00');
 
	/*Set debug flag (OPTIONAL), default: false*/
	pgs.setDebug(true);
 
    pgs.callAPI(function(url){
		/* Result URL */
        console.log( url );
    });
} catch (err) {
    console.error("Error:", err );
}
