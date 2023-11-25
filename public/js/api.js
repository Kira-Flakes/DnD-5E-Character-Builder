

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
//	let format = 


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
		
		console.log(data.hit_die);
		const termdesc = JSON.stringify(data.hit_die);
		document.getElementById("statdesc").innerHTML = termdesc;
		
		console.log(data.proficiency_choices);
		var termdesc2 = JSON.stringify(data.proficiency_choices[0].desc);
		termdesc2 = termdesc2.slice(0, termdesc2.length - 1) + ": \n";
		const numOptions = JSON.stringify(data.proficiency_choices[0].from.options.length);
		const y = Number(numOptions);
		for (let x = 0; x < y; x++) {
			termdesc2 = termdesc2 + (JSON.stringify(data.proficiency_choices[0].from.options[x].item.name)).slice(8);
			termdesc2 = termdesc2.slice(0, termdesc2.length - 1) + "\n"
			}
		termdesc2 = termdesc2.slice(1);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		
		var termdesc3 = JSON.stringify(data.proficiency_choices[1].desc);
		termdesc3 = termdesc3.slice(0, termdesc3.length - 1) + ": \n";
		const numOptions2 = JSON.stringify(data.proficiency_choices[1].from.options.length);
		const y2 = Number(numOptions2);
		for (x = 0; x < y2; x++) {
			termdesc3 = termdesc3 + (JSON.stringify(data.proficiency_choices[1].from.options[x].item.name)).slice(1);
			termdesc3 = termdesc3.slice(0, termdesc3.length - 1) + "\n"
			}
		termdesc3 = termdesc3.slice(1);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.proficiencies);
		var termdesc4 = "Proficiency with: ";
		const numOptions3 = JSON.stringify(data.proficiencies.length);
		const y3 = Number(numOptions3);
			for (x = 0; x < y3; x++) {
			termdesc4 = termdesc4 + (JSON.stringify(data.proficiencies[x].name)).slice(1);
			termdesc4 = termdesc4.slice(0, termdesc4.length - 1) + "\n"
			}
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.starting_equipment);
		var termdesc5 = "Starting Equipment Locked: ";
		const numOptions4 = JSON.stringify(data.starting_equipment.length);
		const y4 = Number(numOptions4);
			for (x = 0; x < y4; x++) {
			termdesc5 = termdesc5 + (JSON.stringify(data.starting_equipment[x].equipment.name)).slice(1);
			termdesc5 = termdesc5.slice(0, termdesc5.length - 1) + "\n"
			}
		document.getElementById("statdesc5").innerHTML = termdesc5;
				
		
		console.log(data.starting_equipment_options);
		var termdesc6 = "Starting Equipment Choices: ";
		const numOptions5 = JSON.stringify(data.starting_equipment_options.length);
		const y5 = Number(numOptions5);
			for (x = 0; x < y5; x++) {
			termdesc6 = termdesc6 + (JSON.stringify(data.starting_equipment_options[x].desc)).slice(1);
			termdesc6 = termdesc6.slice(0, termdesc6.length - 1) + "\n"
			}
		document.getElementById("statdesc6").innerHTML = termdesc6;		
		
		
		
		
		
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

function backgrounds(background){												 //Function that takes an alignment and makes an API call
	
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

function weapons(wep){												 //Function that takes a feature and makes an API call
	
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
		
		console.log(data.category);
		const termdesc = JSON.stringify(data.category);
		document.getElementById("statdesc").innerHTML = termdesc;
		
		console.log(data.cost);
		const termdesc2 = JSON.stringify(data.cost);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.damage_dice);
		const termdesc3 = JSON.stringify(data.damage_dice);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.damage_type);
		const termdesc4 = JSON.stringify(data.damage_type);
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.properties);
		const termdesc5 = JSON.stringify(data.properties);
		document.getElementById("statdesc5").innerHTML = termdesc5;
  }
  
  //weapons need text added to describe value, etc.
  
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
		
		console.log(data.cost);
		const termdesc2 = JSON.stringify(data.cost);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.ac_string);
		const termdesc3 = JSON.stringify(data.ac_string);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.strength_requirement);
		const termdesc4 = JSON.stringify(data.strength_requirement);
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.stealth_disadvantage);
		const termdesc5 = JSON.stringify(data.stealth_disadvantage);
		document.getElementById("statdesc5").innerHTML = termdesc5;

  //armors need text added to describe value, etc.
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
		
		console.log(data.asi_desc);
		const termdesc2 = JSON.stringify(data.asi_desc);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.alignment);
		const termdesc3 = JSON.stringify(data.alignment);
		document.getElementById("statdesc3").innerHTML = termdesc3;

		console.log(data.size_raw);
		const termdesc4 = JSON.stringify(data.size_raw);
		document.getElementById("statdesc4").innerHTML = termdesc4;

		console.log(data.languages);
		const termdesc5 = JSON.stringify(data.languages);
		document.getElementById("statdesc5").innerHTML = termdesc5;

		console.log(data.vision);
		const termdesc6 = JSON.stringify(data.vision);
		document.getElementById("statdesc6").innerHTML = termdesc6;		
		
		console.log(data.traits);
		const termdesc7 = JSON.stringify(data.traits);
		document.getElementById("statdesc7").innerHTML = termdesc7;
		
		console.log(data.subraces);
		const termdesc8 = JSON.stringify(data.subraces);
		document.getElementById("statdesc8").innerHTML = termdesc8;
		
	})												 //using the JSON file
		

}

//races("half-orc");

function items(item){												 //Function that takes a feature and makes an API call
	
	let itemS = String(item)
	let search = API("equipment", itemS);



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
		
		console.log(data.cost);
		const termdesc2 = JSON.stringify(data.cost);
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		console.log(data.equipment_category.name);
		const termdesc3 = JSON.stringify(data.equipment_category.name);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.gear_category.name);
		const termdesc4 = JSON.stringify(data.gear_category.name);
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.contents);
		const termdesc5 = JSON.stringify(data.contents);
		document.getElementById("statdesc5").innerHTML = termdesc5;
  }
  
  )
}

//items("burglars-pack");	

function proficiencies(Class, background){												 //Function that takes a feature and makes an API call
	
	//let profS = String(Class) + "," + String(race) + "" + String(background)
	//let profT = proficienciesC(String(Class)) + proficienciesB(String(background));
	
	document.getElementById("stat").innerHTML = proficienciesC(String(Class));


  }
  //proficiencies(bard, elf, acolyte);
  
  function proficienciesB(background){												 //Function that takes a feature and makes an API call
	
	let backS = String(background)
	let search = API2("backgrounds", backS);
	let rData = "";

	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
		return response.json();
		
		} else {															 //Accounting for possible network issues
		throw new Error("Network Error");
		}
	})
	.then(data => {															 //using the JSON file
		
	
		console.log(data.skill_proficiencies);										 //Sending JSON attribute to log
		const term = JSON.stringify(data.skill_proficiencies);						 //Turning JSON attribute into a string
		//document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed
		
		console.log(data.tool_proficiencies);
		const termdesc = JSON.stringify(data.tool_proficiencies);
		//document.getElementById("statdesc").innerHTML = termdesc;
		
		rData = (term.slice(0, term.length - 1) + "\n").slice(1);
		rData = rData + ", " + (termdesc.slice(0, termdesc.length - 1) + "\n").slice(1)
		document.getElementById("statdesc2").innerHTML = rData;
		
		return rData;
		
  })
  }
  //proficienciesB("forest-dweller");
  
function proficienciesC(Class){												 //Function that takes a class and makes an API call (CURRENTLY STAT VOMIT, NEEDS TO BE FORMATTED)
	
	let classS = String(Class)
	let search = API("classes", classS);
//	let format = 
	let x = 0;
	let cData = "";
	var termdesc3 = "";

	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
		return response.json();
		
		} else {															 //Accounting for possible network issues
		throw new Error("Network Error");
		}
	})
	.then(data => {															 //using the JSON file

		
		console.log(data.proficiency_choices);
		var termdesc2 = JSON.stringify(data.proficiency_choices[0].desc);
		termdesc2 = termdesc2.slice(0, termdesc2.length - 1) + "\n";
		termdesc2 = termdesc2.slice(1);

		//document.getElementById("statdesc2").innerHTML = termdesc2;
		
		if (JSON.stringify(data.proficiency_choices[1]) != null){
		termdesc3 = JSON.stringify(data.proficiency_choices[1].desc);
		termdesc3 = termdesc3.slice(0, termdesc3.length - 1) + ": \n";
		const numOptions2 = JSON.stringify(data.proficiency_choices[1].from.options.length);
		const y2 = Number(numOptions2);
		for (x = 0; x < y2; x++) {
			termdesc3 = termdesc3 + (JSON.stringify(data.proficiency_choices[1].from.options[x].item.name)).slice(1);
			termdesc3 = termdesc3.slice(0, termdesc3.length - 1) + "\n"
			}
		termdesc3 = termdesc3.slice(1);
		//document.getElementById("statdesc3").innerHTML = termdesc3;
		}
		
		console.log(data.proficiencies);
		var termdesc4 = "";
		const numOptions3 = JSON.stringify(data.proficiencies.length);
		const y3 = Number(numOptions3);
			for (x = 0; x < y3-2; x++) {
			termdesc4 = termdesc4 + (JSON.stringify(data.proficiencies[x].name)).slice(1);
			termdesc4 = termdesc4.slice(0, termdesc4.length - 1) + "\n"
			}
		//document.getElementById("statdesc4").innerHTML = termdesc4;

		cData = termdesc2 + "- " + termdesc4 + "- " + termdesc3;
		document.getElementById("statdesc5").innerHTML = cData;
		return cData;
  })
	}