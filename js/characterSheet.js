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
    this._strength = 0
    this._dex = 0;
    this._constitution = 0;
    this._wisdom = 0;
    this._intellegence = 0;
    this._charisma = 0;
    this._strengthMod = 0;
    this._dexMod = 0;
    this._constitutionMod = 0;
    this._intellegenceMod = 0;
    this._wisdomMod = 0;
    this._charismaMod = 0;
    this._proficiencyBonus = 2;
    this._inspiration = 0;
    this._strengthST = 0;
    this._dexST = 0;
    this._constitutionST = 0;
    this._wisdomST = 0;
    this._intellegenceST = 0;
    this._charismaST = 0;
    this._acrobatics = 0;
    this._animalHandling = 0;
    this._arcana = 0;
    this._athletics = 0;
    this._deception = 0;
    this._history = 0;
    this._insight = 0;
    this._intimidation = 0;
    this._investigation = 0;
    this._medicine = 0;
    this._nature = 0;
    this._perception = 0;
    this._performance = 0;
    this._persuasion = 0;
    this._religion = 0;
    this._sleightOfHand = 0;
    this._stealth = 0;
    this._survival = 0;
    this._passiveWisdom = 0;
    this._armorClass = 0;
    this._initiative = 0;
    this._speed = 0;
    this._hitPointMaximum = 0;
    this._currentHitPoints = 0;
    this._tempHitPoints = 0;
    this._hitDiceTotal = '1d10';
    this._hitDice = 1;
    this._personalityTraits = '';
    this._ideals = '';
    this._bonds = '';
    this._flaws = '';
    this._featuresandtraits = '';
    this._otherproficiencieslanguages = '';
    this._eqCP = '';
    this._eqSP = '';
    this._eqEP = '';
    this._eqGP = '';
    this._eqPP = '';

    // add get set for the following
    this._eqList = '';
    this._attSp1Name = '';
    this._attSp1AtkB = '';
    this._attSp1Dam = '';

    this._attSp2Name = '';
    this._attSp2AtkB = '';
    this._attSp2Dam = '';

    this._attSp3Name = '';
    this._attSp3AtkB = '';
    this._attSp3Dam = '';

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

  getPlayername() {
    return this._playername;
  }

  setPlayername(newPlayername) {
    if (typeof newPlayername === 'string') {
      this._playername = newPlayername;
      localStorage.setItem("_playername", newPlayername);
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
      localStorage.setItem("_race", this._race);
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
      localStorage.setItem("_alignment", this._alignment);
    } else {
      console.error('Invalid alignment. Alignment must be a string.')
    }
  }

  getExperiencePts() {
    return this._experiencepts;
  }

  setExperiencePts(newExpPts) {
    if (typeof newExpPts === 'string') {
      this._experiencepts = newExpPts;
      localStorage.setItem("_experiencepts", this._experiencepts);
    } else {
      console.error('Invalid exp pts. Pts must be a string');
    }
  }

  // Getter and Setter for _strength
  getStrength() {
    return this._strength;
  }
  setStrength(value) {
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

  get strengthMod() {
    return this._strengthMod;
  }
  set strengthMod(value) {
    this._strengthMod = value;
  }

  get charisma() {
    return this._charisma;
  }
  set charisma(value) {
    this._charisma = value;
  }

  get dexMod() {
    return this._dexMod;
  }

  set dexMod(value) {
    this._dexMod = value
  }

  // Getter and Setter for _constitutionMod
  get constitutionMod() {
    return this._constitutionMod;
  }
  set constitutionMod(value) {
    this._constitutionMod = value;
  }

  // Getter and Setter for _intelligenceMod
  get intelligenceMod() {
    return this._intelligenceMod;
  }
  set intelligenceMod(value) {
    this._intelligenceMod = value;
  }

  // Getter and Setter for _wisdomMod
  get wisdomMod() {
    return this._wisdomMod;
  }
  set wisdomMod(value) {
    this._wisdomMod = value;
  }

  // Getter and Setter for _charismaMod
  get charismaMod() {
    return this._charismaMod;
  }
  set charismaMod(value) {
    this._charismaMod = value;
  }

  // Getter and Setter for _proficiencyBonus
  get proficiencyBonus() {
    return this._proficiencyBonus;
  }
  set proficiencyBonus(value) {
    this._proficiencyBonus = value;
  }

  // Getter and Setter for _inspiration
  get inspiration() {
    return this._inspiration;
  }
  set inspiration(value) {
    this._inspiration = value;
  }

  // Getter and Setter for _strengthST
  get strengthST() {
    return this._strengthST;
  }
  set strengthST(value) {
    this._strengthST = value;
  }

  // Getter and Setter for _dexST
  get dexST() {
    return this._dexST;
  }
  set dexST(value) {
    this._dexST = value;
  }

  // Getter and Setter for _constitutionST
  get constitutionST() {
    return this._constitutionST;
  }
  set constitutionST(value) {
    this._constitutionST = value;
  }

  // Getter and Setter for _wisdomST
  get wisdomST() {
    return this._wisdomST;
  }
  set wisdomST(value) {
    this._wisdomST = value;
  }

  // Getter and Setter for _intellegenceST
  get intellegenceST() {
    return this._intellegenceST;
  }
  set intellegenceST(value) {
    this._intellegenceST = value;
  }

  // Getter and Setter for _charismaST
  get charismaST() {
    return this._charismaST;
  }
  set charismaST(value) {
    this._charismaST = value;
  }

  // Getter and Setter for _acrobatics
  get acrobatics() {
    return this._acrobatics;
  }
  set acrobatics(value) {
    this._acrobatics = value;
  }

  // Getter and Setter for _animalHandling
  get animalHandling() {
    return this._animalHandling;
  }
  set animalHandling(value) {
    this._animalHandling = value;
  }

  // Getter and Setter for _arcana
  get arcana() {
    return this._arcana;
  }
  set arcana(value) {
    this._arcana = value;
  }

  // Getter and Setter for _athletics
  get athletics() {
    return this._athletics;
  }
  set athletics(value) {
    this._athletics = value;
  }

  // Getter and Setter for _deception
  get deception() {
    return this._deception;
  }
  set deception(value) {
    this._deception = value;
  }

  // Getter and Setter for _history
  get history() {
    return this._history;
  }
  set history(value) {
    this._history = value;
  }

  // Getter and Setter for _insight
  get insight() {
    return this._insight;
  }
  set insight(value) {
    this._insight = value;
  }

  // Getter and Setter for _intimidation
  get intimidation() {
    return this._intimidation;
  }
  set intimidation(value) {
    this._intimidation = value;
  }

  // Getter and Setter for _investigation
  get investigation() {
    return this._investigation;
  }
  set investigation(value) {
    this._investigation = value;
  }

  // Getter and Setter for _medicine
  get medicine() {
    return this._medicine;
  }
  set medicine(value) {
    this._medicine = value;
  }

  // Getter and Setter for _nature
  get nature() {
    return this._nature;
  }
  set nature(value) {
    this._nature = value;
  }

  // Getter and Setter for _perception
  get perception() {
    return this._perception;
  }
  set perception(value) {
    this._perception = value;
  }

  // Getter and Setter for _performance
  get performance() {
    return this._performance;
  }
  set performance(value) {
    this._performance = value;
  }

  // Getter and Setter for _persuasion
  get persuasion() {
    return this._persuasion;
  }
  set persuasion(value) {
    this._persuasion = value;
  }

  // Getter and Setter for _religion
  get religion() {
    return this._religion;
  }
  set religion(value) {
    this._religion = value;
  }

  // Getter and Setter for _sleightOfHand
  get sleightOfHand() {
    return this._sleightOfHand;
  }
  set sleightOfHand(value) {
    this._sleightOfHand = value;
  }

  // Getter and Setter for _stealth
  get stealth() {
    return this._stealth;
  }
  set stealth(value) {
    this._stealth = value;
  }

  // Getter and Setter for _survival
  get survival() {
    return this._survival;
  }
  set survival(value) {
    this._survival = value;
  }

  // Getter and Setter for _passiveWisdom
  get passiveWisdom() {
    return this._passiveWisdom;
  }
  set passiveWisdom(value) {
    this._passiveWisdom = value;
  }

  // Getter and Setter for _armorClass
  get armorClass() {
    return this._armorClass;
  }
  set armorClass(value) {
    this._armorClass = value;
  }

  // Getter and Setter for _initiative
  get initiative() {
    return this._initiative;
  }
  set initiative(value) {
    this._initiative = value;
  }

  // Getter and Setter for _speed
  get speed() {
    return this._speed;
  }
  set speed(value) {
    this._speed = value;
  }

  // Getter and Setter for _hitPointMaximum
  get hitPointMaximum() {
    return this._hitPointMaximum;
  }
  set hitPointMaximum(value) {
    this._hitPointMaximum = value;
  }

  // Getter and Setter for _currentHitPoints
  get currentHitPoints() {
    return this._currentHitPoints;
  }
  set currentHitPoints(value) {
    this._currentHitPoints = value;
  }

  // Getter and Setter for _tempHitPoints
  get tempHitPoints() {
    return this._tempHitPoints;
  }
  set tempHitPoints(value) {
    this._tempHitPoints = value;
  }

  // Getter and Setter for _hitDiceTotal
  get hitDiceTotal() {
    return this._hitDiceTotal;
  }
  set hitDiceTotal(value) {
    this._hitDiceTotal = value;
  }

  get hitDice() {
    return this.hitDice
  }

  set hitDice(value) {
    this._hitDice = value
  }

  // Getter and Setter for _personalityTraits
  get personalityTraitw() {
    return this._personalityTraits;
  }
  set personalityTraitw(value) {
    this._personalityTraits = value;
  }

  // Getter and Setter for _ideals
  get ideals() {
    return this._ideals;
  }
  set ideals(value) {
    this._ideals = value;
  }

  // Getter and Setter for _bonds
  get bonds() {
    return this._bonds;
  }
  set bonds(value) {
    this._bonds = value;
  }

  // Getter and Setter for _flaws
  get flaws() {
    return this._flaws;
  }
  set flaws(value) {
    this._flaws = value;
  }

  // Getter and Setter for _featuresandtraits
  get featuresandtraits() {
    return this._featuresandtraits;
  }
  set featuresandtraits(value) {
    this._featuresandtraits = value;
  }

  // Getter and Setter for _otherproficiencieslanguages
  get otherproficiencieslanguages() {
    return this._otherproficiencieslanguages;
  }
  set otherproficiencieslanguages(value) {
    this._otherproficiencieslanguages = value;
  }

  // Getter and Setter for _eqCP
  get eqCP() {
    return this._eqCP;
  }
  set eqCP(value) {
    this._eqCP = value;
  }

  // Getter and Setter for _eqSP
  get eqSP() {
    return this._eqSP;
  }
  set eqSP(value) {
    this._eqSP = value;
  }

  // Getter and Setter for _eqEP
  get eqEP() {
    return this._eqEP;
  }
  set eqEP(value) {
    this._eqEP = value;
  }

  // Getter and Setter for _eqGP
  get eqGP() {
    return this._eqGP;
  }
  set eqGP(value) {
    this._eqGP = value;
  }

  // Getter and Setter for _eqPP
  get eqPP() {
    return this._eqPP;
  }
  set eqPP(value) {
    this._eqPP = value;
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
    // var unkowns = "Variabls not assigned: ";
    console.log("KEYS: " + keys)
    for (const key in keys) { // set all attributes on the character sheet based on the keys.
      var flag = 0
      if (localStorage.getItem(keys[key]) != null) {// if it's in local storage, set it on the html sheet.
        try {
          document.getElementById(keys[key]).textContent = localStorage.getItem(keys[key]);
        } catch {
          flag = 1
          // console.log("[" + keys[key] + "] not assigned");
        }
        try {
          document.getElementById(keys[key]).value = localStorage.getItem(keys[key])
        }
        catch {
          flag = 1

          // console.log("[" + keys[key] + "] not assigned");
        }
        try {
          document.getElementById(keys[key]).innerText = localStorage.getItem(keys[key])

        }
        catch {
          flag = 1
          // console.log("[" + keys[key] + "] not assigned");
        }
        if (flag == 1) console.log("[" + keys[key] + "] not assigned");
      }
      else { // it's not in local storage, set it in local storage, blank value
        localStorage.setItem(keys[key], "");
        unkowns = unkowns + " " + keys[key] + ", ";
      }
    }
    // console.log(unkowns);
  }
  //TODO here: input should be any value asssigned to a character sheet and it should be set to local storage.
  setValueInLocalStorage() {

  }

  // Helper function that removes all the elements from local storage,
  // will likely be modified with different parameters later on.
  clearLocalSorage() {
    localStorage.clear
  }
}

const DwarfPreset = new characterSheet()
DwarfPreset._name = "Ulfgar Rumnaheim"
DwarfPreset._classlevel = 'War Cleric 1'
DwarfPreset._background = 'Acolyte'
DwarfPreset._playername = ''
DwarfPreset._race = 'Hill Dwarf';
DwarfPreset._alignment = 'Lawful Good';
DwarfPreset._experiencepts = '0';
DwarfPreset._strength = '10';
DwarfPreset._dex = '12';
DwarfPreset._constitution = '16';
DwarfPreset._wisdom = '16';
DwarfPreset._intellegence = '9';
DwarfPreset._charisma = '12';
DwarfPreset._strengthMod = '0';
DwarfPreset._dexMod = '1';
DwarfPreset._constitutionMod = '3';
DwarfPreset._intellegenceMod = '-1';
DwarfPreset._wisdomMod = '3';
DwarfPreset._charismaMod = '1';
DwarfPreset._proficiencyBonus = '2';
DwarfPreset._inspiration = 0;
DwarfPreset._strengthST = '0';
DwarfPreset._dexST = '1';
DwarfPreset._constitutionST = '3';
DwarfPreset._wisdomST = '5';
DwarfPreset._intellegenceST = '-1';
DwarfPreset._charismaST = '3';
DwarfPreset._acrobatics = '1';
DwarfPreset._animalHandling = '3';
DwarfPreset._arcana = '-1';
DwarfPreset._athletics = '0';
DwarfPreset._deception = '1';
DwarfPreset._history = '1';
DwarfPreset._insight = '5';
DwarfPreset._intimidation = '1';
DwarfPreset._investigation = '-1';
DwarfPreset._medicine = '5';
DwarfPreset._nature = '-1';
DwarfPreset._perception = '3';
DwarfPreset._performance = '1';
DwarfPreset._persuasion = '1';
DwarfPreset._religion = '1';
DwarfPreset._sleightOfHand = '1';
DwarfPreset._stealth = '1';
DwarfPreset._survival = '3';
DwarfPreset._passiveWisdom = '13';
DwarfPreset._armorClass = '18';
DwarfPreset._initiative = '1';
DwarfPreset._speed = '25';
DwarfPreset._hitPointMaximum = '12';
DwarfPreset._currentHitPoints = '12';
DwarfPreset._tempHitPoints = '';
DwarfPreset._hitDiceTotal = '1d8';
DwarfPreset._hitDice = '1';
DwarfPreset._personalityTraits = '1: I idolize a particular hero of my faith and constantly refer to them. \n5: I quote sacred texts and proverbs in almost every situation.';
DwarfPreset._ideals = '5: Faith. I trust that my deity will guide my actions. I have faith that if I work hard, things will go well.';
DwarfPreset._bonds = '5: I will do anything to protect the temple where I served.';
DwarfPreset._flaws = '2: I put too much trust in those who wield power within my temple\'s hierarchy.';
DwarfPreset._featuresandtraits = '-Darkvision\n-Dwarven Resilience \n-Stonecunning\n-Dwarven Toughness';
DwarfPreset._otherproficiencieslanguages = 'Proficiencies:\nRacial: Battleaxe, handaxe, light hammer, warhammer, smith\'s tools.\nClass: Light armor, medium armor, shields, simple weapons\nSubclass: Martial weapons, heavy armor.\nLanguages: Common, Dwarvish, Elvish, Gnomish';
DwarfPreset._eqCP = '';
DwarfPreset._eqSP = '';
DwarfPreset._eqEP = '';
DwarfPreset._eqGP = '15';
DwarfPreset._eqPP = '';

DwarfPreset._attSp1Name = 'warham. and shield';
DwarfPreset._attSp1AtkB = '2';
DwarfPreset._attSp1Dam = '1d8 bludgeoning';

DwarfPreset._attSp2Name = 'warhammer';
DwarfPreset._attSp2AtkB = '2';
DwarfPreset._attSp2Dam = '1d10 bludgeoning';

DwarfPreset._attSp3Name = 'light crossbow';
DwarfPreset._attSp3AtkB = '3';
DwarfPreset._attSp3Dam = '1d8+1 piercing';


DwarfPreset._eqList = '-Warhammer\n-chain mail\n-light crossbow with 20 bolts\n-priest\'s pack\n-shield\n-2 holy symbols (gifts given to you when you entered the priesthood)\n-prayer wheel\n-5 sticks of incense\n-vestments\n-a common set of clothing';

function loadPreset() {
  console.log("Name of preset:" + DwarfPreset._name)
  var keys = character.keyNames();
  for (var key in keys) {
    localStorage.setItem(keys[key], DwarfPreset[keys[key]])
  }
  // DwarfPreset.updateSheet()
}


// DwarfPreset._name = '';
// DwarfPreset._classlevel = '';
// DwarfPreset._background = '';
// DwarfPreset._playername = '';
// DwarfPreset._race = '';
// DwarfPreset._alignment = '';
// DwarfPreset._experiencepts = '';
// DwarfPreset._strength = 0;
// DwarfPreset._dex = 0;
// DwarfPreset._constitution = 0;
// DwarfPreset._wisdom = 0;
// DwarfPreset._intellegence = 0;
// DwarfPreset._charisma = 0;
// DwarfPreset._strengthMod = 0;
// DwarfPreset._dexMod = 0;
// DwarfPreset._constitutionMod = 0;
// DwarfPreset._intellegenceMod = 0;
// DwarfPreset._wisdomMod = 0;
// DwarfPreset._charismaMod = 0;
// DwarfPreset._proficiencyBonus = 2;
// DwarfPreset._inspiration = 0;
// DwarfPreset._strengthST = 0;
// DwarfPreset._dexST = 0;
// DwarfPreset._constitutionST = 0;
// DwarfPreset._wisdomST = 0;
// DwarfPreset._intellegenceST = 0;
// DwarfPreset._charismaST = 0;
// DwarfPreset._acrobatics = 0;
// DwarfPreset._animalHandling = 0;
// DwarfPreset._arcana = 0;
// DwarfPreset._athletics = 0;
// DwarfPreset._deception = 0;
// DwarfPreset._history = 0;
// DwarfPreset._insight = 0;
// DwarfPreset._intimidation = 0;
// DwarfPreset._investigation = 0;
// DwarfPreset._medicine = 0;
// DwarfPreset._nature = 0;
// DwarfPreset._perception = 0;
// DwarfPreset._performance = 0;
// DwarfPreset._persuasion = 0;
// DwarfPreset._religion = 0;
// DwarfPreset._sleightOfHand = 0;
// DwarfPreset._stealth = 0;
// DwarfPreset._survival = 0;
// DwarfPreset._passiveWisdom = 0;
// DwarfPreset._armorClass = 0;
// DwarfPreset._initiative = 0;
// DwarfPreset._speed = 0;
// DwarfPreset._hitPointMaximum = 0;
// DwarfPreset._currentHitPoints = 0;
// DwarfPreset._tempHitPoints = 0;
// DwarfPreset._hitDiceTotal = '1d10';
// DwarfPreset._hitDice = 0;
// DwarfPreset._personalityTraits = '';
// DwarfPreset._ideals = '';
// DwarfPreset._bonds = '';
// DwarfPreset._flaws = '';
// DwarfPreset._featuresandtraits = '';
// DwarfPreset._otherproficiencieslanguages = '';
// DwarfPreset._eqCP = 0;
// DwarfPreset._eqSP = 0;
// DwarfPreset._eqEP = 0;
// DwarfPreset._eqGP = 0;
// DwarfPreset._eqPP = 0;