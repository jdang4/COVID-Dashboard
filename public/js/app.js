states = {
	  'Alabama': 'AL',
	  'Alaska': 'AK',
	  'Arizona': 'AZ',
	  'Arkansas': 'AR',
	  'California': 'CA',
	  'Colorado': 'CO',
	  'Connecticut': 'CT',
	  'Delaware': 'DE',
	  'Florida': 'FL',
	  'Georgia': 'GA',
	  'Hawaii': 'HI',
	  'Idaho': 'ID',
	  'Illinois': 'IL',
	  'Indiana': 'IN',
	  'Iowa': 'IA',
	  'Kansas': 'KS',
	  'Kentucky': 'KY',
	  'Louisiana': 'LA',
	  'Maine': 'ME',
	  'Marshall Islands': 'MH',
	  'Maryland': 'MD',
	  'Massachusetts': 'MA',
	  'Michigan': 'MI',
	  'Minnesota': 'MN',
	  'Mississippi': 'MS',
	  'Missouri': 'MO',
	  'Montana': 'MT',
	  'Nebraska': 'NE',
	  'Nevada': 'NV',
	  'New Hampshire': 'NH',
	  'New Jersey': 'NJ',
	  'New Mexico': 'NM',
	  'New York': 'NY',
	  'North Carolina': 'NC',
	  'North Dakota': 'ND',
	  'Ohio': 'OH',
	  'Oklahoma': 'OK',
	  'Oregon': 'OR',
	  'Palau': 'PW',
	  'Pennsylvania': 'PA',
	  'Puerto Rico': 'PR',
	  'Rhode Island': 'RI',
	  'South Carolina': 'SC',
	  'South Dakota': 'SD',
	  'Tennessee': 'TN',
	  'Texas': 'TX',
	  'Utah': 'UT',
	  'Vermont': 'VT',
	  'Virgin Islands': 'VI',
	  'Virginia': 'VA',
	  'Washington': 'WA',
	  'West Virginia': 'WV',
	  'Wisconsin': 'WI',
	  'Wyoming': 'WY'
	
}

let Controller = (() => {
	let state = 'Alabama';

	let HTML = {
		selectStates: 'state',
		active: 'active-stats',
		confirmed: 'confirmed-stats',
		recovered: 'recovered-stats',
		death: 'death-stats',
	};

	// define helper functions
	return {
		// functions u want to access from Controller
		getHTML() { return HTML; },
		getState() { return state; },
		setState(newState) { state = newState; }

	}
})();

// fcn params are strings
function getDates(startDate, endDate) {
	const moment = require('moment');

	var dateArray = [];
	var start = moment(startDate);
	var stop = moment(endDate);

	while (start <= stop) {
		dateArray.push(moment(start).format('YYYY-MM-DD'));
		start = moment(start).add(1, 'days');
	}

	console.log(dateArray);
	return dateArray;

}

// year - month - day, pass in Date objects
async function getTimeData(state, startDate, endDate) {
	var host = 'https://api.covidtracking.com/v1/states/' + state.toLowerCase() + '/';
	var fetch = require("node-fetch");

	var timeframe = getDates(startDate, endDate);

	for(var i = 0; i < timeframe.length; i++) {
		var response = await fetch(host + timeframe[i].split('-').join('') + '.json');
		var data = await response.json();

		var cases = data.positive;
		var deaths = '' + data.death;
		
		console.log('cases: ' + cases + ' deaths: ' + deaths);
		
	}	

}

async function getStatistics(state) {

	let response = await fetch('https://corona.lmao.ninja/v2/states/' + state);
	let data = await response.json();

	var totalCases = data.cases;
	var totalDeaths = data.deaths;
	var totalRecovered = data.recovered;

		alert('total cases: ' + totalCases.toString() + ' total deaths: ' + totalDeaths.toString() + ' total recovered: ' + totalRecovered.toString());

}

// getPositiveCases().then(data => console.log(data));
// getStatistics('california');
// getDates(new Date(2020, 10, 8), new Date(2020, 11, 15));
// getTimeData('CA', new Date(2020, 5, 5), new Date(2020, 5, 10));

window.onload = function() {
	Controller;
	let HTML = Controller.getHTML();
	let setupEventListeners = () => {
		// add your event listeners
<<<<<<< HEAD
		document.getElementById(HTML.selectStates).addEventListener('change', (event) => {
			document.getElementById(HTML.active).innerHTML = '5';
=======
		var selState = document.getElementById(HTML.selectStates);
		selState.addEventListener('change', (event) => {
			getStatistics(event.target.value);
			Controller.setState(event.target.value);
			//document.getElementById(HTML.active).innerHTML = '5';
			
>>>>>>> d27d25614f12721b315082e0a7d82ffd90a97fb3
		})
	};

	let init = () => {
		console.log('Initializing...');
		setupEventListeners();
	}
	init();
}
