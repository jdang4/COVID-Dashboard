var states = {
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
	  'Pennsylvania': 'PA',
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
		confirmedLabel: 'confirmed-label',
		confirmedTimeRange: 'confirmed-time-range',
		confirmedTimeStat: 'confirmed-time-stats',
		recoveredLabel: 'recovered-label',
		recoveredTimeRange: 'recovered-time-range',
		recoveredTimeStat: 'recovered-time-stats',
		deathLabel: 'death-label',
		deathTimeRange: 'death-time-range',
		deathTimeStat: 'death-time-stats',

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
			document.getElementById(HTML.stateDiv).getElementsByTagName('img')[0].src = '../res/State-flags/' + stateAbbr[state].toLowerCase() + '.png';
		},
		setTimeframeCases(caseType, specifiedDays) {
			if(caseType === 'Recovered') {

			} else if(caseType === 'Confirmed') {

			} else if(caseType === 'Deaths') {

			}
		},

	}
})();

// getDates(new Date(2020, 10, 8), new Date(2020, 11, 15));
// getTimeData('CA', new Date(2020, 5, 5), new Date(2020, 5, 10));

window.onload = function() {
	Controller;
	let HTML = Controller.getHTML();
	let setupEventListeners = () => {
		// add your event listeners
		document.getElementById(HTML.selectStates).addEventListener('change', (event) => {
			Controller.setState(event.target.value);
			Controller.setImg();
			Controller.setTotalStatistics();
			
		})

		document.getElementById(HTML.confirmedTimeRange).addEventListener('change', (event) => {

		})

		document.getElementById(HTML.recoveredTimeRange).addEventListener('change', (event) => {
			
		})

		document.getElementById(HTML.deathTimeRange).addEventListener('change', (event) => {
			
		})
	};

	let init = () => {
		console.log('Initializing...');
		setupEventListeners();
		console.log(new Date()-30).format('YYYY-MM-DD');
		Controller.setTotalStatistics();
	}
	init();
}
