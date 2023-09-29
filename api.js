fetch(`https://www.dnd5eapi.co/api/ability-scores/cha`).then((response) => { //API call using fetch then taking a json as a response
    if (response.ok) {														 //Check if you get a proper response since fetch only fails due to network issues
      return response.json();
	  
    } else {																 //Accounting for possible network issues
      throw new Error("Network Error");
    }
  })
  .then(data => {															 //using the JSON file
	  

	console.log(data.full_name);											 //Sending JSON attribute to log
	const term = JSON.stringify(data.full_name);							 //Turning JSON attribute into a string
	document.getElementById("stat").innerHTML = term;						 //Returning string to HTML to be displayed
	
	console.log(data.desc);
	const termdesc = JSON.stringify(data.desc);
	document.getElementById("statdesc").innerHTML = termdesc;
  }
  

  
  )