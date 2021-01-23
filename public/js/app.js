

async function getPositiveCases() {
	var fetch = require("node-fetch");

	let response = await fetch('https://api.covidtracking.com/v1/states/current.json');
	let data = await response.json();

	var posAr = new Array();

	for(var i = 0; i < Object.keys(data).length; i++) {
		var totalCases = data[i].positive;

		if(totalCases < 1) continue;
		
		posAr.push(data[i].positive);
	}

	return posAr;
}

getUsers().then(data => console.log(data));
