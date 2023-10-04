
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
																			 
																			 
																			 
function abilityScores(stat){												 //Function that takes an ability score stat and makes an API call
	
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
																			 
function classes(Class){												 //Function that takes a class and makes an API call (CURRENTLY STAT VOMIT, NEEDS TO BE FORMATTED)
	
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

function spells(spell){												 //Function that takes a spell and makes an API call
	
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


function features(feat){												 //Function that takes a feature and makes an API call
	
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

function alignments(alignment){												 //Function that takes an alignment and makes an API call
	
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









