# pgs

Payment npm module from MiTec to help chatbots developers to implement a payment gateway

( You will need production credentials to make valid payments, contact us https://www.mitec.com.mx/ )

```
npm install pgs --save
```

**demo.js**
``` [Javascript]
var pgs = require('pgs');
 
try{
	/*Set the endpoint (OPTIONAL) - Use to change between production (default) and sandbox*/
	pgs.setEndpoint("https://sandbox.wizipay.com/");
	
	/* Cipher config for communication between the app and the gateway (REQUIRED)*/
    pgs.setCipher({
        "id":"0000000001",
        "key":"82A15AEEBFFCCC911F798BB6CFCCE7E2"
    });
	
	/* Your credentials (REQUIRED)*/
	pgs.setBussiness({
        "id_company":"0001",
        "id_branch":"1000",
        "user":"DEMO",
        "pwd":"DEMO01"
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
```

