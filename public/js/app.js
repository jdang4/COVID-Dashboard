var states = {
	  'alabama': 'AL',
	  'alaska': 'AK',
	  'arizona': 'AZ',
	  'arkansas': 'AR',
	  'california': 'CA',
	  'colorado': 'CO',
	  'connecticut': 'CT',
	  'delaware': 'DE',
	  'florida': 'FL',
	  'georgia': 'GA',
	  'hawaii': 'HI',
	  'idaho': 'ID',
	  'illinois': 'IL',
	  'indiana': 'IN',
	  'iowa': 'IA',
	  'kansas': 'KS',
	  'kentucky': 'KY',
	  'louisiana': 'LA',
	  'maine': 'ME',
	  'maryland': 'MD',
	  'massachusetts': 'MA',
	  'michigan': 'MI',
	  'minnesota': 'MN',
	  'mississippi': 'MS',
	  'missouri': 'MO',
	  'montana': 'MT',
	  'nebraska': 'NE',
	  'nevada': 'NV',
	  'new hampshire': 'NH',
	  'new jersey': 'NJ',
	  'new mexico': 'NM',
	  'new york': 'NY',
	  'north carolina': 'NC',
	  'north dakota': 'ND',
	  'ohio': 'OH',
	  'oklahoma': 'OK',
	  'oregon': 'OR',
	  'pennsylvania': 'PA',
	  'rhode island': 'RI',
	  'south carolina': 'SC',
	  'south dakota': 'SD',
	  'tennessee': 'TN',
	  'texas': 'TX',
	  'utah': 'UT',
	  'vermont': 'VT',
	  'virginia': 'VA',
	  'washington': 'WA',
	  'west virginia': 'WV',
	  'wisconsin': 'WI',
	  'wyoming': 'WY'
	
}

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

let Controller = (() => {
	let state = 'Alabama';
	let stateAbbr = states;

	let HTML = {
		selectStates: 'state',
		active: 'active-stats',
		confirmed: 'confirmed-stats',
		recovered: 'recovered-stats',
		death: 'death-stats',
		USState: 'state-name',
		stateDiv: 'state-div',
	};

	// define helper functions
	return {
		// functions u want to access from Controller
		getHTML() { return HTML; },
		getState() { return state; },
		setState(newState) { state = newState; },
		setTotalStatistics() {
			axios.get("https://corona.lmao.ninja/v2/states/" + state.toLowerCase() + "/").then( resp => {
				let res = resp['data'];
				
				document.getElementById(HTML.active).innerText = res.active;
				document.getElementById(HTML.confirmed).innerText = res.cases;
				document.getElementById(HTML.recovered).innerText = res.recovered;
				document.getElementById(HTML.death).innerText = res.deaths;
				document.getElementById(HTML.USState).innerText = state;

				console.log(res);
			})
		},
		async setTimeframeStatistics(startDate, endDate) { // year - month - day, pass in Date objects
			var host = 'https://api.covidtracking.com/v1/states/' + state.toLowerCase() + '/';
			var fetch = require("node-fetch");
		
			var timeframe = getDates(startDate, endDate);
		
			for(var i = 0; i < timeframe.length; i++) {
				var response = await fetch(host + timeframe[i].split('-').join('') + '.json');
				var data = await response.json();
		
				var cases = '' + data.positive;
				var deaths = '' + data.death;
				var recovered = '' + data.recovered;
				
				console.log('cases: ' + cases + ' deaths: ' + deaths + ' recovered: ' + recovered);
				
			}	
		},
		setImg() {
			document.getElementById(HTML.stateDiv).getElementsByTagName('img')[0].src = '../res/State-flags/' + stateAbbr[state.toLowerCase()].toLowerCase() + '.png';
		}

	}
})();

// getPositiveCases().then(data => console.log(data));
// getStatistics('california');
// getDates(new Date(2020, 10, 8), new Date(2020, 11, 15));
// getTimeData('CA', new Date(2020, 5, 5), new Date(2020, 5, 10));

window.onload = function() {
	Controller;
	let HTML = Controller.getHTML();
	let setupEventListeners = () => {
		// add your event listeners
		document.getElementById(HTML.selectStates).addEventListener('change', (event) => {
			Controller.setState(event.target.value);
			alert('test');
			Controller.setImg();
			Controller.setTotalStatistics();
			
		})
	};

	let init = () => {
		console.log('Initializing...');
		setupEventListeners();
		Controller.setTotalStatistics();
	}
	init();
}
