

function API(subject, specific) 											 //function def, subject is the catagory of what you are looking for, specific is the exact stat/item/spell/etc
{
	const dndAPI = "https://www.dnd5eapi.co/api/";							 //the non changing part of the call
	let sub = subject;														 //changing parts of the call
	let spec = specific;
	let call = dndAPI;														 //concatonating together the call
	call += sub + "/" + spec;
	const url = new URL(call);												 //creating new url object using concatonated string
	console.log(url);
	return call;															 //returns url object
}

//try {API("spells", "acid-arrow");} 											 // test api call function
// need to add catch for incorrect API calls



function abilityScores(stat) {												 //Function that takes an ability score stat and makes an API call

	let statS = String(stat)
	let search = API("ability-scores", statS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file


			console.log(data.full_name);										 //Sending JSON attribute to log
			const term = JSON.stringify(data.full_name);						 //Turning JSON attribute into a string
			document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed

			console.log(data.desc);
			const termdesc = JSON.stringify(data.desc);
			document.getElementById("statdesc").innerHTML = termdesc;
		}



		)
}

//abilityScores("str");															// test api call function
// need to add catch for incorrect API calls

function classes(Class) {												 //Function that takes a class and makes an API call (CURRENTLY STAT VOMIT, NEEDS TO BE FORMATTED)

	let classS = String(Class)
	let search = API("classes", classS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file


			console.log(data.name);										 //Sending JSON attribute to log
			const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
			document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed

			console.log(data.proficiency_choices);
			const termdesc = JSON.stringify(data.proficiency_choices);
			document.getElementById("statdesc").innerHTML = termdesc;
		}

			//classes("bard");	

		)
}

function spells(spell) {												 //Function that takes a spell and makes an API call

	let spellS = String(spell)
	let search = API("spells", spellS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file


			console.log(data.name);										 //Sending JSON attribute to log
			const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
			document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed

			console.log(data.desc);
			const termdesc = JSON.stringify(data.desc);
			document.getElementById("statdesc").innerHTML = termdesc;
		}



		)
}

//spells("fireball")


function features(feat) {												 //Function that takes a feature and makes an API call

	let featS = String(feat)
	let search = API("features", featS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file


			console.log(data.name);										 //Sending JSON attribute to log
			const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
			document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed

			console.log(data.desc);
			const termdesc = JSON.stringify(data.desc);
			document.getElementById("statdesc").innerHTML = termdesc;
		}



		)
}

//features("actor")

function alignments(alignment) {												 //Function that takes an alignment and makes an API call

	let alignmentS = String(alignment)
	let search = API("alignments", alignmentS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file


			console.log(data.name);										 //Sending JSON attribute to log
			const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
			document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed

			console.log(data.desc);
			const termdesc = JSON.stringify(data.desc);
			document.getElementById("statdesc").innerHTML = termdesc;
		}



		)
}

//alignments("chaotic-neutral")


//more things to add in documentation for the api


function API2(subject, specific) 											 //function def, subject is the catagory of what you are looking for, specific is the exact stat/item/spell/etc
{
	const dndAPI = "https://api.open5e.com/v1/";							 //the non changing part of the call
	let sub = subject;														 //changing parts of the call
	let spec = specific;
	let call = dndAPI;														 //concatonating together the call
	call += sub + "/" + spec;
	const url = new URL(call);												 //creating new url object using concatonated string
	console.log(url);
	return call;															 //returns url object
}

function backgrounds(background) {												 //Function that takes an alignment and makes an API call

	let backgroundS = String(background)
	let search = API2("backgrounds", backgroundS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file


			console.log(data.name);										 //Sending JSON attribute to log
			const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
			document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed

			console.log(data.desc);
			const termdesc = JSON.stringify(data.desc);
			document.getElementById("statdesc").innerHTML = termdesc;
		}


		)
}

//backgrounds("acolyte")

function weapons(wep) {												 //Function that takes a feature and makes an API call

	let wepS = String(wep)
	let search = API2("weapons", wepS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
	.then(data => {															 //using the JSON file
		
	
		console.log(data.name);										 //Sending JSON attribute to log
		const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
		document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed
		
		console.log(data.desc);
		const termdesc = JSON.stringify(data.category);
		document.getElementById("statdesc").innerHTML = termdesc;
		
		console.log(data.desc);
		const termdesc2 = JSON.stringify(data.cost);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.desc);
		const termdesc3 = JSON.stringify(data.damage_dice);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.desc);
		const termdesc4 = JSON.stringify(data.damage_type);
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.desc);
		const termdesc5 = JSON.stringify(data.weight);
		document.getElementById("statdesc5").innerHTML = termdesc5;
		
		console.log(data.desc);
		const termdesc6 = JSON.stringify(data.properties);
		document.getElementById("statdesc6").innerHTML = termdesc6;
  }
  
  //weapons need text added to describe weight, value, etc.
  
  )
}

//weapons("rapier");

function armors(arm){												 //Function that takes a feature and makes an API call
	
	let armS = String(arm)
	let search = API2("armor", armS);



	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
			return response.json();

		} else {															 //Accounting for possible network issues
			throw new Error("Network Error");
		}
	})
		.then(data => {															 //using the JSON file

		console.log(data.name);										 //Sending JSON attribute to log
		const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
		document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed
		
		console.log(data.desc);
		const termdesc = JSON.stringify(data.category);
		document.getElementById("statdesc").innerHTML = termdesc;
		
		console.log(data.desc);
		const termdesc2 = JSON.stringify(data.cost);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.desc);
		const termdesc3 = JSON.stringify(data.ac_string);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.desc);
		const termdesc4 = JSON.stringify(data.strength_requirement);
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.desc);
		const termdesc5 = JSON.stringify(data.weight);
		document.getElementById("statdesc5").innerHTML = termdesc5;
		
		console.log(data.desc);
		const termdesc6 = JSON.stringify(data.stealth_disadvantage);
		document.getElementById("statdesc6").innerHTML = termdesc6;

  //armors need text added to describe weight, value, etc.
  //Weight values not showing up due to no value being in the api, external table exists???
}
)
}
//armor("scale-mail");

function races(race){	
	
	let raceS = String(race)
	let search = API2("races", raceS);
	
	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
		return response.json();
		
		} else {															 //Accounting for possible network issues
		throw new Error("Network Error");
		}
	})
	.then(data => {
		
		console.log(data.name);	
		const term = JSON.stringify(data.name);						 //Turning JSON attribute into a string
		document.getElementById("stat").innerHTML = term;
			
		console.log(data.desc);
		const termdesc = JSON.stringify(data.desc);
		document.getElementById("statdesc").innerHTML = termdesc;
		
		console.log(data.desc);
		const termdesc2 = JSON.stringify(data.asi_desc);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.desc);
		const termdesc3 = JSON.stringify(data.alignment);
		document.getElementById("statdesc3").innerHTML = termdesc3;

		console.log(data.desc);
		const termdesc4 = JSON.stringify(data.size_raw);
		document.getElementById("statdesc4").innerHTML = termdesc4;

		console.log(data.desc);
		const termdesc5 = JSON.stringify(data.languages);
		document.getElementById("statdesc5").innerHTML = termdesc5;

		console.log(data.desc);
		const termdesc6 = JSON.stringify(data.vision);
		document.getElementById("statdesc6").innerHTML = termdesc6;		
		
		console.log(data.desc);
		const termdesc7 = JSON.stringify(data.traits);
		document.getElementById("statdesc7").innerHTML = termdesc7;
		
		console.log(data.desc);
		const termdesc8 = JSON.stringify(data.subraces);
		document.getElementById("statdesc8").innerHTML = termdesc8;
		
	})												 //using the JSON file
		

}

//races("half-orc");
