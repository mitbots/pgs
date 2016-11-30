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
	pgs.setBussiness({
		"id_company":"0002",
		"id_branch":"8710",
		"user":"0002PEOP",
		"pwd":"TEMPORAL1"
	});

	pgs.setReference('AAA123');
	pgs.setAmount('25.00');

	pgs.callAPI(function(url){
		console.log( url )
	});
} catch (err) {
	console.error("Error:", err );
}
```

