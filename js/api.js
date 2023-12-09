//Some parts of the api call functions will be used multiple times. These have had their comments ommitted due to being redundant or just the same code with a changed variable.

																			 //function for utilizing the dnd5eapi

function API(subject, specific) 											 //function def, subject is the catagory of what you are looking for, specific is the exact stat/item/spell/etc. Note that the parameters will both be strings in future functions, just with the subject being hardcoded and the specific being converted from the input parameter.
{
	const dndAPI = "https://www.dnd5eapi.co/api/";							 //the non changing part of the call
	let sub = subject;														 //changing parts of the call
	let spec = specific;
	let call = dndAPI;														 
	call += sub + "/" + spec;												 //concatonating together the call into the proper url format
	const url = new URL(call);												 //creating new url object using concatonated string
	console.log(url);
	return call;															 //returns url object
}
																			//Note that in the comments, when "makes an api call" is used, it means that you are using a function that inserts strings into this calls paramters, and returns string data from the api. Frequently but not always, this includes having that text printed to the html or occasionally formatted beforehand or returned in a variable to be used in another function.
//try {API("spells", "acid-arrow");} 											 // test api call function. As this is used in the HTML, it is commented out in the javascript.
																			 // need to add catch for incorrect API calls
																			 
																			 
																			 
function abilityScores(stat){												 //Function that takes an ability score stat and makes an API call using the API function. Note that all functions until the creation of the API2 call will use the original API function call.
	
	let statS = String(stat)												//it is necessary to turn input parameters into strings for them to work with the API call. This is used very frequently in further functions.
	let search = API("ability-scores", statS);								//API call. Note that the catagory of what the API call is looking for is hard coded to the function and the specific entry is variable and turned into a string. As this and the above lines are the same format for pretty much every function from here on, they will be ommitted from comments.


																			 //Note that while the following section from fetch to .then(data => { are used in every function, they will be ommitted after this point from comments.
	fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
		if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
		return response.json();
		
		} else {															 //Accounting for possible network issues
		throw new Error("Network Error");
		}
	})
	.then(data => {															 //using the JSON file
		
																			 //These sections repeat frequently, and so will often be ommited from comments. To summarize, the first line returns the data from that part of the api to the browswer console so you can see it in the develepor mode/inspect element. It does not affect code functionality and is only there for debugging purposes. The second section is converting the same data into a string to be used by the function. The third is outputting the information to the html file in the corresponding tag in the HTML. The number of 3 line "blocks" of this nature depend on the amount of parts from the API we wish to draw information from, and if formatting is required it will often occure after the second line. If the info does not need to appear in the html, the third line may be commented out as this line is still used for debugging/testing.
		console.log(data.full_name);										 //Sending JSON attribute to log
		const term = JSON.stringify(data.full_name);						 //Turning JSON attribute into a string
		document.getElementById("stat").innerHTML = term;					 //Returning string to HTML to be displayed
		
		console.log(data.desc);
		const termdesc = JSON.stringify(data.desc);
		document.getElementById("statdesc").innerHTML = termdesc;
  }
  
  
  
  )
}

//abilityScores("str");															// test ability scores function. As every function has a commented out call that would be used in the HTML, from this point onwards these will be ommitted from comments.  The parameter will be changed depending on what the person coding the html is trying to call.

																			 
function classes(Class){												 //Function that takes a class and makes an API call
	
	let classS = String(Class)
	let search = API("classes", classS);


	fetch(search).then((response) => { 										
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
		console.log(data.hit_die);
		const termdesc = JSON.stringify(data.hit_die);
		document.getElementById("statdesc").innerHTML = termdesc;
		
		console.log(data.proficiency_choices);                                                                             //this section is made to compile proficiency choices for skill into a string and return that to the statdesc2 variable in the html. the [0] is a reference to the api array position, and is used for every class to store proficiencies.
		var termdesc2 = JSON.stringify(data.proficiency_choices[0].desc);												   //this format is used a few more times and uses multiple similarly names variables to avoid causing conflicts. Note the "var" instead of const since these need to change to collect additions to the string list.
		termdesc2 = termdesc2.slice(0, termdesc2.length - 1) + ": \n";                                                     //this line is used to remove unecessary text from the end of the string and add a colon and new line for readability
		const numOptions = JSON.stringify(data.proficiency_choices[0].from.options.length);                                //this line is used to find the number of proficiencies by returning the length of the array for them and return the result as a string
		const y = Number(numOptions);  																					   //this line is used to set the result above as an integer. This is necessary to allow it to be used as number of repititions for the following loop.
		for (let x = 0; x < y; x++) {																					   //this loop removes unnecessary text from each element in the array of proficiencies, usually the quotation marks, then add them to the aggregating string object
			termdesc2 = termdesc2 + (JSON.stringify(data.proficiency_choices[0].from.options[x].item.name)).slice(8);
			termdesc2 = termdesc2.slice(0, termdesc2.length - 1) + "\n"
			}
		termdesc2 = termdesc2.slice(1);																					   //like the other line, this one removes an unecessary character but at the beginning
		document.getElementById("statdesc2").innerHTML = termdesc2;
		
		
		var termdesc3 = JSON.stringify(data.proficiency_choices[1].desc);												   //this section is much like the above section, only that the format is slightly different and this second array element is only found on the bard class for their instruments.
		termdesc3 = termdesc3.slice(0, termdesc3.length - 1) + ": \n";
		const numOptions2 = JSON.stringify(data.proficiency_choices[1].from.options.length);
		const y2 = Number(numOptions2);
		for (x = 0; x < y2; x++) {
			termdesc3 = termdesc3 + (JSON.stringify(data.proficiency_choices[1].from.options[x].item.name)).slice(1);
			termdesc3 = termdesc3.slice(0, termdesc3.length - 1) + "\n"
			}
		termdesc3 = termdesc3.slice(1);
		document.getElementById("statdesc3").innerHTML = termdesc3;
		
		console.log(data.proficiencies);                                                                                   //this section is like the ones above but is for proficiencies in weapons, armor, and saving throws that are not choices
		var termdesc4 = "Proficiency with: ";
		const numOptions3 = JSON.stringify(data.proficiencies.length);
		const y3 = Number(numOptions3);
			for (x = 0; x < y3; x++) {
			termdesc4 = termdesc4 + (JSON.stringify(data.proficiencies[x].name)).slice(1);
			termdesc4 = termdesc4.slice(0, termdesc4.length - 1) + "\n"
			}
		document.getElementById("statdesc4").innerHTML = termdesc4;
		
		console.log(data.starting_equipment);																			   //this section is like the one above but for default starting equipment
		var termdesc5 = "Starting Equipment Locked: ";
		const numOptions4 = JSON.stringify(data.starting_equipment.length);
		const y4 = Number(numOptions4);
			for (x = 0; x < y4; x++) {
			termdesc5 = termdesc5 + (JSON.stringify(data.starting_equipment[x].equipment.name)).slice(1);
			termdesc5 = termdesc5.slice(0, termdesc5.length - 1) + "\n"
			}
		document.getElementById("statdesc5").innerHTML = termdesc5;
				
		
		console.log(data.starting_equipment_options);																	  //this section is like the one above but for the options you get with starting equipment
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

function spells(spell){												 //Function that takes a spell and makes an API call. It is much the same as the ability scores call. Functions with sufficient similarities like this one will have comments ommitted
	
	let spellS = String(spell)
	let search = API("spells", spellS);



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
		console.log(data.desc);
		const termdesc = JSON.stringify(data.desc);
		document.getElementById("statdesc").innerHTML = termdesc;
  }
  
  
  
  )
}

//spells("fireball")


function features(feat){												 //Function that takes a feature and makes an API call.
	
	let featS = String(feat)
	let search = API("features", featS);



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
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



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
		console.log(data.desc);
		const termdesc = JSON.stringify(data.desc);
		document.getElementById("statdesc").innerHTML = termdesc;
  }
  
  
  
  )
}

//alignments("chaotic-neutral")

																			 //function for api calls using the open 5e api. it is functionally identical to the other api call and so comments for it will be ommitted, but there are slight changes in the API's format and as such some specific future calls may be affected.

function API2(subject, specific) 											 
{
	const dndAPI = "https://api.open5e.com/v1/";							 
	let sub = subject;														
	let spec = specific;
	let call = dndAPI;														 
	call += sub + "/" + spec;
	const url = new URL(call);												 
	console.log(url);
	return call;															 
}

function backgrounds(background){												 //Function that takes a background and makes an API call using the API2 function. The API function is the only difference compared to previous API call functions in terms of format.
	
	let backgroundS = String(background)
	let search = API2("backgrounds", backgroundS);



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
		console.log(data.desc);
		const termdesc = JSON.stringify(data.desc);
		document.getElementById("statdesc").innerHTML = termdesc;
  }


)
}

//backgrounds("acolyte")

function weapons(wep){												 //Function that takes a weapon and makes an API call.
	
	let wepS = String(wep)
	let search = API2("weapons", wepS);



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
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
  

  )
}

//weapons("rapier");

function armors(arm){												 //Function that takes an armor and makes an API call
	
	let armS = String(arm)
	let search = API2("armor", armS);



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 

		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 
		
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

}
)
}
//armor("scale-mail");

function races(race){												//Function that takes a race and makes an api call
	
	let raceS = String(race)
	let search = API2("races", raceS);
	
	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {
		
		console.log(data.name);	
		const term = JSON.stringify(data.name);						 
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
		
	})												
		

}

//races("half-orc");

function items(item){												 //Function that takes a feature and makes an API call
	
	let itemS = String(item)
	let search = API("equipment", itemS);



	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.name);										 
		const term = JSON.stringify(data.name);						 
		document.getElementById("stat").innerHTML = term;					 

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
		
		console.log(data.contents);															//Note here that if the item called is a "pack" item, the information will be delivered with excessive additional information from the array in it's entirety.  This was first encountered in the class call but while that has been formatted time constraints meant this one is not. The function will look fine for any non "pack" item.
		const termdesc5 = JSON.stringify(data.contents);
		document.getElementById("statdesc5").innerHTML = termdesc5;
  }
  
  )
}

//items("burglars-pack");	

/*function proficiencies(Class, race, background){												 //Function that takes a combination of class, race, and background, and calls three seperate functions to provide sum proficiencies. As Simon had made spreadsheets and John had implemented proficiencies, this call is not used in the final product though calls it would have called still exist and function.
	
	let profS = String(Class) + "," + String(race) + "" + String(background)
	let profT = proficienciesC(String(Class)) + proficienciesB(String(background));
	
	document.getElementById("stat").innerHTML = proficienciesC(String(Class));


  }
  //proficiencies(bard, elf, acolyte);
  */
  
  function proficienciesB(background){												 //Function that takes the background and provides proficiencies for it. As this uses the API2 call from open5e, the format is different and allows to simply pull out the proficiencies. As the call that would have relied on this is not used, this code is not used either but does function
	
	let backS = String(background)
	let search = API2("backgrounds", backS);
	let rData = "";																	 //Data variables are used to return collect total proficiencies and return that as a string that would have been used in the overarching function. They have different starting letters to differentiate them from strings that contain different data.

	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 
		
	
		console.log(data.skill_proficiencies);										 
		const term = JSON.stringify(data.skill_proficiencies);						 
		//document.getElementById("stat").innerHTML = term;					 		//since these lines are used to write to the html and this function should not print anything to the html, these lines are only here for testing purposes and have been commented out
		
		console.log(data.tool_proficiencies);
		const termdesc = JSON.stringify(data.tool_proficiencies);
		//document.getElementById("statdesc").innerHTML = termdesc;
		
		rData = (term.slice(0, term.length - 1) + "\n").slice(1);
		rData = rData + ", " + (termdesc.slice(0, termdesc.length - 1) + "\n").slice(1)
		//document.getElementById("statdesc2").innerHTML = rData;
		
		return rData;
		
  })
  }
  //proficienciesB("forest-dweller");
  
function proficienciesC(Class){												 //Function that takes a class and makes an API call. As this uses the original API call, the formatting is much the same as the class function call but only provides proficiencies. Like the last function, it is not used in the final product but is still functional.
	
	let classS = String(Class)
	let search = API("classes", classS);
//	let format = 
	let x = 0;
	let cData = "";
	var termdesc3 = "";

	fetch(search).then((response) => { 										 
		if (response.ok) {													 
		return response.json();
		
		} else {															 
		throw new Error("Network Error");
		}
	})
	.then(data => {															 

		
		console.log(data.proficiency_choices);
		var termdesc2 = JSON.stringify(data.proficiency_choices[0].desc);
		termdesc2 = termdesc2.slice(0, termdesc2.length - 1) + "\n";
		termdesc2 = termdesc2.slice(1);

		//document.getElementById("statdesc2").innerHTML = termdesc2;     //only used to output to html for testing purposes
		
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
		//document.getElementById("statdesc5").innerHTML = cData;
		return cData;
  })
	}
	
	//note a similar call would have been made here for the third function for the race profficiencies but that was never implemented.