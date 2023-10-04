// characterSheet.js - John Gilbert
// This file should represent the entirety of a character sheet, 
// with all attributes.

// TODO: Figure out where we want to do value checking
// NOTE: Naming conventions are VITAL. Everything breaks if we aren't careful.
//  Strings: _<stringname>
//  ints: ???
//  ints with dependencies: ???

// Object represents the character sheet values
class characterSheet {

  constructor() {

    // all values are initialized first from the blank character sheet.
    // allows for us to use placeholders. NOTE: This can be simplified later 
    this._name = document.getElementById("_name").textContent;
    this._classlevel = document.getElementById("_classlevel").textContent;
    this._background = document.getElementById('_background').textContent;
    this._playername = document.getElementById("_playername").textContent;
    this._race = document.getElementById("_race").textContent;
    this._alignment = document.getElementById("_alignment").textContent;
    this._experiencepts = document.getElementById("_experiencepts").textContent;
  }

  // Getter method to retrieve the character's name.
  getCharacterName() {
    return this._name;
  }

  // Setter method to set the character's name.
  setCharacterName(newName) {
    // console.log(typeof newName);
    if (typeof newName === 'string') {
      characterSheet._name = newName;
      localStorage.setItem("_name", newName);
    } else {
      console.error('Invalid name format. Name must be a string.');
    }
  }

  // Getter method to retrieve the character's class level.
  getClassLevel() {
    return this._classlevel;
  }

  // Setter method to set the character's class level.
  setClassLevel(newLevel) {
    if (typeof newLevel === 'string') { //&& newLevel >= 1) { // change back to int
      this._classlevel = newLevel;
    } else {
      console.error('Invalid class level. Level must be a positive number.');
    }
  }

  getBackground() {
    return this._background;
  }

  setBackground(newBackground) {
    if (typeof newBackground === 'string') {
      this._classlevel = newLevel;
    } else {
      console.error('Invalid class level. Level must be a string.');
    }
  }

  getPlayername() {
    return this._playername;
  }

  setPlayername(newPlayername) {
    if (typeof newPlayername === 'string') {
      this._playername = newPlayername;
    } else {
      console.error('Invalid playername. Race must be a string.');
    }
  }

  getRace() {
    return characterSheet._race;
  }

  setRace(newRace) {
    if (typeof newRace === 'string') {
      this._race = newRace;
    } else {
      console.error('Invalid player race. Race must be a string.');
    }
  }

  getAlignment() {
    return this._alignment;
  }

  setAlignment(newAlignment) {
    if (typeof newAlignment === 'string') {
      this._alignment = newAlignment;
    } else {
      console.error('Invalid alignment. Alignment must be a string.')
    }
  }

  getExpPts() {
    return this._experiencepts;
  }

  setExpPts(newExpPts) {
    if (typeof newExpPts === 'string') {
      this._experiencepts = newExpPts;
    } else {
      console.error('Invalid exp pts. Pts must be a string');
    }
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
    for (const key in keys) // set all attributes on the character sheet based on the keys.
      document.getElementById(keys[key]).textContent = localStorage.getItem(keys[key]);
  }

// Helper function that removes all the elements from local storage,
// will likely be modified with different parameters later on.
  clearLocalSorage() {
    localStorage.clear;
  }
}