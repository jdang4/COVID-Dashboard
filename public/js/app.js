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

async function setTimeframeStatistics(startDate, endDate, caseType, state) { // year - month - day, pass in Date objects
	let stateAbbr = states;
	// console.log(stateAbbr['Alabama']);
	var host = 'https://api.covidtracking.com/v1/states/' + state + '/';
	// var fetch = require("node-fetch");

	var caseData = []
	var timeframe = getDates(startDate, endDate, true);

	console.log(timeframe);
	for(var i = 0; i < timeframe.length; i++) {
		console.log(host + timeframe[i].split('-').join('') + '.json');
		var response = await fetch(host + timeframe[i].split('-').join('') + '.json');
		var data = await response.json();

		if(data.hasOwnProperty('error')) {
			continue;
		}

		if(caseType === 'Recovered') {
			var recovered = '' + data.recovered;

			caseData.push(recovered);

		} else if(caseType === 'Confirmed') {
			var positive = '' + data.positive;

			caseData.push(positive);

		} else if(caseType === 'Deaths') {
			var deaths = '' + data.death;

			caseData.push(deaths);
		}
		
		// console.log('cases: ' + cases + ' deaths: ' + deaths + ' recovered: ' + recovered);
		
	}

	// console.log(caseData);
	return caseData;
}

// fcn params are strings
function getDates(startDate, endDate, isTimeframe) {
	// const moment = require('moment');

	var dateArray = [];
	var start = moment(startDate);
	var stop = moment(endDate);

	while (start <= stop) {
		if(isTimeframe) {
			dateArray.push(moment(start).format('YYYY-MM-DD').split('-').join(''));
		} else {
			dateArray.push(moment(start).format('YYYY-MM-DD'));
		}
		start = moment(start).add(1, 'days');
	}

	// console.log(dateArray);
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
		confirmedGraph: 'confirmed-chart',

		recoveredLabel: 'recovered-label',
		recoveredTimeRange: 'recovered-time-range',
		recoveredTimeStat: 'recovered-time-stats',
		recoveredGraph: 'recovered-chart',

		deathLabel: 'death-label',
		deathTimeRange: 'death-time-range',
		deathTimeStat: 'death-time-stats',
		deathGraph: 'death-chart',

	};

	let formatNumber = (num) => { return num.toLocaleString(); }

	// define helper functions
	return {
		// functions u want to access from Controller
		getHTML() { return HTML; },
		getState() { return state; },
		setState(newState) { state = newState; },

		setTotalStatistics() {
			axios.get("https://corona.lmao.ninja/v2/states/" + state.toLowerCase() + "/").then( resp => {
				let res = resp['data'];
				
				document.getElementById(HTML.active).innerText = formatNumber(res.active);
				document.getElementById(HTML.confirmed).innerText = formatNumber(res.cases);
				document.getElementById(HTML.recovered).innerText = formatNumber(res.recovered);
				document.getElementById(HTML.death).innerText = formatNumber(res.deaths);
				document.getElementById(HTML.USState).innerText = state;

				// console.log(res);
			})
		},
		setImg() {
			document.getElementById(HTML.stateDiv).getElementsByTagName('img')[0].src = '../res/State-flags/' + stateAbbr[state].toLowerCase() + '.png';
		},
		async setTimeframeCases(caseType, specifiedDays) {

			var endDate = new Date()
			var startDate = new Date().setDate(endDate.getDate() - specifiedDays)
			
			var data = await setTimeframeStatistics(startDate, endDate, caseType, stateAbbr[state].toLowerCase());

			if(caseType === 'Recovered') {

				document.getElementById(HTML.recoveredTimeStat).innerText = formatNumber(getDifference(data));
				document.getElementById(HTML.recoveredLabel).innerText = 'Total Recovered Cases In ' + specifiedDays + ' Days';

			} else if(caseType === 'Confirmed') {

				document.getElementById(HTML.confirmedTimeStat).innerText = formatNumber(getDifference(data));
				document.getElementById(HTML.confirmedLabel).innerText = 'Total Confirmed Cases In ' + specifiedDays + ' Days';

			} else if(caseType === 'Deaths') {

				document.getElementById(HTML.deathTimeStat).innerText = formatNumber(getDifference(data));
				document.getElementById(HTML.deathLabel).innerText = 'Total Death Cases In ' + specifiedDays + ' Days';
			}
		},
		async generateGraphs(caseType, specifiedDays) {
			console.log(specifiedDays);
			var endDate = new Date()
			var startDate = new Date().setDate(endDate.getDate() - Number(specifiedDays))
			
			var dataYAxis = await setTimeframeStatistics(startDate, endDate, caseType, stateAbbr[state].toLowerCase());
			var datesXAxis = getDates(startDate, endDate, false);
			var id = '';

			if(caseType === 'Recovered') {
				id = document.getElementById(HTML.recoveredGraph);

			} else if(caseType === 'Confirmed') {
				id = document.getElementById(HTML.confirmedGraph);

			} else if(caseType === 'Deaths') {
				id = document.getElementById(HTML.deathGraph);
			}

			new Chart(id, {
				type: 'line', 
				data: {
					labels: datesXAxis,
					datasets: [{
						data: dataYAxis,
						label: caseType,
					}]
				},
				options: {
					title: {
						display: true,
						text: caseType + " Cases"
					}
				}
			});
			
		}

	}
})();

function getDifference(data) {
	return data[data.length-1] - data[0];
}

// var today = new Date()
// var priorDate = new Date().setDate(today.getDate()-30)
// console.log((new Date(priorDate)).toLocaleDateString('en-CA'));


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
			Controller.setTimeframeCases('Confirmed', document.getElementById(HTML.confirmedTimeRange).value);
			Controller.setTimeframeCases('Recovered', document.getElementById(HTML.recoveredTimeRange).value);
			Controller.setTimeframeCases('Deaths', document.getElementById(HTML.deathTimeRange).value);
			console.log(document.getElementById(HTML.confirmedTimeRange).value);
			Controller.generateGraphs('Confirmed', document.getElementById(HTML.confirmedTimeRange).value);
			Controller.generateGraphs('Recovered', document.getElementById(HTML.recoveredTimeRange).value);
			Controller.generateGraphs('Deaths', document.getElementById(HTML.deathTimeRange).value);
			Controller.setTotalStatistics();
			
		})

		document.getElementById(HTML.confirmedTimeRange).addEventListener('change', (event) => {
			Controller.setTimeframeCases('Confirmed', event.target.value);
			Controller.generateGraphs('Confirmed', event.target.value);
		})

		document.getElementById(HTML.recoveredTimeRange).addEventListener('change', (event) => {
			Controller.setTimeframeCases('Recovered', event.target.value);
			Controller.generateGraphs('Recovered', event.target.value);

		})

		document.getElementById(HTML.deathTimeRange).addEventListener('change', (event) => {
			Controller.setTimeframeCases('Deaths', event.target.value);
			Controller.generateGraphs('Deaths', event.target.value);


		})
	};

	let init = () => {
		console.log('Initializing...');
		setupEventListeners();
		Controller.setTimeframeCases('Confirmed', document.getElementById(HTML.confirmedTimeRange).value);
		Controller.setTimeframeCases('Recovered', document.getElementById(HTML.recoveredTimeRange).value);
		Controller.setTimeframeCases('Deaths', document.getElementById(HTML.deathTimeRange).value);
		Controller.setTotalStatistics();
		Controller.generateGraphs('Confirmed', document.getElementById(HTML.confirmedTimeRange).value);
		Controller.generateGraphs('Recovered', document.getElementById(HTML.recoveredTimeRange).value);
		Controller.generateGraphs('Deaths', document.getElementById(HTML.deathTimeRange).value);

	}
	init();
}
