// characterSheet.js - John Gilbert
// This file should represent the entirety of a character sheet, 
// with all attributes.

// TODO: Figure out where we want to do value checking
// NOTE: Naming conventions are VITAL. Everything breaks if we aren't careful.
//  Strings: _<stringname>
//  ints: ???
//  ints with dependencies: ???

// Grabs user input based on the id of its input tag and stores 
// it in local storage with the same key name as the input id
function storeKeyFromInput(inputID) {

  /* Handles text input */
  if (document.getElementById(inputID) == null) {
    var userInput = document.querySelector(`input[name="${inputID}"]:checked`).value;
  }
  /* Handles radio input bubbles */
  else {
    var userInput = document.getElementById(inputID).value;
  }

  localStorage.setItem(inputID, userInput);
}

// Object represents the character sheet values
class characterSheet {

  constructor() {

    // all values are initialized first from the blank character sheet.
    // allows for us to use placeholders. NOTE: This can be simplified later 
    this._name = "";
    this._classlevel = "";
    this._background = "";
    this._playername = "";
    this._race = "";
    this._alignment = "";
    this._experiencepts = "";
    this._dex = 0;
    this._constitution = 0;
    this._wisdom = 0;
    this._intellegence = 0;
    this._charisma = 0;
  }

  // Getter method to retrieve the character's name.
  getCharacterName() {
    return this._name;
  }

  // Setter method to set the character's name.
  setCharacterName(newName) {
    console.log(typeof newName);
    if (typeof newName === 'string') {
      this._name = newName;
      localStorage.setItem("_name", newName);
      this.updateSheet();
    } else {
      console.error('Invalid name format. Name must be a string.');
    }
  }

  // Getter method to retrieve the character's class level.
  getclassLevel() {
    return this._classlevel;
  }

  // Setter method to set the character's class level.
  setClassLevel(newLevel) {
    if (typeof newLevel === 'string') { //&& newLevel >= 1) { // change back to int
      this._classlevel = newLevel;
      localStorage.setItem("_classlevel", newLevel);
    } else {
      console.error('Invalid class level. Level must be a positive number.');
    }
  }

  getBackground() {
    return this._background;
  }

  setBackground(newBackground) {
    if (typeof newBackground === 'string') {
      this._background = newBackground;
      localStorage.setItem("_background", newBackground);
    } else {
      console.error('Invalid class level. Level must be a string.');
    }
  }

  get playername() {
    return this._playername;
  }

  set playername(newPlayername) {
    if (typeof newPlayername === 'string') {
      this._playername = newPlayername;
      localStorage.setItem("_playername", newPlayername);
    } else {
      console.error('Invalid playername. Race must be a string.');
    }
  }

  get race() {
    return characterSheet._race;
  }

  set race(newRace) {
    if (typeof newRace === 'string') {
      this._race = newRace;
      localStorage.setItem("_race", this._race);
    } else {
      console.error('Invalid player race. Race must be a string.');
    }
  }

  get alignment() {
    return this._alignment;
  }

  set alignment(newAlignment) {
    if (typeof newAlignment === 'string') {
      this._alignment = newAlignment;
      localStorage.setItem("_alignment", this._alignment);
    } else {
      console.error('Invalid alignment. Alignment must be a string.')
    }
  }

  get experiencepts() {
    return this._experiencepts;
  }

  set experiencepts(newExpPts) {
    if (typeof newExpPts === 'string') {
      this._experiencepts = newExpPts;
      localStorage.setItem("_experiencepts", this._experiencepts);
    } else {
      console.error('Invalid exp pts. Pts must be a string');
    }
  }

  // Getter and Setter for _strength
  get strength() {
    return this._strength;
  }
  set strength(value) {
    this._strength = value;
    localStorage.setItem("_strength", this._strength);
  }

  // Getter and Setter for _dex
  get dex() {
    return this._dex;
  }
  set dex(value) {
    this._dex = value;
    localStorage.setItem("_dex", this._dex);
  }

  // Getter and Setter for _constitution
  get constitution() {
    return this._constitution;
  }
  set constitution(value) {
    this._constitution = value;
    localStorage.setItem("_constitution", this._constitution);
  }

  // Getter and Setter for _wisdom
  get wisdom() {
    return this._wisdom;
  }
  set wisdom(value) {
    this._wisdom = value;
  }

  // Getter and Setter for _intellegence
  get intellegence() {
    return this._intellegence;
  }
  set intellegence(value) {
    this._intellegence = value;
  }

  // Getter and Setter for _charisma
  get charisma() {
    return this._charisma;
  }
  set charisma(value) {
    this._charisma = value;
  }

  // IMPORTANT: this function will return keys for all variables. 
  // Will not work if character object hasn't been instantiated. 
  // Input: none
  // Output: an array of all keys (the data for the CharSheet)
  keyNames() {
    try {
      return Object.keys(this);
    }
    catch {
      console.error("Could not retrieve keys")
      return null;
    }
  }

  // Grabs all key value pairs in local storage and populates the character sheet. Only works on charsheet.html
  updateSheet() {
    console.log("Updating character sheet from localStorage")
    var keys = character.keyNames(); // grabs all keys associated with a character sheet
    var unkowns = "Variabls not assigned: ";
    for (const key in keys) { // set all attributes on the character sheet based on the keys.
      if (localStorage.getItem(keys[key]) != null) // if it's in local storage, set it on the html sheet.
        try {
          document.getElementById(keys[key]).textContent = localStorage.getItem(keys[key]);
        } catch {
          console.log("["+keys[key]+"] not assigned");
        }
      else { // it's not in local storage, set it in local storage, blank value
        localStorage.setItem(keys[key],""); 
        unkowns = unkowns + " " + keys[key] + ", ";
      }
    }
    console.log(unkowns);
  }

  // Helper function that removes all the elements from local storage,
  // will likely be modified with different parameters later on.
  clearLocalSorage() {
    localStorage.clear
  }
}