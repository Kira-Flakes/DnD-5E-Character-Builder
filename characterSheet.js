// characterSheet.js
// This file should represent the entirety of a character sheet, 
// with all attributes.

const labelText = document.getElementById('_character');

// Define an object to represent the character sheet.
const characterSheet = {
  _name: '', // Private variable to store the character's name.
  _classlevel: '',
  _background: '',
  _playername: '',
  _race: '',
  _alignment: '',
  _experiencepts: '',
};

// Getter method to retrieve the character's name.
function getCharacterName() {
  localStorage.getItem("_name");
  return characterSheet._name;
}

// Setter method to set the character's name.
function setCharacterName(newName) {
  if (typeof newName === 'string') {
    characterSheet._name = newName;
  } else {
    console.error('Invalid name format. Name must be a string.');
  }
  localStorage.setItem("_name", newName);
}

// Getter method to retrieve the character's class level.
function getClassLevel() {
  return characterSheet._classlevel;
}

// Setter method to set the character's class level.
function setClassLevel(newLevel) {
  if (typeof newLevel === 'number' && newLevel >= 1) {
    characterSheet._classlevel = newLevel;
  } else {
    console.error('Invalid class level. Level must be a positive number.');
  }
}

function updateSheet() {
  
}

// Export the getter and setter functions.
module.exports = {
  getCharacterName,
  setCharacterName,
  updateSheet,
};



