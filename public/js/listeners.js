// John Gilbert - Wiz Rad Character creator listener functions. File contains all actions based on user input.


// API calls imported from Erick's files. (Denoted by a series of newlines towards the end of this file)

/*

    In order to elimnate redundant comments, the following conventions are explained.
        Local Storage values are divided into two catagories:
            Values directly sent to the character sheet (beginning with '_')
            Values meant to help with logic and flag events (do not begin with '_')
        The ~130 character sheet attributes can be found in characterSheet.js

    Besides API calls, fetched data has two file types: json and csv.
        json data cannot be commented, but the organization of the json file should be self explanatory based on data names. 
        Each page has it's own data set with explainations and question sequences. Additional info was added as needed, 
        such as specific tools, background traits and misc info.

    Often used custom functions:
        clearContentAndGet: clears the content div and returns it. The content div is the main div of the webpage.
        highlightTextWithMousover: parses the text from guide.json { "misc" }  and pipes it into the helper column.

    Other details:
        explainers are variables that hold explainations for each page.
        helperInfo refers to information displayed on mouseover events for significant words and buttons.

    An assumption has been made that a readers are familair with javascript, and functions from the default
    library are not always explained.

    Documentation of this file (listeners.js) is the responsibility of John Gilbert only.
*/


const divCache = [] // Used to cache API to div translations, in order to increase speed.
var allDetails = [] // Loaded with misc elements from guide.json (optionally used with highlight text with mouseover)
// let racePrev = 0

// Some data used in equipment sequences. 
const instrumentData = [
    "Bagpipes",
    "Drum",
    "Dulcimer",
    "Flute",
    "Lute",
    "Lyre",
    "Horn",
    "Pan Flute",
    "Shawm",
    "Viol"
];
const artisanToolData = [
    "Alchemist's supplies",
    "Brewer's supplies",
    "Calligrapher's supplies",
    "Carpenter's tools",
    "Cartographer's tools",
    "Cobbler's tools",
    "Cook's utensils",
    "Glassblower's tools",
    "Jeweler's tools",
    "Leatherworker's tools",
    "Mason's tools",
    "Painter's supplies",
    "Potter's tools",
    "Smith's tools",
    "Tinker's tools",
    "Weaver's tools",
    "Woodcarver's tools"
];

// fetch json misc data and load into allDetails
fetch('/guide.json')
    .then(response => response.json())
    .then(data => {
        // Data is the parsed JSON object
        allDetails = Object.keys(data.misc);
        console.log(allDetails.type);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });


function init() {
    // initialize localStorage values
    localStorage.clear()

    races = "Dwarf,Elf,Tiefling,Dragonborn,Human,Half-Elf,Half-Orc,Halfling,Gnome";
    classes = "Barbarian,Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Warlock,Wizard"
    // use the working sets
    localStorage.setItem("$race", races);
    localStorage.setItem("%race", races);
    localStorage.setItem("class", classes)
    localStorage.setItem("$class", classes)
    localStorage.setItem("_race", '')
    localStorage.setItem('_subRace', '')

    // reset the state of all page progression.
    localStorage.setItem('currentRef', '../index.html'); // 
    localStorage.setItem("state", '0');
    localStorage.setItem("raceState", "0");
    localStorage.setItem("classState", "0");
    localStorage.setItem("raceIter", "0")
    localStorage.setItem("gettingstartedState", "0");
    localStorage.setItem("init", '1') // set init to true
    localStorage.setItem("possibleAlignments", "")
}   // end init


// Sets the message for the user to be greeted with, accessed in json data
function setWelcomeInfo(page) {
    const welcomeTxt = document.getElementById('welcomeMessage');
    const info = document.getElementById('info')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currPage = data[page]
            welcomeTxt.innerText = currPage.welcome;
            info.innerHTML = highlightTextWithMouseover(currPage.explainer, allDetails);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}// end setWelcomeInfo


// Should user request to access a preset, clear all the info and present the options
function presentPreset() {
    clearHelperInfo() // remove right column information
    localStorage.setItem('gettingstartedState', '1')
    colLeft = document.getElementById("colLeft")

    // if a name has been entered, add it to local storage
    if (document.getElementById('_playername').value === null) {
        localStorage.setItem('_playername', '')
    }
    else {
        localStorage.setItem('_playername', document.getElementById('_playername').value)
    }

    // add the player name value to the preset character sheet.
    for (var pres in allPresets) {
        allPresets[pres]._playername = localStorage.getItem('_playername')
    }

    // clear the div, make room for preset question.
    if (colLeft) {
        // Remove all child elements
        while (colLeft.firstChild) {
            colLeft.removeChild(colLeft.firstChild);
        }
    } else {
        console.log('Div element not found.');
    }

    // fetching explaination of presets, pipe into html.
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            let explainDiv = document.createElement('div')
            explainDiv.innerHTML = highlightTextWithMouseover(data['presetChoice'].explainer, allDetails)
            colLeft.appendChild(explainDiv)

            let qDiv = document.createElement('div')
            qDiv.innerHTML = data['presetChoice'].questions.q
            colLeft.appendChild(qDiv)

            // create the button to select a preset
            pBtn = document.createElement('button')
            npBtn = document.createElement('button')
            pBtn.innerHTML = data['presetChoice'].questions.ans[0]

            // when button is clicked, load the preset options.
            pBtn.onclick = function () {
                clearDiv(colLeft)
                loadPresetBios()
            }

            // if no preset option is chosen, begin character creation process, starting with race.
            npBtn.innerHTML = data['presetChoice'].questions.ans[1]
            npBtn.onclick = function () {
                flushSheet(["_playername"])
                window.location.href = '../html/race.html'
            }
            colLeft.appendChild(pBtn)
            colLeft.appendChild(npBtn)
        })
        .catch(error => {
            console.error('Error:', error);
        });

} // end presentPreset

// helper function to clear weapon selections (3 total), used to reset equipment progress.
function clearEquipmentChoices() {
    localStorage.removeItem('_eqList')

    localStorage.removeItem('_attSp1Name')
    localStorage.removeItem('_attSp1AtkB')
    localStorage.removeItem('_attSp1Dam')

    localStorage.removeItem('_attSp2Name')
    localStorage.removeItem('_attSp2AtkB')
    localStorage.removeItem('_attSp2Dam')

    localStorage.removeItem('_attSp3Name')
    localStorage.removeItem('_attSp3AtkB')
    localStorage.removeItem('_attSp3Dam')
    weaponsChosen = 1
} // end clearEquipmentChoices

// init global arrays to keep track of equipment across html pages.
var equipmentQuestions = []
var givenEquipment = []
var weaponChoices = []


// When equipment begins, always reset the values gathered to prevent errors. Then load explainations for equipment.
function initEquipment() {
    clearEquipmentChoices()
    equipmentQuestions = []
    givenEquipment = []
    gatherEQQuestionsClass()
    gatherEQQuestionsBackground()

    content = clearContentAndGet()
    title = appendToContent('h2')
    title.innerText = "Equipment"
    equipmentExplainer = appendToContent('div')
    equipmentExplainer.innerHTML = highlightTextWithMouseover(
        'Your class, race and background determine what equipment your character can carry.',
        allDetails
    )
    cBtn = newContinueButton(true)

    // continue to start the equipment sequence
    cBtn.onclick = function () {
        beginEquipment()
    }
} // end clearEquipmentChoices


function beginEquipment() {
    console.log(equipmentQuestions)
    content = clearContentAndGet()
    explain = appendToContent('div')
    localStorage.removeItem('_eqList') // remove equipment if they already tried something else before.
    explain.innerText = 'You have already been given this starting equipment: '
    for (e in givenEquipment) {
        console.log('giceneq: ' + givenEquipment[e])
        const eDiv = appendToContent('div', 'smallDiv')
        eDiv.innerHTML = highlightTextWithMouseover(
            givenEquipment[e],
            allDetails
        )
        if (givenEquipment[e] !== null)
            addToLocalStorageString('_eqList', givenEquipment[e] + '\n')
        // eDiv.style.margin = '-15px'
        // eDiv.style.fontsize = '10%'
    }
    contDiv = appendToContent('div')
    contDiv.innerText = "\nContinue on to choose the rest of your equipment."
    cBtn = newContinueButton(true)

    // begin the question/answer sequence for equipment.
    cBtn.onclick = function () {
        chooseEquipment()
    }
}

// Iterate across the sequence to ask about what equipment the player wants.
// CSV data is parsed in a specific way, '*' represents a seperation between choices and
// ';' represents a new question.
function chooseEquipment(iter = 0) {

    // ensure they haven't reached the max amount of weapons allowed.
    // If they have, move on to spells (not fully implemented due to time constrains, we just choose the spells for them based on class and race)
    if (iter >= equipmentQuestions.length) {
        console.log("Done with equipment questions...")
        loadCantrips()
    }
    else { // we still have choices to present
        content = clearContentAndGet()
        choiceDiv = appendToContent('div')
        choiceDiv.innerText = "Choose Between: "

        currentQuestion = equipmentQuestions[iter].split('*') // parsing options from csv

        for (let c in currentQuestion) { // load the question
            if (currentQuestion[c].charAt(0) == '_') { // this is an explaination for the question, move to next iteration after loading.
                choiceDiv.innerText = 'Choose ' + currentQuestion[c].slice(1) + ': '
                continue;
            }

            // make option button, on click load that option to the relevant charsheet location.
            const oBtn = document.createElement('button')
            oBtn.innerText = stripEQChoice(currentQuestion[c])
            choiceDiv.appendChild(oBtn)
            let btnClicked = false // used to track toggle of button, and allowance of click actions
            oBtn.onclick = function () {
                if (!btnClicked) {
                    if (oBtn.innerText.includes('Any') && oBtn.innerText.includes('Two')) {
                        // we have an ANY TWO choice to handle (eg any two martial weapons)
                        parseWeaponChoicesTwo(oBtn.innerText, iter)
                    }
                    else if (oBtn.innerText.includes('Any')) {
                        // we have an any one choice
                        parseWeaponChoices(oBtn.innerText, iter)
                    }

                    else { // we have a basic choice, no need to provide additional options to choose from.
                        // we need to extract the weapon from the spreadsheet (it is between {})
                        extracted = extractWeaponSubstring(currentQuestion[c])

                        if (extracted == currentQuestion[c])
                            addToLocalStorageString('_eqList', oBtn.innerText)
                        else {
                            console.log('wName: ' + '_attSp' + weaponsChosen + 'Name')
                            storeChosenWeapon(extracted, weaponsChosen)
                            weaponsChosen++
                        }

                        chooseEquipment(++iter) // move on to next question in sequence
                    }
                    btnClicked = true // toggle to true
                }
            }
        }
    }
}

// cantrips are essentially level 0 spells, based on class/race. Access CSV with this info and load it into localStorage.
// Explain that cantrips have been awarded to the player.
function loadCantrips() {
    content = clearContentAndGet()
    title = appendToContent('h3')
    title.innerText = 'Spells'
    getFromCSV('spells.csv', localStorage.getItem('_class'), 'Cantrips (Level 0 Spells)')
        .then(data => {
            if (data !== null) {
                cantrips = data.split(',')
                explainer = appendToContent('div')
                explainer.innerHTML = highlightTextWithMouseover(
                    'As a ' + localStorage.getItem('_class') + ' you have been assigned these cantrips:',
                    allDetails
                )
                for (i = 0; i < cantrips.length; i++) {
                    console.log('i ' + i)
                    cantripDiv = appendToContent('div', 'smallDiv')
                    cantripDiv.innerHTML = highlightTextWithMouseover(
                        cantrips[i],
                        allDetails
                    )
                    localStorage.setItem('_c' + (i + 1), cantrips[i])
                }

                // we have a special case for cleric. you'll see this often >:(
                if (localStorage.getItem('_class') == 'Cleric') {
                    // currently cleric isn't handled here.
                    console.log("Cleric level one spells not handled in loadCantrips")
                }
                else { // not cleric, we can load the level 1 spells.
                    loadLevel1Spells()
                }

                // once this sequence is done, we can more on to ability scores.
                continueBtn = newContinueButton(true)
                continueBtn.onclick = function () {
                    rollForAbilities()
                }

            }
            else { // data is null for cantrips (not all classes have them. Alert and move on.)
                console.log('No cantrips for ' + localStorage.getItem('_class'))
                window.location.href = '../html/rollDemo.html'
                rollForAbilities()
            }
        })
}

// Access spells.csv and load the level 1 spells to localStorage.
function loadLevel1Spells() {
    getFromCSV('spells.csv', localStorage.getItem('_class'), 'Level 1 Spells')
        .then(data => {
            if (data !== null) {
                l1Spells = data.split(',')
                if (l1Spells.length > 1) {
                    level1SpellDiv = appendToContent('div')
                    level1SpellDiv.innerHTML = highlightTextWithMouseover(
                        'Additionally, you have the following level 1 spells:',
                        allDetails
                    )
                    for (i = 0; i < l1Spells.length; i++) {
                        console.log('i ' + i)
                        levelDiv = appendToContent('div', 'smallDiv')
                        levelDiv.innerHTML = highlightTextWithMouseover(
                            l1Spells[i],
                            allDetails
                        )
                        localStorage.setItem('_c' + (i + 1), l1Spells[i])
                    }
                }

            }
            else { // we have a class that doesn't have level one spells.
                console.log('No level 1 spells for ' + localStorage.getItem('_class'))
            }
        })
}

// Since there are three spells, the current number of chosen spells is added to local Storage.
// Data is seen on the middle of character sheet.
function storeChosenWeapon(wpn, currNumChosen) {
    console.log('in store Chosen weapon')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            allWeapons = data.weapons
            for (type in allWeapons) {
                console.log(type + ' type')
                for (n in allWeapons[type]) {
                    if (allWeapons[type][n].name == wpn) {
                        console.log('found!')
                        localStorage.setItem('_attSp' + currNumChosen + 'Name', allWeapons[type][n].name)
                        localStorage.setItem('_attSp' + currNumChosen + 'Dam', allWeapons[type][n].damage)
                        return
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// helper function to extract the string found between { and }. This will (should) alway be a weapon found in json data.
function extractWeaponSubstring(inputString) {
    const startIdx = inputString.indexOf('{');
    const endIdx = inputString.indexOf('}');

    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
        console.log('extracted: ' + inputString.substring(startIdx + 1, endIdx))
        return inputString.substring(startIdx + 1, endIdx);
    } else {
        return inputString;
    }
}

// helper function that uses regex to strip out the equipment options from the csv.
function stripEQChoice(inputString) {
    var res = inputString;
    console.log('input string initially: ' + res);
    const regex = /\([^)]*\)|\{|\}|\[|\]/g;
    res = res.replace(regex, '');
    console.log(res + ' :input string');
    return res;
}

// Function that handles the case where two choices are supposed to be selected 
// for a weapon type (eg two martial weapons).
function parseWeaponChoicesTwo(str, iter) {
    parseWeaponChoices(str.replace('Two ', ''), iter, 2)
}


// break CSV strings into questions and answers when the user needs to choose two weapons of the same type.
function parseWeaponChoices(str, iter, numOptions = 1) {
    type = str.split(' ')[1] // this is the type ALWAYS.
    switch (type) {
        case "martial":
            console.log('martial weapon type')
            anyWeaponChoice('martialMeleeWeapons', iter, numOptions)
            anyWeaponChoice('martialRangedWeapons', iter, numOptions)
            break;
        case 'simple':
            console.log("Simple weapon type")
            anyWeaponChoice('simpleMeleeWeapons', iter, numOptions)
            anyWeaponChoice('simpleRangedWeapons', iter, numOptions)
            break;
        default:
            console.log('in defailt case')
            break;
    }
    if (numOptions > 1) {
        parseWeaponChoices(str, iter, --numOptions) // do it again, but now we only need to choose 1.
    }
}

// Load all equipment into two catagories. Given automatically or a selected choice. If eq is automatically given, it does not contain a '*' character.
function gatherEQQuestionsClass() {
    getFromCSV('classFeatures.csv', localStorage.getItem('_class'), 'Equipment')
        .then(data => {
            elements = data.split(';');
            for (e in elements) {
                q = elements[e]
                if (!q.includes('*')) {
                    givenEquipment.push(q)
                }
                else {
                    equipmentQuestions.push(q)
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Load all equipment into two catagorize. Repeated code from the above question because fetching causes issue when
// done twice in the same function.
function gatherEQQuestionsBackground() {
    console.log(localStorage.getItem('_background'))
    getFromCSV('background.csv', localStorage.getItem('_background'), 'Equipment')
        .then(data => {
            elements = data.split(';');
            for (e = 0; e < elements.length - 1; e++) {
                q = elements[e]
                if (!q.includes('*')) {
                    givenEquipment.push(q)
                }
                else {
                    equipmentQuestions.push(q)
                }
            }
            console.log(equipmentQuestions)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Remove all values from the sheet except the ignored values.
function flushSheet(ignore) {
    for (var i = 0; i < localStorage.length; i++) {
        item = localStorage.key(i);
        if (item.charAt(0) != '_') {
            continue
        }
        if (contains(ignore, item)) {
            continue
        }
        localStorage.setItem(localStorage.key(i), '')

    }
}

// Helper function to check it an array contains an item.
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

// Load the bios for each preset.
function loadPresetBios() {
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            colLeft = document.getElementById("colLeft")
            presets = data['presetChoice'].presets
            for (const p in presets) {
                // Create the html elements for each attribute we want to shoe the user.
                bioContainer = document.createElement('div')
                bioContainer.setAttribute('id', 'bio')

                colLeft.appendChild(bioContainer)

                boxL = document.createElement('div')
                boxR = document.createElement('div')

                boxL.setAttribute('class', 'box')
                boxR.setAttribute('class', 'box')

                bioContainer.appendChild(boxL)
                bioContainer.appendChild(boxR)

                pDiv = document.createElement("div")
                pDiv.setAttribute('id', 'presetBio')

                race = document.createElement("h2")

                race.innerHTML = presets[p].race

                boxL.appendChild(race)

                // Load art assets for the presets.
                pImg = document.createElement('img')
                pImg.setAttribute('src', '../img/' + presets[p].id + '.png')
                boxL.appendChild(pImg)

                // add the vio information
                pBio = document.createElement('div')
                pBio.innerHTML = presets[p].bio
                boxR.appendChild(pBio)
                var viewSheet = document.createElement('button')
                viewSheet.setAttribute('id', 'viewSheetBtn' + p)
                viewSheet.innerText = "View Character Sheet"
                var funcHelper = presets[p].id

                viewSheet.onclick = function () { // this is the users choice, load and display.
                    loadPreset(presets[p].id)
                    window.location.href = "../html/charsheet.html"
                }
                boxR.appendChild(viewSheet)

            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Put all explainer information on the page that is found in guide.json.
function loadExplainer(page, iter) {
    console.log("Loading explainer...")
    explainerDiv = document.getElementById("explainer")
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]
            explainerDiv.innerHTML = highlightTextWithMouseover(currentPage.explainer.details, allDetails)
            continueBtn = document.createElement('button')
            continueBtn.setAttribute('id', 'beginButton')
            continueBtn.innerText = 'Begin'

            continueBtn.onclick = function () { // move on to beging the question sequence.
                clearDiv(explainerDiv)
                alterState(page, 1)
                loadQuestion(page)
                document.getElementById('content').removeChild(continueBtn)
            }
            document.getElementById('content').appendChild(continueBtn)
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// Given a div, remove all children.
function clearDiv(div) {
    while (div.firstChild) { // delete all buttons, since we are done with this question
        div.removeChild(div.firstChild)
    }
}

// Given a div, remove the children except for divs passed into the function
function removeAllChildrenExceptOne(divIdToKeep) {
    var parentDiv = document.getElementById('content'); // replace with your actual parent div id
    var children = parentDiv.children;

    for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];

        // Check if the child has the relevant id to keep
        if (child.id !== divIdToKeep) {
            parentDiv.removeChild(child);
        }
    }
}

// Sets alignment information
function setAlignmentInfo() {
    const alignButtons = Array.from(document.getElementsByName('_alignment'));
    alignButtons.forEach((button, index) => {
        button.addEventListener('mouseenter', function () {
            // Code to run when the button is hovered over
            // button.style.backgroundColor = 'rgb(119, 45, 45)'; // Change background color, for example
            fetch('/guide.json')
                .then(response => response.json())
                .then(data => {
                    // Use the JSON data here
                    const v = button.value;
                    const desc = data.background.alignment.options[v];
                    document.getElementById('alignmentSelection').innerText = v + ": " + desc;
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        });

        // Add a mouseout event listener to reset the button's appearance
        button.addEventListener('mouseout', function () {
            // Code to run when the mouse moves out of the button
            button.style.backgroundColor = ''; // Reset background color
        });
    });
}

// access guide.json and get the races, including explainations. 
function races() {
    const res = document.getElementById("raceExplainer");
    const helperStart = document.getElementById('helperInfo')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            res.innerText = data.race.explainer;
            helperStart.innerHTML = data.race.explainer.details
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// simply capitalize a string and return
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// For class race and getting started, use this method to load the information found in the json.
function initPageInfo(page, iter) {

    if (localStorage.getItem('_' + page) != "") { // alert of special case
        console.log("In special case on page")
    }
    if (localStorage.getItem(page + 'Done') == 'true') {
        if (page == 'class') localStorage.setItem('_classState', '0')
        conclusion(page) // Done with this page, debrief the user
    }

    // fetch the guide info for the page, based in the current state of the sequence
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]
            switch (Object.keys(currentPage)[iter]) {
                case "welcome":
                    setWelcomeInfo(page) // adds continue button on return
                    break;
                case "explainer":
                    loadExplainer(page, iter)
                    break;
                case "questions":
                    loadQuestion(page)
                    break;
                default:
                    console.log("No info type found, handling")
                    handleSpecialCase(page)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// we have a special case on the page, handle this case (currently only actionable event is that subrace is done)
function handleSpecialCase(page) {
    switch (page) {
        case 'race':
            console.log("Handling: " + localStorage.getItem('_subRace'))
            if (localStorage.getItem('subRaceDone') == '1') {
                conclusion('race')
            }
            else {
                loadResponse(page, 'subRace')
            }
            break;
        case 'class':
            console.log("In class case, state is ", localStorage.getItem('classState'))

        default: return
    }
}

// Recursively calls all question in the json data.
// Once the final question is answered (using button listeners),
// the response operation occurs if it exists. (for now only "set" operations are handled, 
// but more operations can be added easily).
function loadQuestion(page) {

    const question = document.getElementById('prompt'); // get the question div from html
    const tempButtonsId = [] // all buttons go here so they can be deleted once the question is done.
    q = 'q' + localStorage.getItem(page + 'State'); // create the string that accesses the race state (what question the user is on) from localstorage
    var state = parseInt(localStorage.getItem(page + 'State'));
    fetch('/guide.json') // open json data
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]; // seek data from the current page (race, class, etc)
            const questionJSON = currentPage.questions[q]; // get question based on state
            try {  // try to load the question
                question.innerText = questionJSON.q;
            }
            catch { // question is null, we are at the end of the sequence
                if (page == 'race') {
                    const qDiv = document.getElementById('question'); // get question div
                    // Get all elements within the div
                    const childElements = qDiv.getElementsByTagName('*');
                    // Initialize an index for the while loop
                    let i = 0;
                    // Use a while loop to set inner text to ''
                    while (i < childElements.length) {
                        const element = childElements[i];
                        element.innerText = '';
                        i++;
                    }

                    // Remove all test elements within the div, since we are done with the questions
                    // while (qDiv.firstChild) {
                    //     qDiv.removeChild(qDiv.firstChild);
                    // }
                    loadResponse(page, currentPage.questions.response.type) // move on to the response to the questions, if it exists
                    return
                }
            }
            answers = currentPage.questions[q].ans // get array of possible answers to the question

            // create buttons for each answer, assigning the value of the buttons the 
            // subset of options each answer returns (example: player wants short race, 
            // so the button "short" is assigned the value [dwarf, halfling etc]. This is from the json data)
            for (let ans in answers) {
                // create new button based on the answer
                var answerButton = document.createElement("button");
                answerButton.setAttribute('id', ans)
                var buttonText = document.createTextNode(ans);
                answerButton.appendChild(buttonText);

                document.getElementById('answers').appendChild(answerButton); // add button to the answers div
                document.getElementById(ans).setAttribute('value', answers[ans])
                tempButtonsId.push(ans) // add button to array that will be deleted when the user has answered the question
                answerButton.onclick = function () {
                    // get the intersection of the returned set and the new set
                    localStorage.setItem('$' + page, answers[ans][0])
                    alterState(page, nextQuestion(answers[ans])); // add one to the state, so we go to the next question
                    for (btn in tempButtonsId) { // delete all buttons, since we are done with this question
                        document.getElementById(tempButtonsId[btn]).remove()
                    }
                    document.getElementById('backbutton').remove()

                    if (page == 'class' && answers[ans][2].charAt(0) == '-') {
                        setClass(answers[ans][0])
                        console.log("Class tree decision handling...")
                        classResponseHandler(answers[ans][2])

                    } else {
                        loadQuestion(page) // load the next question

                    }

                }; // set actions for the buttons
                loadHelperInfoFromButton(answerButton, answers[ans]) // add the helper information to the page, explaining the implications of the choice.
            }
            backBtn = document.createElement('button')
            backBtn.setAttribute("id", 'backbutton')
            backBtn.innerText = "Back"
            backBtn.onclick = function () {
                for (btn in tempButtonsId) { // delete all buttons, since we are done with this question
                    document.getElementById(tempButtonsId[btn]).remove()
                }
                document.getElementById('backbutton').remove()
                if (questionJSON.back == 'beginning') {
                    // localStorage.setItem("raceState","1");
                    alterState(page, "0")
                    loadExplainer(page, 0)
                }
                else {
                    alterState(page, (questionJSON.back));
                    loadQuestion(page)
                }


            }
            document.getElementById('content').appendChild(backBtn)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Handle the tools for Bard, Druid, Monk and Rogue. All other classes do not require tool proficiencies.
function handleTools() {
    clss = localStorage.getItem('_class')
    // content = document.getElementById('content')
    const toolDiv = appendToContent('div')
    explainer = document.createElement('div')
    toolDiv.appendChild(explainer)

    if (clss == 'Bard') {
        // pick 3 lessons
        explainer.innerText = 'As a Bard, you get to choose three musical instruments to be proficient with.'
        const instrumentTable = createInstrumentTable('Musical Instruments', instrumentData);
        explainer.appendChild(instrumentTable);

    }
    else if (clss == 'Druid') {
        // Inform and load herbalism kit prof

        explainer.innerText = 'As a Druid, you are proficient with an Herbalism Kit. This kit allows you to create remedies and potions which can help you and your team.'
    }
    else if (clss == 'Monk') {
        // Choose one type of artisan's tools or one musical instrument

        explainer.innerText = 'As a Monk, you need to choose one artisan tool OR one musical instrument.'

        // Init both tables with data from the json.
        const instrumentTable = createInstrumentTable('Musical Instruments', instrumentData)
        const artisanTools = createToolsTable('Artisan Tools', artisanToolData)
        musicalInstBtn = document.createElement('button')
        toolDiv.appendChild(musicalInstBtn)
        musicalInstBtn.innerText = 'Musical Instruments'
        artToolsBtn = document.createElement('button')
        toolDiv.appendChild(artToolsBtn)
        artToolsBtn.innerText = 'Artisan Tools'

        // if user wants to choose a musical instrument
        musicalInstBtn.onclick = function () {
            try { // to remove artisan tools if they already browsed
                toolDiv.removeChild(artisanTools)
            }
            catch {
                console.log("Removed table")
            }

            toolDiv.appendChild(instrumentTable)
        }

        // the user wants to choose an artisan tool
        artToolsBtn.onclick = function () {
            try { // to remove instruments if they already browsed
                toolDiv.removeChild(instrumentTable)
            }
            catch {
                console.log("Removed table")
            }
            toolDiv.appendChild(artisanTools)
        }

    }
    else if (clss == 'Rogue') {
        // Inform and load Thieve's tools
        explainer.innerText = 'As a Rogue, you are proficient with Thieve\'s tools. These tools give you a better change at opening locks and disarming traps you may encounter.'
    }

    // these cases have been presented, when user is ready, move on to choose skills
    contBtn = newContinueButton(true)
    contBtn.onclick = function () {
        chooseSkills(_class)
    }
}

// Creates a table with the possible tools
function createToolsTable(title, toolsList) {
    const table = document.createElement('table');
    table.setAttribute('id', 'langTable');
    const caption = table.createCaption();
    caption.textContent = title;

    let selectedRow = null; // Variable to store the currently selected row

    // Create header row
    const headerRow = table.insertRow();

    // Create rows for each tool
    toolsList.forEach((tool) => {
        const row = table.insertRow();
        row.addEventListener('click', () => {
            // Toggle row color
            if (selectedRow === row) {
                row.style.backgroundColor = ''; // Unselect the row
                selectedRow = null;
            } else {
                // Unselect the previously selected row
                if (selectedRow) {
                    selectedRow.style.backgroundColor = '';
                }
                row.style.backgroundColor = 'rgb(119, 45, 45)'; // Select the row
                selectedRow = row;
            }
        });

        const toolCell = row.insertCell();
        toolCell.textContent = tool;
    });

    return table;
}

//Create a table with possible instruments
function createInstrumentTable(title, instruments) {
    const table = document.createElement('table');
    table.setAttribute('id', 'langTable');
    const caption = table.createCaption();
    caption.textContent = title;

    let selectedRow = null; // Variable to store the currently selected row

    // Create header row
    const headerRow = table.insertRow();

    // Create rows for each instrument
    instruments.forEach((instrument) => {
        const row = table.insertRow();
        row.addEventListener('click', () => {
            // Toggle row color
            if (selectedRow === row) {
                row.style.backgroundColor = ''; // Unselect the row
                selectedRow = null;
            } else {
                // Unselect the previously selected row
                if (selectedRow) {
                    selectedRow.style.backgroundColor = '';
                }
                row.style.backgroundColor = 'rgb(119, 45, 45)'; // Select the row
                selectedRow = row;
            }
        });

        const instrumentCell = row.insertCell();
        instrumentCell.textContent = instrument;
    });

    return table;
}


// Used in dcecision tree for class, these classes have special information that the user needs to be alerted of, and make choices.
function classResponseHandler(type) {
    if (type == '->fighter') {
        console.log("Handling fighter case...")
        handleFighter()
    }
    else if (type == '->ranger') {
        console.log('Handling Rogue case...')
        handleRanger()
    }
    else if (type == '->warlock') {
        handleWarlock()
    }
    else if (type == '->sorcerer') {
        handleSorcerer()
    }
    else if (type == '->cleric') {
        handleCleric()
    }
    else {
        classDebrief()
    }
}

// The cleric class requires a divine domain to be chosen.
function handleCleric() {
    const divineDomains = [
        "Knowledge",
        "Life",
        "Light",
        "Nature",
        "Tempest",
        "Trickery",
        "War"
    ];

    choice = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            dDomain = data.divineDomains
            // Use the JSON data here
            for (var d in divineDomains) {
                const dom = divineDomains[d]
                const sBtn = document.createElement('button')
                sBtn.innerText = divineDomains[d]
                spellsGiven = dDomain[dom].spells.split(',')
                sBtn.onclick = function () {
                    localStorage.setItem("_divineDomain", sBtn.innerText)
                    // Set level one spells for the domain
                    for (const s in spellsGiven) {
                        // load all the spells based in the users divine domain.
                        num = parseInt(s) + 1
                        console.log(num + '   s')
                        localStorage.setItem('_' + (num), spellsGiven[s])
                    }
                    classDebrief() // move on
                }
                choice.push(sBtn)

                // load helper info for divine domains
                sBtn.addEventListener('mouseenter', function () {
                    helperInfoDiv = document.getElementById('helperInfo')
                    helperInfoDiv.innerText = dDomain[dom].desc

                    spellExpDiv = document.createElement('div')
                    spellExpDiv.innerText = "You will be given the following level one spells:"
                    helperInfoDiv.appendChild(spellExpDiv)
                    for (sp in spellsGiven) {
                        var spDiv = document.createElement('div')
                        helperInfoDiv.appendChild(spDiv)
                        spDiv.innerText = spellsGiven[sp]
                    }
                })
            }
            basicQuestionAnswer(
                "Each domain comes with specific spells and features upon selection at 1st level. Gain enhanced Channel Divinity options at 2nd level, and additional benefits at 6th, 8th, and 17th levels.",
                choice,
                "Select a domain aligned with your deity: Knowledge, Life, Light, Nature, Tempest, Trickery, or War."
            )
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Sorcerers must choose their origin. Two options are allowed. Load options, present helper info, 
// and gather input
function handleSorcerer() {
    const originsOpts = [
        "Draconic Bloodline",
        "Wild Magic"
    ]
    choice = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            origin = data.origins
            // Use the JSON data here
            for (o in originsOpts) {
                const ori = originsOpts[o]
                const sBtn = document.createElement('button')
                sBtn.innerText = originsOpts[o]
                sBtn.onclick = function () {
                    localStorage.setItem("_origin", sBtn.innerText)
                    classDebrief()
                }
                choice.push(sBtn)
                sBtn.addEventListener('mouseenter', function () {
                    document.getElementById('helperInfo').innerText = origin[ori]
                })
            }
            basicQuestionAnswer(
                "If you pick wild, then your magic stems from ancient bargains with dragons or mingling with draconic blood. You may be part of an established bloodline or the pioneer of a new one. Or alternatively you can pick a dragonic bloodline, and your magic arises from chaotic forces, influenced by exposure to raw magic, encounters with fey or demons, or simply as a fluke of birth. This unpredictable magic awaits expression through you.",
                choice,
                "Sorcerers harness innate magic, and their origins broadly fall into two categories: draconic bloodline and wild magic."
            )
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Warlocks have a patron they are bound to. Help, gather, move on.
function handleWarlock() {
    const patrons = [
        "The Archfey",
        "The Fiend",
        "The Great Old One"
    ]
    choice = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            pats = data.patrons
            // Use the JSON data here
            for (p in patrons) {
                const pat = patrons[p]
                const sBtn = document.createElement('button')
                sBtn.innerText = patrons[p]
                sBtn.onclick = function () {
                    localStorage.setItem("_patron", sBtn.innerText)
                    classDebrief()
                }
                choice.push(sBtn)
                sBtn.addEventListener('mouseenter', function () {
                    document.getElementById('helperInfo').innerText = pats[pat]
                })
            }
            basicQuestionAnswer(
                "Warlock patrons are powerful beings from other planes, almost godlike in their might. These entities grant their warlocks unique powers and invocations, expecting significant favors in return. Some freely share mystic knowledge, while others are more selective, making pacts with only a single warlock. Warlocks serving the same patron may see each other as allies, siblings, or rivals.",
                choice,
                "You have been assigned Warlock, and you need to pick a patron."
            )
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Rangers have to choose a prefered enemy. Load help info, gather input, move on.
function handleRanger() {
    const creatureTypes = [
        "Aberrations",
        "Beasts",
        "Celestials",
        "Constructs",
        "Dragons",
        "Elementals",
        "Fey",
        "Fiends",
        "Giants",
        "Monstrosities",
        "Oozes",
        "Plants",
        "Undead"
    ];
    prefEnemies = []

    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            creatures = data.preferredEnemies
            // Use the JSON data here
            for (cr in creatureTypes) {
                const ct = creatureTypes[cr]
                const sBtn = document.createElement('button')
                sBtn.innerText = creatureTypes[cr]
                sBtn.onclick = function () {
                    localStorage.setItem("_preferredEnemy", sBtn.innerText)
                    classDebrief()
                }
                prefEnemies.push(sBtn)
                sBtn.addEventListener('mouseenter', function () {
                    document.getElementById('helperInfo').innerText = creatures[ct]
                })
            }
            basicQuestionAnswer(
                "You have been assigned the Ranger class. As a Ranger, you are required to choose a favored enemy. You'll have advantages when fighting or tracking them.",
                prefEnemies
            )
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// Fighters have a preferred fighting style. Load options, explain, gather input, move on.
function handleFighter() {
    fightingStyles = ["Archery", "Defense", "Dueling", "Great Weapon Fighting", "Protection", "Two-Weapon Fighting"]
    choices = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            fighterDesc = data.fightingStyles
            console.log("fighdesc: " + fighterDesc.Archery)
            // Use the JSON data here
            for (style in fightingStyles) {
                console.log("Style is " + fightingStyles[style])
                const fs = fightingStyles[style]
                const sBtn = document.createElement('button')
                sBtn.innerText = fightingStyles[style]
                sBtn.onclick = function () {
                    localStorage.setItem("_fightingStyle", sBtn.innerText)
                    classDebrief()
                }
                choices.push(sBtn)
                sBtn.addEventListener('mouseenter', function () {
                    document.getElementById('helperInfo').innerText = fighterDesc[fs]
                })
            }
            basicQuestionAnswer(
                "You have been assigned the Fighter class. As a Fighter, you are required to choose a fighting style. This will impact your combat strategy and the equipment you have.",
                choices
            )
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Class sequence is done, show their saving throws
function classDebrief() {
    _class = localStorage.getItem('_class')
    localStorage.setItem('classDone', 'true')
    showSavingThrows(_class)
}

// Requests weapon profs from the class CSV to be displayed and loaded to the character sheet.
var weaponProfs = []
function getWeaponProfs() {
    getFromCSV('classFeatures.csv', localStorage.getItem('_class'), 'Weapon Proficiencies')
        .then(data => {
            if (data !== null) {
                profs = data.split(',')
                for (p in profs) {
                    weaponProfs.push(profs[p])
                    addToLocalStorageString('_weaponProfs', profs[p])
                }
            }
        })
}


var weaponsChosen = 1

// call this function to give options for selecting weapons and equipment 
// from the weapons tables.
function anyWeaponChoice(type, iter, numChoices) {
    console.log("In any weapon choice, type: " + type)
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            wpns = data.weapons[type]
            for (let w in wpns) {
                const weapon = wpns[w]
                const wBtn = appendToContent('button', 'smallDiv')
                wBtn.innerText = wpns[w].name
                wBtn.onclick = function () {

                    localStorage.setItem('_attSp' + weaponsChosen + 'Name', weapon.name)
                    // Notably, attack bonus has not been calculated
                    localStorage.setItem('_attSp' + weaponsChosen + 'Dam', weapon.damage)

                    if (++weaponsChosen > numChoices) {
                        console.log("weapon limit reached TODO")
                        chooseEquipment(++iter)
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Based on the user's chosen class, provide an explaination of their saving throws.
function showSavingThrows(_class) {
    getWeaponProfs()
    content = clearContentAndGet()
    var savingThrows = appendToContent('div')
    console.log('class: ' + _class)
    getFromCSV('classFeatures.csv', _class, 'Saving Throw Proficiencies')
        .then(data => {
            if (data !== null) {
                opts = data.split(',')
                savingThrows.innerHTML = highlightTextWithMouseover(
                    "You have been assigned the class " + _class + ". You have " + opts[0] + " and " + opts[1] + " saving throws.",
                    allDetails
                )
                weaponProfsDiv = appendToContent('div')
                weaponProfsDiv.innerHTML = highlightTextWithMouseover(
                    'Also, you have the following weapon proficiencies:',
                    allDetails
                )
                for (const pr in weaponProfs) {
                    const pDiv = appendToContent('div', 'smallDiv')
                    pDiv.innerHTML = highlightTextWithMouseover(
                        weaponProfs[pr],
                        allDetails
                    )
                }
                // Since there are always two saving throws, show them here from a split string
                st1 = opts[0] + "-save-prof"
                st2 = opts[1] + "-save-prof"
                localStorage.setItem("_trueSavingThrows", st1 + "," + st2)
                handleTools()
            }
            else {
                console.log("Target Not Found for showSavingThrows");
            }
        })
}


// User is required to choose additional skills to be proficient in, these options are based on class and provided here.
function chooseSkills(_class) {

    var chosenProfs = []
    content = clearContentAndGet()
    skillChoices = appendToContent('div')
    getFromCSV('classFeatures.csv', _class, 'Skills')
        .then(data => {
            if (data !== null) {
                opts = data.split(';')
                numChoices = opts[0].split(' ') // index 1

                skillChoices.innerHTML = highlightTextWithMouseover(
                    "You also get to choose " + numChoices[1] + " of the following skills to become a proficiency.",
                    allDetails
                )
                cBtn = newContinueButton(false)
                cBtn.disabled = true
                profs = opts[1].split(",")
                console.log("profs: " + profs)
                var avail = 0
                for (p in profs) {
                    const btn = appendToContent('button')
                    btn.setAttribute('id', 'smallBtn')
                    btn.innerText = profs[p]
                    clicked = 0
                    let isClicked = false;

                    // load helper info when option is hovered over.
                    btn.addEventListener('mouseenter', function () {
                        fetch('/guide.json')
                            .then(response => response.json())
                            .then(data => {
                                skillDesc = data.skills[btn.innerText.toLowerCase()]
                                helperInfo = document.getElementById('helperInfo')
                                helperInfo.innerText = skillDesc
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    })

                    btn.onclick = function () {

                        isClicked = !isClicked; // Toggle the state
                        console.log("Is clicked: " + isClicked)
                        if (isClicked) {
                            if (clicked >= numChoices[1]) {
                                isClicked = !isClicked
                                return
                            }
                            btn.style.backgroundColor = "rgb(119, 45, 45)";
                            clicked++
                            chosenProfs.push(btn.innerText)
                        } else {
                            btn.style.backgroundColor = "#454545";
                            clicked--
                            chosenProfs = chosenProfs.filter(item => item !== btn.innerText);
                        }
                        console.log(clicked + ' num choices: ' + numChoices[1])
                        if (clicked == numChoices[1]) cBtn.disabled = false
                    };
                }
                content.appendChild(cBtn)
                cBtn.onclick = function () {
                    res = ""
                    console.log(chosenProfs)
                    for (p in chosenProfs) {
                        res = res + chosenProfs[p] + ","
                    }
                    console.log(res.slice(0, -1))
                    localStorage.setItem('classDone', 'true')
                    localStorage.setItem('_profFromClass', res.slice(0, -1))
                    window.location.href = '../html/background.html'
                    beginBackground()
                }
            }
            else {
                console.log("Target Not Found for chooseSkills");
            }
        })
}

// Given the json data for a question, access the pointer value of the next question and return that value
function nextQuestion(previousAnswer) {
    console.log("Previous answer: " + previousAnswer[2])
    if (previousAnswer[2] == '->more') { // handled elsewhere
        console.log("In more case")
    }
    return parseInt(previousAnswer[2])
}


// function extractNames(inputString, asSet = false) {
//     if (asSet) {
//         // Initialize a Set to store names
//         const namesSet = new Set();
//         // Split the input string by commas to separate elements
//         const parts = inputString.split(',');
//         for (const part of parts) {
//             // Split each part by a semicolon to separate the name and value
//             const elements = part.split(';');
//             // Check if the part has the required format (name;value)
//             if (elements.length === 2) {
//                 const name = elements[0].trim(); // Extract and trim the name
//                 namesSet.add(name); // Add the name to the set
//             }
//         }
//         return namesSet; // Return the set of names
//     } else {
//         // Initialize an array to store names
//         const namesArray = [];
//         // Split the input string by commas to separate elements
//         const parts = inputString.split(',');
//         for (const part of parts) {
//             // Split each part by a semicolon to separate the name and value
//             const elements = part.split(';');
//             // Check if the part has the required format (name;value)
//             if (elements.length === 2) {
//                 const name = elements[0].trim(); // Extract and trim the name
//                 namesArray.push(name); // Add the name to the array
//             }
//         }
//         // Join the names in the array into a comma-separated string
//         const namesString = namesArray.join(', ');
//         return namesString; // Return the string of names
//     }
// }


// Per
// function combineValues(string1, string2) {
//     const result = new Map();

//     function parseString(inputString) {
//         const parts = inputString.split(',');

//         for (const part of parts) {
//             const elements = part.split(';');
//             if (elements.length === 2) {
//                 const name = elements[0];
//                 const value = parseInt(elements[1]);

//                 if (!isNaN(value)) {
//                     if (result.has(name)) {
//                         result.set(name, result.get(name) + value);
//                     } else {
//                         result.set(name, value);
//                     }
//                 }
//             }
//         }
//     }

//     parseString(string1);
//     parseString(string2);

//     const combinedString = Array.from(result, ([name, value]) => `${name};${value}`).join(',');
//     return combinedString;
// }

// put this in alterstate param. Checks for
// the next question that actually changes the working set
// function checkAnswerViability(title, currentPage, qNumber) {
//     var nextQ = currentPage.questions['q' + (qNumber + 1)];
//     if (nextQ === undefined) return 1
//     workingSet = localStorage.getItem('$' + title)
//     for (var ans in nextQ.ans) {
//         if (setFunctions("intersection", workingSet, nextQ.ans[ans][0]).length == 0) {
//             return 1 + checkAnswerViability(title, currentPage, qNumber + 1)
//         }
//     }
//     return 0
// }

// Function uses the json data attached to each question, specifically the helpful information.
// loads it to the right column of the page when the user hovers over the option.
function loadHelperInfoFromButton(button, jsonData) {
    button.addEventListener('mouseenter', function () {
        // Code to run when the button is hovered over
        // button.style.backgroundColor = 'rgb(119, 45, 45)'; // Change background color, for example
        fetch('/guide.json')
            .then(response => response.json())
            .then(data => {
                // Use the JSON data here
                document.getElementById('helperInfo').innerText = jsonData[1]
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });

    // Add a mouseout event listener to reset the button's appearance
    button.addEventListener('mouseout', function () {
        // Code to run when the mouse moves out of the button
        button.style.backgroundColor = ''; // Reset background color
    });
}

// Depending on the response type, we load that to the main column.
// Example: A series of quesitons might narrow down a set of options for the player to choose from.
// those options are loaded here.
function loadResponse(page, type) {
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            switch (type) {
                case "set": // we present user with options
                    giveChoices(page)

                    break;
                case "subRace":
                    console.log("In subrace case")
                    giveChoices(page)
                    break;

                default: // no response detected, not necesarily an error.
                    console.error("Potential Error: response did not load (no response may be needed)");
                    break;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Creates buttons based on choices from a series of questions.
function giveChoices(page) {
    const tempButtons = []
    const div = document.getElementById('response')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            //reset the page elements in left column
            setElementsInColumnOne({
                title: page.charAt(0).toUpperCase() + page.slice(1),
                explanation: 'Please choose one of the following options:',
            })
            responses = data[page].questions.response
            set = localStorage.getItem(responses.options)
            let options = set.split(',')
            switch (page) {
                case "race":
                    raceChoices(options, tempButtons, div, page);
                    break;
                case "class":
                    // classChoices(options, tempButtons, div, page);
                    break;
                default:
                    console.log("Case not handled in giveChoices()")
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Specific to race choices. Load the given html elements with the given options
function raceChoices(options, tempButtons, div, page) {
    console.log("In race choices")
    for (const r in options) {
        const choice = document.createElement('button');
        const raceD = {}
        raceD.id = options[r]

        if (options[r].includes('Dragonborn')) {
            raceD.val = raceDiscreptionDiv('Dragonborn')
        }
        else {
            raceD.val = raceDiscreptionDiv(options[r])
        }
        divCache.push(raceD)
        choice.setAttribute('id', 'choiceButton')
        choice.innerText = options[r]
        choice.onclick = function () {
            if (options[r].includes('Dragonborn')) {
                localStorage.setItem('_subrace', options[r])
                localStorage.setItem('_race', options[r])
                loadSpeed('Dragonborn')
            }
            else {
                localStorage.setItem('_' + page, options[r])
                loadSpeed(options[r])
            }

            for (btn in tempButtons) { // delete all buttons, since we are done with this question
                document.getElementById('choiceButton').remove()
            }
            if (page == 'race') pickSubrace(options[r])

        }; // set actions for the buttons (clear and load new helper info)
        choice.addEventListener('mouseenter', function () {
            clearHelperInfo()
            document.getElementById('helperInfo').appendChild(divCache[r].val)
        })
        tempButtons.push(choice)
        div.appendChild(choice)
    }
}

// Pipe speed into the character sheet from race spreadsheet.
function loadSpeed(race) {
    console.log("Loading speed for " + race)
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            spd = data.races[race].speed
            appendToCharacterSheet('_speed', spd)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// helper function that appends a current a local storage value based on the key (item)
function appendToCharacterSheet(item, string) {
    i = localStorage.getItem(item)
    if (i == null) {
        localStorage.setItem(item, string)
        return
    }
    i = i + string
    localStorage.setItem(item, i)
}


// Load the options for class choices based on json objects. Part of the question sequence.
function classChoices(options, tempButtons, div, page) {
    console.log("In class choices")
    if (options > 0) {

        setElementsInColumnOne({
            title: page.charAt(0).toUpperCase() + page.slice(1),
            explanation: 'Please choose one of the following races:',
        })
        for (const c in options) {
            const choice = document.createElement('button');
            classD = {}
            classD.id = options[c]

            classD.val = classDescriptionDiv(options[c])

            divCache.push(classD)
            choice.setAttribute('id', 'choiceButton')
            choice.innerText = options[c]
            choice.onclick = function () {
                localStorage.setItem('_' + page, options[c])
                for (btn in tempButtons) { // delete all buttons, since we are done with this question
                    document.getElementById('choiceButton').remove()
                }
                // Set the class
                setClass(options[c]);

            }; // set actions for the buttons
            choice.addEventListener('mouseenter', function () {
                clearHelperInfo()
                document.getElementById('helperInfo').appendChild(divCache[c].val)
            })
            tempButtons.push(choice)
            div.appendChild(choice)
        }
    } else {
        content = clearContentAndGet()

    }
}

// Since class is really class and level, and level is always 1 for the current project iteration,
// append 1 to the class name.
function setClass(_class) {
    localStorage.setItem("_classlevel", _class + " 1");
    localStorage.setItem("_class", _class)
}

// Remove all helper info strings, keep the divs
function clearHelperInfo() {
    document.getElementById('helperInfo').innerText = ''
    document.getElementById('helperInfo').innerHTML = ''

}

// Remove all main info, keep the html elements
function clearMainInfo() {
    document.getElementById('title').innerText = ""
    document.getElementById('explainer').innerText = ""
    document.getElementById('question').innerText = ""
    // document.getElementById('prompt').innerText = ""


}

// Gather API info (string must be lowercase)
function raceDiscreptionDiv(race) {
    res = races(race.toLowerCase())
    return res

}

// Load the discriptions for class information to the html elements.
function classDescriptionDiv(_class) {
    const res = document.createElement('div')
    res.setAttribute('id', 'raceDesc' + _class)
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            info = data.class.classes[_class]
            res.innerHTML = '<h2>' + _class + '</h2>' +
                '<div>' + info.desc + '<div>' +
                '<div>Primary Ability: ' + info.primaryAbility + '<div>' +
                '<div>Saving Throws: ' + info.savingThrows + '<div>' +
                '<div>Armor & Weapon Proficiencies: ' + info.ArmorWeaponProf + '<div>', allDetails
            return res
        })
        .catch(error => {
            console.error('Error:', error);
        });
    return res
}

// Race has been chosen, the user must now select a subrace.
// Dragonborn subrace info is handled elsewhere as a special case.
function pickSubrace(race) {
    const tempButtonsId = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            // if no subrace is to be chosen (dragonborn or half-breeds).
            if (data['race'].subRace[race] === undefined) {
                localStorage.setItem("_race", race)
                localStorage.setItem('_subRace', race)

                clearMainInfo()
                conclusion("race")
                return
            }

            // Load subrace info
            setElementsInColumnOne({
                title: 'Race: ' + race,
                explanation: 'Now choose your ' + race + '\'s subrace:',
                responseTitle: ''
            })
            opts = data['race'].subRace[race]
            for (const o in opts) {
                btn = document.createElement('button')
                btn.setAttribute('id', o)
                btn.innerText = o
                btn.onclick = function () { // choice selected. remove, unload and move on
                    localStorage.setItem('_subRace', o)
                    localStorage.setItem('_race', o)
                    clearMainInfo()

                    for (const b in tempButtonsId) {
                        document.getElementById(tempButtonsId[b]).remove()
                    }
                    localStorage.setItem('subRaceDone', '1')
                    conclusion('race')
                }
                btn.addEventListener('mouseenter', function () {
                    clearHelperInfo()
                    document.getElementById('helperInfo').innerHTML = opts[o]
                })
                document.getElementById('content').appendChild(btn)
                tempButtonsId.push(btn.id)
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Debfied user on the conclusion. Let them know their choice has been logged.
function classConclusion() {
    content = clearContentAndGet()
    classDoneDiv = appendToContent('div')
    classDoneDiv.innerText = 'You have choosen ' + localStorage.getItem('_class') + ' as your class. If you\'d like to reset your class, you\'ll lose all progress after this section and need to do it again.'
}

// Generic conclusion function for each page. Uses guide.json to add the information we need to display.
function conclusion(page, specialCase = false, typeOfSpecialCase = '') {
    if (page == 'class') classConclusion()

    // const conclusionDiv = document.createElement('div')
    // conclusionDiv.setAttribute('id', 'conclusionDiv')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('content').innerHTML = highlightTextWithMouseover(data[page].conclusion.header)

            if (page == 'race') {
                addRaceImage(localStorage.getItem('_race'))
            }

            if (localStorage.getItem(page + 'Done') == 'true') {
                doneDiv = appendToContent('div')
                doneDiv.innerText = 'If you want to reset your ' + page + ' you will lose all progress on your character after this point.'
                resetBtn = appendToContent('button')
                resetBtn.innerText = 'Reset'
                resetBtn.onclick = function () {
                    console.log('implement this reset button')
                    resetProgress(page)
                }
            }
            continueToNextPage(page, data[page].conclusion.next)
            try {
                document.getElementById('explainer').innerHTML = raceDiscreptionDiv(localStorage.getItem('_race'))
            }
            catch {
                console.log("No explainer do get rid of")
            }
        })

        .catch(error => {
            console.error('Error:', error);
        });


}

// Link the png profile images for each race.
function addRaceImage(race) {
    parsedRace = parseForGenericRace(race)
    if (parsedRace !== 'no image') {
        console.log("Adding race image for " + parsedRace)
        pImg = document.createElement('img')
        pImg.setAttribute('src', '../img/raceImg/' + parsedRace + '.png')
        content = document.getElementById('content')
        content.appendChild(pImg)
    }
}

// Since races are logged as the subrace (which always has the generic race as a substring), we account for 
// cases where generic races needs to be handled.
function parseForGenericRace(race) {
    if (race == 'Hill Dwarf') return 'Dwarf'
    if (race == 'Mountain Dwarf') return 'Dwarf'
    if (race == 'Lightfoot Halfling') return 'Halfling'
    if (race == 'Stout Halfling') return 'Halfling'
    if (race == 'Forest Gnome') return 'Gnome'
    if (race == 'Rock Gnome') return 'Gnome'
    if (race == 'High Elf') return 'Elf'
    if (race == 'Wood Elf') return 'Elf'
    if (race == 'Dark Elf (Drow)') return 'Elf'
    if (race.includes('Dragonborn')) return 'Dragonborn'
    if (race == 'Human') return 'no image'
    return race
}

// Move from one html page to the next, both given as parameters.
function continueToNextPage(currentPage, nextPage) {
    btn = document.createElement('button')
    btn.setAttribute('id', 'continueBtn')
    btn.innerText = "Continue"
    btn.onclick = function () {
        window.location.href = "../html/" + nextPage + ".html"
        localStorage.setItem(currentPage + 'Done', 'true')
    }
    document.getElementById('content').appendChild(btn)
}

// Resets the gathered data. Pages depend on each other, so 
// If a page is reset, so are all pages after (user is alerted of this behavior)
// Simply clear localStorage values for the info gained on the current page.
function resetProgress(current) {
    if (current == 'race') {
        currName = localStorage.getItem('_playername')
        init()
        localStorage.setItem('_playername', currName)
        location.reload()
    } else if (current == 'class') {
        localStorage.setItem('_class', '')
        localStorage.setItem('_classlevel', '')
        resetProgress('background')
        resetProgress('equipment')
        localStorage.setItem('classState', '0')
        localStorage.setItem('classDone', 'false')
        location.reload()

        initPageInfo('class', '0')
    }
    else if (current == 'background') {
        console.log("Removing background items...")

        localStorage.setItem('backgroundState', '0')
        location.reload()
    }
    else if (current == 'equipment') {
        console.log('Removing equipment items...')
    }
}

// Set data in the main div (column one)
function setElementsInColumnOne(requestedElements) {
    // Retrieve the parent div
    const contentDiv = document.getElementById('content');

    // Check if each requested element should be set
    if (requestedElements.title) {
        // Set the title
        const titleElement = document.getElementById('title');
        titleElement.innerText = requestedElements.title;
    }

    if (requestedElements.explanation) {
        // Set the explanation
        const explainerDiv = document.getElementById('explainer');
        explainerDiv.innerText = requestedElements.explanation;
    }

    if (requestedElements.prompt) {
        // Set the prompt
        const promptElement = document.getElementById('prompt');
        promptElement.innerText = requestedElements.prompt;
    }

    if (requestedElements.answers) {
        // Set the answers
        const answersDiv = document.getElementById('answers');
        answersDiv.innerText = requestedElements.answers;
    }

    if (requestedElements.responseTitle) {
        // Set the response title
        const responseTitleElement = document.getElementById('responseTitle');
        responseTitleElement.innerText = requestedElements.responseTitle;
    }
}

// 
// function getItemsWithHighestValues(inputString) {
//     const pairs = inputString.split(',');
//     let highestValue = -1;
//     let secondHighestValue = -1;
//     let highestValueRaces = [];
//     let secondHighestValueRaces = [];

//     pairs.forEach(pair => {
//         const [race, value] = pair.split(';');
//         const numericValue = parseInt(value, 10);

//         if (numericValue > highestValue) {
//             secondHighestValue = highestValue;
//             secondHighestValueRaces = [...highestValueRaces];
//             highestValue = numericValue;
//             highestValueRaces = [race];
//         } else if (numericValue === highestValue) {
//             highestValueRaces.push(race);
//         } else if (numericValue > secondHighestValue) {
//             secondHighestValue = numericValue;
//             secondHighestValueRaces = [race];
//         } else if (numericValue === secondHighestValue) {
//             secondHighestValueRaces.push(race);
//         }
//     });

//     if (highestValueRaces.length === 1) {
//         return [...highestValueRaces, ...secondHighestValueRaces];
//     }
//     return highestValueRaces;
// }

// Returns a set object based on the working set in localstorage
// Useful for perfroming set operations.
function currentSet(seeking) {
    const query = '$' + seeking;
    const resString = localStorage.getItem(query);
    const res = resString.split(',');
    return new Set(res)
}


// Returns a new set based on a set operation between two sets
// Only intersection proved necessary
function setFunctions(action, setone, settwo) {
    var s1arr = setone.split(',');

    var s1 = new Set(s1arr)
    var s2arr = settwo.split(',');
    var s2 = new Set(s2arr);
    switch (action) {
        case "intersection":
            res = getIntersection(s1, s2)
            return Array.from(res).join(',')
        // break;
        default:
            console.error("Error: No set action taken (listeners.js setFunctions");
    }
}

// Performs an interseciton on a set.
function getIntersection(set1, set2) {
    const ans = new Set();
    for (let i of set2) {
        if (set1.has(i)) {
            ans.add(i);
        }
    }
    return ans;
}

// change the state of the topic.
// Params: Topic we are changeing the state of, and the amount we will change it by
// Example uses: User answered question 2. Change it by 1 to go to question 3.
//               User's answers have already narrowed down their options enough, Change it to
//                  the number that corresponds to the response state.
function alterState(topic, change) {
    var storageItem = topic + "State"
    localStorage.setItem(storageItem, change)
}

// Function that takes a string, uses the data in texts to highlight (most likely allDetails, gathered
// from misc in guide.json), and adds html tags to highlight the text and create the mouseover event that provides
// helper information.
function highlightTextWithMouseover(inputString, textsToHighlight) {

    // A string that contains ** should not ever be highlighted. This check ensures this is the case
    if (!inputString || !Array.isArray(textsToHighlight) || textsToHighlight.length === 0) {
        if (inputString.includes('**')) {
            const strEl = inputString.split("**")
            const newString = strEl[0] + localStorage.getItem(strEl[1]) + ' ' + strEl[strEl.length - 1]
            return newString;
        }
    }

    const closeTag = '</mark>'; // highlight

    let highlightedString = inputString;
    const encounteredTexts = new Set();
    const strEl = inputString.split("**")
    const newString = strEl[0] + localStorage.getItem("_") + strEl[strEl.length]

    textsToHighlight.forEach(textToHighlight => {
        const regex = new RegExp(textToHighlight, 'gi'); // seek to the detail
        highlightedString = highlightedString.replace(regex, match => {
            if (!encounteredTexts.has(match)) {
                encounteredTexts.add(match);
                const mouseoverAction = 'loadHelperInfoFromMisc(\'' + match + '\')';
                const openTag = '<mark onmouseover="' + mouseoverAction + '">';
                return openTag + match + closeTag;
            }
            return match; // Return the match without highlighting if it's encountered again. We don't need to highlight 
            // the same word on the same page more than once.
        });
    });
    return highlightedString;
}

// Function used in highlighttextwithmouseover. Loads the helper info (accessed in html always)
function loadHelperInfoFromMisc(text) {
    fetch('../guide.json')
        .then(response => response.json())
        .then(data => {
            response = data["misc"][text.toLowerCase()]
            document.getElementById('helperInfo').innerText = response
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // set the text
    document.getElementById('helperInfo').innerText = text
}


// initialize the background case based on the current state. 
function beginBackground(specialCaseHandled = false) {

    if (localStorage.getItem('_class') == 'Cleric' && !specialCaseHandled) {
        initClericDieties()
    } else {
        var state = localStorage.getItem("backgroundState")
        var sInt = parseInt(state)
        console.log("BG state: " + sInt)
        if (state != null || sInt == 1) { // check the state, so user can leave and come back to same page.
            if (sInt == 0) chooseAlignment()
            // if (sInt == 1) chooseLanguages()
            if (sInt == 2) backgroundQuestions()
            if (sInt == 3) choosePersonality()
            if (sInt == 4) chooseIdeals()
            if (sInt == 5) chooseBonds()
            if (sInt == 6) chooseFlaws()
            if (sInt == 7) chooseLanguages()
            if (sInt == 8) otherBackgroundTraits()
            if (sInt == 9) characterName()
            if (sInt == 10) askForBackgroundReset()
        }
        else {
            loadBackgroundExplainer() // default, begin the background sequence
        }
    }

}


// Backgrounds have special characteristics, found in the background csv. Access, load the info,
// and wait for the user to continue.
function otherBackgroundTraits() {
    content = clearContentAndGet()
    explainer = appendToContent('div')
    getFromCSV('background.csv', localStorage.getItem('_background'), 'Other Background/Trait')
        .then(dataCSV => {
            if (dataCSV !== null) {

                console.log('datacsv: ' + dataCSV)
                fetch('/guide.json')
                    .then(response => response.json())
                    .then(data => {
                        otherBg = data.otherBackgroundTraits[dataCSV]
                        if (otherBg === undefined) {
                            localStorage.setItem('backgroundState', '10')
                            characterName()
                        }

                        explainer.innerHTML = highlightTextWithMouseover(
                            'As a ' + localStorage.getItem('_background') + ', you need to pick this special trait. ' + otherBg.desc,
                            allDetails
                        )

                        console.log("OTHER BG: " + otherBg.opts)
                        allOpts = otherBg.opts
                        for (const opt in allOpts) {

                            btn = appendToContent('button', 'smallDiv')
                            btn.innerText = allOpts[opt].name
                            btn.addEventListener('mouseenter', function () {
                                const helperInfo = document.getElementById('helperInfo')
                                helperInfo.innerText = allOpts[opt].description
                            })
                            btn.onclick = function () {
                                localStorage.setItem('_otherSpecialTrait', dataCSV + ': ' + btn.innerText)
                                localStorage.setItem('backgroundState', '10')
                                characterName()
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
            else {
                console.log("No other background traits to handle. Moving on to name")
                localStorage.setItem('backgroundState', '10')
                characterName()
            }
        })
}

// If the background has been comleted, and the user returns to this tab,
// ask if they would like to reset the background progress.
function askForBackgroundReset() {
    content = clearContentAndGet()
    ask = appendToContent('div')
    ask.innerText = "You have already completed the background sequence. If you'd like to reset the background you will lose all progress for equipment and ability scores."
    resetBtn = appendToContent('button')
    resetBtn.innerText = 'Reset'
    resetBtn.onclick = function () {
        resetProgress('background')
    }
}

// The background csv holds the two proficiency bonuses each background has. Access, alert user, load to localStorage.
function setBackgroundProfs() {
    getFromCSV('background.csv', localStorage.getItem('_background'), 'Skill Proficiencies')
        .then(data => {
            if (data !== null) {
                profs = data.split(',')
                res = profs[0] + ',' + profs[1]
                localStorage.setItem('_profFromBackground', res)
            } else {
                console.log("Target Not Found for setBackgroundProfs");
            }
        })
}

// Explain what a background is. Clear content and reset with relevant information
function loadBackgroundExplainer() {
    content = clearContentAndGet()
    title = appendToContent('h2')
    title.innerText = "Background"
    exp = appendToContent('div')
    exp.innerHTML = highlightTextWithMouseover(
        "A well-developed background not only enhances the player's immersion but also provides the Dungeon Master with narrative hooks and opportunities to weave the character seamlessly into the broader campaign. It adds richness to the storytelling, making the character more relatable and compelling, and can contribute to collaborative storytelling as other players and the DM incorporate these details into the shared narrative.",
        allDetails
    )
    cBtn = newContinueButton(true)
    cBtn.onclick = function () {
        chooseAlignment()
    }
}

// Yet another special case. Warlocks have a patron they must choose. Alert the user.
function warlockDetails() {
    content = clearContentAndGet()
    wlDetailDiv = appendToContent('div', 'standardDiv')
    wlDetailDiv.innerHTML = highlightTextWithMouseover(
        "Warlocks in D&D form pacts with powerful beings from other planes, resembling godlike entities. Patrons grant diverse powers and demand favors, with varying attitudes toward sharing knowledge or forming exclusive pacts. Warlocks sharing a patron can see each other as allies, siblings, or rivals, fostering unique relationships.", allDetails
    )

}

// Clerics have limited aligmnent choices based on the realm their campaing takes place in. 
// Access the realm options
// function getRealms() {
//     var filePath = '../misc/clericDieties.csv';
//     fetch(filePath)
//         .then(response => response.text())
//         .then(csvText => {
//             Papa.parse(csvText, {
//                 header: true,
//                 complete: function (results) {
//                     const categoryIndex = results.meta.fields.indexOf('Category');
//                     const categories = results.data.map(row => row[results.meta.fields[categoryIndex]]);
//                     const uniqueCategories = Array.from(new Set(categories));
//                 }
//             });
//         });
// }


// Races have special features that need to be loaded onto the character sheet. 
// This function access the csv column and returns the data found.
function parseRaceFeatures(race, column) {
    var filePath = '../misc/raceFeatures.csv';
    return fetch(filePath)
        .then(response => response.text())
        .then(csvText => {
            return new Promise(resolve => {
                Papa.parse(csvText, {
                    header: true,
                    complete: function (results) {
                        const matchingRow = results.data.find(row => row['Race'].includes(race));
                        if (matchingRow) {
                            resolve(matchingRow[column]);
                        } else {
                            resolve(null); // Race not found
                        }
                    }
                });
            });
        });
}





// Clerics have dieties they must choose to follow. This is explained, options are given, and
// input is recorded. If the user knows the realm their campaign takes place in, they choose it
// and thus their alignment options are limited.
function initClericDieties() {

    // main div
    const contentDiv = document.getElementById('content')
    clearDiv(contentDiv);
    const dietyDiv = document.createElement('div');

    const explainerDiv = document.createElement('div');
    var explainer = "Since you've chosen cleric as your background, you need to pick which diety you follow.\n\nDo you happen to know which devine realm your campaign takes place in?";
    explainerDiv.innerHTML = explainer;
    dietyDiv.appendChild(explainerDiv);
    contentDiv.appendChild(dietyDiv);

    yesBtn = document.createElement('button');
    noBtn = document.createElement('button');
    yesBtn.innerText = "Yes"
    noBtn.innerText = "No"

    yesBtn.onclick = function () {
        chooseRealm();
    }
    noBtn.onclick = function () {
        localStorage.setItem('possibleAlignments', 'Lawful Good,Neutral Good,Chaotic Good,Lawful Neutral,True Neutral,Chaotic Neutral,Lawful Evil,Neutral Evil,Chaotic Evil')
        chooseAlignment();
    }

    dietyDiv.appendChild(yesBtn);
    dietyDiv.appendChild(noBtn);

}

// Present realm options to the user as buttons. If a realm is selected, limit their alignment choices based on the 
// csv data.
function chooseRealm() {
    content = document.getElementById('content');
    clearDiv(content);
    const realmChoicesExplainer = document.createElement('div')
    realmChoicesExplainer.innerHTML = highlightTextWithMouseover("Please choose your devine realm:", allDetails)
    content.appendChild(realmChoicesExplainer);
    var filePath = '../misc/clericDieties.csv';
    fetch(filePath)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function (results) {
                    const categoryIndex = results.meta.fields.indexOf('Category');
                    const categories = results.data.map(row => row[results.meta.fields[categoryIndex]]);
                    const uniqueCategories = Array.from(new Set(categories));
                    console.log(uniqueCategories);
                    for (const realm in uniqueCategories) {
                        const realmOpt = document.createElement('button');
                        realmOpt.setAttribute('id', 'realmOption')
                        realmOpt.innerText = uniqueCategories[realm];
                        content.appendChild(realmOpt)
                        realmOpt.onclick = function () {
                            // console.log("Setting realm to " + realmOpt.innerText)
                            localStorage.setItem("realm", realmOpt.innerText)
                            limitAlighment(realmOpt.innerText);
                        }
                    }
                }
            });
        });
}

// Function takes in a realm and uses limitAlignmentHelper to store possible alignments in local storage.
function limitAlighment(realm) {
    var filePath = '../misc/clericDieties.csv';
    fetch(filePath)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function (results) {
                    const data = results.data;

                    // Replace 'YourCategory' with the desired category
                    const desiredCategory = 'YourCategory';

                    // Filter data for the desired category
                    const categoryData = data.filter(row => row['Category'] === realm);
                    // Extract 'Order' and 'Morality' for each line in the category
                    const orderAndMorality = categoryData.map(row => {
                        return {
                            Order: row['Order'],
                            Morality: row['Morality']
                        };
                    });
                    // console.log(orderAndMorality);
                    limitAlighmentHelper(orderAndMorality);
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

// compare alignments together, store the 'illegal' options in localstorage under
function limitAlighmentHelper(options) {
    var possibleAlignments = []

    var lsValue = ""
    for (var opt in options) {
        console.log(options[opt])
        var fullName = getFullAlighnmentName(options[opt])
        if (possibleAlignments.indexOf(fullName) === -1) {
            possibleAlignments.push(fullName);
            lsValue = lsValue + fullName + ","
        }
    }
    lsValue = lsValue.slice(0, -1);
    localStorage.setItem("possibleAlignments", lsValue)

    chooseAlignmentLimited(lsValue)
}

// only used in the case where a cleric is chosen. Limited alignment options may occur, thus 
// their choices are given as a different sequence.
function chooseAlignmentLimited(aligns) {
    console.log(localStorage.getItem("possibleAlignments"))
    content = clearContentAndGet()
    explain = appendToContent('div')
    explain.innerText = "Since your devine realm is " + localStorage.getItem("realm") + " you may have limited alignment options. Please select from the following:"
    als = aligns.split(',')
    for (a in als) {
        b = appendToContent('button')
        b.innerText = als[a]
        b.onclick = function () {
            localStorage.setItem('_alignment', b.innerText)
            localStorage.setItem('backgroundState', '2')
            beginBackground(true)
        }
    }
}

// Since alignment names were stored as abbreviations, I'd rather make a function
// that turns the abbreviations into the full aligmnent name. Also accounts for Neutral Neutral conversion
// to True Neutral
function getFullAlighnmentName(AlignAcronymObject) {
    var al1
    var al2
    if (AlignAcronymObject.Order == 'L') al1 = 'Lawful '
    if (AlignAcronymObject.Order == 'N') al1 = 'Neutral '
    if (AlignAcronymObject.Order == 'C') al1 = 'Chaotic '
    if (AlignAcronymObject.Morality == 'G') al2 = 'Good'
    if (AlignAcronymObject.Morality == 'N') al2 = 'Neutral'
    if (AlignAcronymObject.Morality == 'E') al2 = 'Evil'
    var result = al1 + al2
    if (result == 'Neutral Neutral') {
        return "True Neutral"
    }
    else return result
}

// Normal case (not cleric). Begin the question sequence that helps the user pick their aligmnent. 
function chooseAlignment() {
    content = document.getElementById("content")
    clearDiv(content)
    appendToContent('div', "standardDiv").innerHTML = "<h2>Alignment</h2>"
    appendToContent('div', 'standardDiv').innerHTML = "It's time to choose an alignment, representing the nature of your character's actions. How would your character respond to the following scenario?"

    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            var quest1 = data.background.questionsAlign.q1
            appendToContent('div', 'standardDiv').innerText = quest1.q
            // console.log(response)
            for (const ans in quest1.ans) {
                console.log(ans)
                const ansBtn = appendToContent('button')
                ansBtn.innerText = ans
                ansBtn.onclick = function () {
                    console.log("qans: " + quest1.ans[ans][0])
                    localStorage.setItem("alignAxis1", quest1.ans[ans][0])
                    alignQuestion2(data)
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// The second part of the alignment axis.
function alignQuestion2(data) {
    content = clearContentAndGet()
    var quest2 = data.background.questionsAlign.q2
    appendToContent('div', 'standardDiv').innerText = quest2.q
    // console.log(response)
    for (const ans in quest2.ans) {
        console.log(ans)
        const ansBtn = appendToContent('button')
        ansBtn.innerText = ans
        ansBtn.onclick = function () {
            localStorage.setItem("alignAxis2", quest2.ans[ans][0])
            // goto to next step
            // chooseDevineDomain()
            if (localStorage.getItem('alignAxis1') + " " + localStorage.getItem('alignAxis2') == 'Neutral Neutral') {
                localStorage.setItem('_alignment', 'True Neutral')
            }
            else {
                localStorage.setItem('_alignment', localStorage.getItem('alignAxis1') + " " + localStorage.getItem('alignAxis2'))
            }
            alignDebrief()
        }
    }
}

// Alignment chosen. Present their result and move on with a click.
function alignDebrief() {
    content = clearContentAndGet()
    appendToContent('div', 'standardDiv').innerHTML = highlightTextWithMouseover("Your character's alignment is " + localStorage.getItem('_alignment') + ".", allDetails)
    cont = appendToContent('button')
    cont.innerText = 'Continue'
    cont.onclick = function () {
        backgroundQuestions()
        localStorage.setItem('backgroundState', '2')
    }


}



// Call roll for abilities. Accessed from html pages
function initRolling() {
    rollForAbilities()
}

// function chooseDiety(alignment) {
//     alignchars = alignment.split(" ")
//     var alignKey = []
//     alignKey.push(alignchars[0].charAt(0))
//     if (alignKey[0] == 'T') alignKey[0] = 'N'
//     alignKey.push(alignchars[1].charAt(0))
//     var filePath = '../misc/clericDieties.csv';

//     return new Promise((resolve, reject) => {
//         fetch(filePath)
//             .then(response => response.text())
//             .then(csvText => {
//                 Papa.parse(csvText, {
//                     header: true,
//                     complete: function (results) {
//                         const data = results.data;

//                         // Replace 'YourCategory' with the desired category
//                         // const desiredCategory = 'YourCategory';

//                         // Filter data for the desired category
//                         const categoryData = data.filter(row => row['Category'] === localStorage.getItem("realm"));

//                         // Find all deities that match the conditions
//                         const matchingDeities = categoryData
//                             .filter(row => row['Order'] === alignKey[0] && row['Morality'] === alignKey[1])
//                             .map(row => row['Deity']);

//                         // Resolve with the array of deities if found, otherwise, reject
//                         if (matchingDeities.length > 0) {
//                             resolve(matchingDeities);
//                         } else {
//                             reject("No deities found for the specified alignment.");
//                         }
//                     }
//                 });
//             })
//             .catch(error => reject('Error fetching the CSV file: ' + error));
//     });
// }

// function addDietyInfo(listOfDieties) {
//     content = clearContentAndGet()


//     if (listOfDieties.length == 1) {
//         d = appendToContent('div', "standardDiv")
//         d.innerHTML = highlightTextWithMouseover("You have been assigned " + listOfDieties[0] + ".", allDetails)
//         // content.appendChild(d)
//         localStorage.setItem("_diety", listOfDieties[0])
//     }
//     else {
//         var explain = appendToContent('div', 'standardDiv')
//         possibleDietiesDiv = appendToContent('div', 'standardDiv')
//         explain.innerHTML = highlightTextWithMouseover("Choose a Diety to worship:\n", allDetails)
//         for (const d in listOfDieties) {
//             const diety = listOfDieties[d]
//             const dietyInfo = document.createElement('button')
//             dietyInfo.setAttribute('id', 'standardDiv')
//             dietyInfo.innerHTML = highlightTextWithMouseover(
//                 listOfDieties[d],
//                 allDetails)
//             possibleDietiesDiv.appendChild(dietyInfo)
//         }
//     }
//     cBtn = newContinueButton(true)
//     cBtn.onclick = function () {
//         console.log("TBT button action in function addDietyInfo")
//         pickJob()
//     }
// }

// function dietyDebrief() {
//     content = clearContentAndGet()
//     dietyOutro = appendToContent('div', 'standardDiv')
//     dietyOutro.innerHTML = highlightTextWithMouseover('Your cleric worships ' + localStorage.getItem("_diety"), allDetails)
// }


// Access suggested names and put them in a table. Present a textfield for the user to
// enter their name. On click continue to next part of background sequence (proficiencies)
function characterName() {
    setGold()
    content = clearContentAndGet()
    appendToContent('h2').innerText = "Character Name"
    appendToContent('div', 'standardDiv').innerHTML = "It's time to choose your character's name."

    appendToContent('div').innerHTML = '<input id="_name" class="textinput" type="text" placeholder="Enter name"><br><button class="submitButton" id="continueButton" role="button">Submit</button>'
    appendToContent('div').innerHTML = "You can choose any name you please, but if you do want to pick a standard name for a " + localStorage.getItem("_race") + ", these are some examples."
    cBtn = document.getElementById('continueButton')
    cBtn.onclick = function () {
        storeKeyFromInput('_name')
        localStorage.setItem('backgroundState', '10')
        determineProfs()


    }
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            var race = localStorage.getItem("_race")
            if (race.includes('Dragon')) {
                race = 'Dragonborn'
            }
            var males = data.races[race].maleNames
            var females = data.races[race].femaleNames
            console.log(males)
            document.getElementById('content').appendChild(createNameTable(race, males, females))
        })

        .catch(error => {
            console.error('Error:', error);
        });
}

// Load pros into local storage, so they can be flagged on the character sheet.
function determineProfs() {
    fromClass = localStorage.getItem('_profFromClass').split(',')
    fromBackground = localStorage.getItem('_profFromBackground').split(',')

    res = arrayUnion(fromClass, fromBackground)
    console.log("RES: " + res)
    localStorage.setItem('_skillProfs', res)
    window.location.href = '../html/equipment.html'

}

// Get the union of two arrays
function arrayUnion(arr1, arr2) {
    // Use Set to eliminate duplicates
    const set = new Set([...arr1, ...arr2]);

    // Convert Set back to array
    return [...set];
}

// Create the tabel html element that suggest names for the user based on their race.
function createNameTable(race, maleValues, femaleValues) {
    // Create a table element
    const table = document.createElement('table');
    table.setAttribute('id', 'langTable')

    // Create a table header row
    const headerRow = table.insertRow();

    // Create header cells for "Male" and "Female"
    const maleHeader = headerRow.insertCell(0);
    maleHeader.textContent = "Male";

    const femaleHeader = headerRow.insertCell(1);
    femaleHeader.textContent = "Female";

    // Determine the maximum number of rows needed based on the lengths of the input arrays
    const maxRows = Math.max(maleValues.length, femaleValues.length);

    // Populate the table rows
    for (let i = 0; i < maxRows; i++) {
        // Create a new row
        const row = table.insertRow();

        // Create cells for "Male" and "Female" columns
        const maleCell = row.insertCell(0);
        const femaleCell = row.insertCell(1);

        // Assign values from the arrays if available
        maleCell.textContent = i < maleValues.length ? maleValues[i] : '';
        femaleCell.textContent = i < femaleValues.length ? femaleValues[i] : '';
    }

    // Append the table to the document body or any desired container
    return table
}

// Load the current iteration of the background question.
function backgroundQuestions(questionNum = 1) {
    content = clearContentAndGet()
    if (questionNum == 1) { // inital case, explain the sequence
        explainer = appendToContent('div', 'standardDiv')
        explainer.innerHTML = "Every character's story begins with a background that shapes their identity and journey. Whether a knight, soldier, sage, or artisan, your character's past provides essential clues about their origin and motivations. Delving into your background prompts crucial questions about change, the transition to adventuring, the source of your initial funds, skill acquisition, and what distinguishes you within your shared background."
    }
    fetch('/guide.json') // load the question.
        .then(response => response.json())
        .then(data => {
            var quest = data.background.questions['q' + questionNum.toString()]
            console.log(quest)
            appendToContent('div', 'standardDiv').innerHTML = quest.q
            for (const ans in quest.ans) {
                const btn = appendToContent('button')
                btn.innerText = ans
                btn.onclick = function () { // if answer is selected, move to the question the answer point to
                    console.log(quest.ans[ans][2])
                    if (quest.ans[ans][2].charAt(0) == '-') {
                        clearContentAndGet()
                        pickBackgroundFromQuestions(quest.ans[ans][0])
                    }
                    else {
                        backgroundQuestions(quest.ans[ans][2].toString())
                    }
                }
            }
        })

        .catch(error => {
            console.error('Error:', error);
        });
} // backgroundQuestions

// Get the pointer to the next question.
function pickBackgroundFromQuestions(optionsAsString) {
    possibleChoices = optionsAsString.split(',')
    for (const choice in possibleChoices) {
        loadAllBackgroundInfo(possibleChoices[choice])
    }
}

// Based on the choice the user chooses, load the information explaining the choice to the page.
function loadAllBackgroundInfo(choice) {
    // var bgData
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const bgDiv = document.createElement('div')
            bgDiv.setAttribute('id', 'backgroundInfo')
            const title = document.createElement('h2')
            title.innerText = choice
            bgDiv.appendChild(title)
            const bgData = data[choice]
            for (el in bgData) {
                console.log(el)
                const label = document.createElement('h3')
                label.innerText = el
                const info = document.createElement('p')
                if (el[0] == '-') continue
                if (bgData[el] instanceof Object) {
                    info.setAttribute('id', 'innerInfo')
                    console.log("Object found")
                    for (var thing in bgData[el]) {
                        const tng = document.createElement('p')
                        tng.innerHTML = highlightTextWithMouseover(bgData[el][thing], allDetails)
                        info.appendChild(tng)
                    }
                }
                else {
                    if (el == 'Description' || el == 'Suggested Characteristics' || el == 'Details') {
                        info.innerHTML = bgData[el]
                    }
                    else {
                        info.innerHTML = highlightTextWithMouseover(bgData[el], allDetails)
                    }
                }

                bgDiv.appendChild(label)
                bgDiv.appendChild(info)
            }
            select = document.createElement('button')
            select.innerText = "Select " + choice
            select.onclick = function () { // Seet the choice into local storage and move on to personality
                localStorage.setItem("_background", choice)
                localStorage.setItem('backgroundState', '3')
                setBackgroundProfs()
                // move to next sequence
                console.log("Chose " + choice + " as background")
                localStorage.setItem("backgroundState", "3")
                choosePersonality()
                getNumLanguagesFromBackground().then(data => {
                    fromBck = data
                    localStorage.setItem('langsFromBackground', fromBck)
                })
                    .catch(error => {
                        console.log(error)
                    })
            }
            bgDiv.appendChild(select)
            document.getElementById('content').appendChild(bgDiv)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Using json data, load the ideal for each background for the user to select.
function chooseIdeals() {
    content = clearContentAndGet()
    bkgnd = localStorage.getItem('_background')
    console.log(bkgnd)
    main = appendToContent('div', 'standardDiv')
    main.innerText = "Characters in DnD have a set of ideals that essentially define your character's philosophy and outlook on life. As a " + localStorage.getItem('_background') + ", you can pick one of these standard ideals, or just create your own."
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            allIdeals = data[bkgnd]['-ideals']
            console.log("id " + allIdeals)
            for (id in allIdeals) {
                const btn = appendToContent('button')
                btn.innerText = allIdeals[id]
                content.appendChild(btn)
                btn.onclick = function () {
                    localStorage.setItem('_ideals', btn.innerText)
                    localStorage.setItem("backgroundState", "5")
                    chooseBonds()
                }
            }
            inp = document.createElement('input')
            inpDiv = appendToContent('div', 'standardDiv')
            inpDiv.innerText = "You can write your own here:"
            inp.setAttribute('class', 'textinput')
            inpDiv.appendChild(inp)
            subButton = document.createElement('button')
            subButton.innerText = "Submit"
            subButton.setAttribute('type', 'submit')
            inpDiv.appendChild(subButton)
            subButton.onclick = function () {
                localStorage.setItem('_ideals', inp.value)
                localStorage.setItem("backgroundState", "5")
                chooseBonds()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Using json data, load the bond options for each background for the user to select.
function chooseBonds() {
    content = clearContentAndGet()
    bkgnd = localStorage.getItem('_background')
    main = appendToContent('div', 'standardDiv')
    main.innerText = "As an " + localStorage.getItem('_background') + ", your bonds represent a character's connections to people, places, and events in the world. They tie you to things from your background. Choose one of the following, or write your own."
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            allBonds = data[bkgnd]['-bonds']
            console.log("id " + allBonds)
            optDiv = appendToContent('div', 'standardDiv')
            for (id in allBonds) {
                const btn = appendToContent('button')
                btn.innerText = allBonds[id]
                optDiv.appendChild(btn)
                btn.onclick = function () {
                    localStorage.setItem('_bonds', btn.innerText)
                    localStorage.setItem("backgroundState", "6")
                    chooseFlaws()
                }
            }
            content.appendChild(optDiv)
            inp = document.createElement('input')
            inpDiv = appendToContent('div', 'standardDiv')
            inpDiv.innerText = "You can write your own here:"
            inp.setAttribute('class', 'textinput')
            content.appendChild(inp)
            subButton = document.createElement('button')
            subButton.innerText = "Submit"
            subButton.setAttribute('type', 'submit')
            content.appendChild(subButton)
            subButton.onclick = function () {
                localStorage.setItem('_bonds', inp.value)
                localStorage.setItem("backgroundState", "6")
                chooseFlaws()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Create and retunr a div that hold the table of possible languages the user can choose. Omit languages
// the character should already know.
function createLanguageTables(omit) {
    // Create the main div
    const mainDiv = document.createElement('div');

    // Fetch JSON data from 'guide.json'
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            // Create a table for standard languages
            const standardTable = createTable('Languages', data.standardLanguages, omit);
            mainDiv.appendChild(standardTable);

        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });

    return mainDiv;
}


// Helper function to create a language table with a title, options and languages to avoid inserting.
function createTable(title, languages, omit) {
    const table = document.createElement('table');
    table.setAttribute('id', 'langTable')
    const caption = table.createCaption();
    caption.textContent = title;

    // Create header row
    const headerRow = table.insertRow();
    const languageHeader = headerRow.insertCell();
    const speakersHeader = headerRow.insertCell();
    const scriptHeader = headerRow.insertCell();
    languageHeader.textContent = 'Language';
    speakersHeader.textContent = 'Typical Speakers';
    scriptHeader.textContent = 'Script';

    // Create rows for each language
    const allowed = parseInt(localStorage.getItem('extraLangs'))
    let selected = 0
    let selectedLangs = []
    contBtn = appendToContent('button')
    contBtn.style.display = 'none'
    contBtn.innerText = "Continue"
    contBtn.onclick = function () {
        selLangs = localStorage.getItem('langsFromRace') + ' '
        for (l in selectedLangs) {
            selLangs = selLangs + ' ' + selectedLangs[l] + ','
        }
        localStorage.setItem(
            '_selectedLangs',
            selLangs
        )
        localStorage.setItem('backgroundState', '8')
        otherBackgroundTraits()
        localStorage.setItem('backgroundDone', 'true')
    }
    languages.forEach((language, index) => {
        // Check if the language should be omitted
        if (!omit.includes(language.language)) {
            const row = table.insertRow();
            row.addEventListener('click', () => {
                // Change background color on row click
                if (selected < allowed && row.style.backgroundColor != 'rgb(119, 45, 45)') {
                    row.style.backgroundColor = row.style.backgroundColor ? '' : 'rgb(119, 45, 45)';
                    selected += 1
                    selectedLangs.push(row.cells[0].textContent)
                    console.log(selectedLangs)
                } else if (row.style.backgroundColor == 'rgb(119, 45, 45)') {
                    row.style.backgroundColor = row.style.backgroundColor ? '' : 'rgb(119, 45, 45)';
                    selected -= 1
                    console.log(selectedLangs.indexOf(row.cells[0].textContent))
                    selectedLangs.splice(selectedLangs.indexOf(row.cells[0].textContent), 1)
                    console.log(selectedLangs)
                }
                if (allowed == selectedLangs.length) {
                    contBtn.style.display = 'block'
                } else {
                    contBtn.style.display = 'none'
                }
            });

            const languageCell = row.insertCell();
            const speakersCell = row.insertCell();
            const scriptCell = row.insertCell();

            languageCell.textContent = language.language;
            speakersCell.textContent = language.typicalSpeakers;
            scriptCell.textContent = language.script;
        }
    });

    return table;
}

// Using json data, load the flaw for each background for the user to select.
function chooseFlaws() {
    content = clearContentAndGet()
    bkgnd = localStorage.getItem('_background')
    main = appendToContent('div', 'standardDiv')
    main.innerText = "A flaw is a piece of your character's personality that makes them believable by adding real emotional depth. Flaws vary. They can be anything from an irrational fear to a corrupted world view. Either way, these are generally bad things that keep your character from being \"perfect.\""
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            allFlaws = data[bkgnd]['-flaws']
            console.log("id " + allFlaws)
            optDiv = appendToContent('div', 'standardDiv')
            for (id in allFlaws) {
                const btn = appendToContent('button')
                btn.innerText = allFlaws[id]
                optDiv.appendChild(btn)
                btn.onclick = function () {
                    localStorage.setItem('_flaws', btn.innerText)
                    localStorage.setItem("backgroundState", "7")
                    chooseLanguages()
                }
            }
            content.appendChild(optDiv)
            inp = document.createElement('input')
            inpDiv = appendToContent('div', 'standardDiv')
            inpDiv.innerText = "You can write your own here:"
            inp.setAttribute('class', 'textinput')
            content.appendChild(inp)
            subButton = document.createElement('button')
            subButton.innerText = "Submit"
            subButton.setAttribute('type', 'submit')
            content.appendChild(subButton)
            subButton.onclick = function () {
                localStorage.setItem('_flaws', inp.value)
                localStorage.setItem("backgroundState", "7")
                chooseLanguages()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// User chooses two personality traits to load onto the character sheet.
// Choices from the handbook are given, but a custom personality trait can be given instead.
var numberOfPersonalityTraits = 0
var personalityTraits = ''
var chosenTraitsArr = []
function choosePersonality() {
    content = clearContentAndGet()
    bkgnd = localStorage.getItem('_background')
    main = appendToContent('div', 'standardDiv')
    main.innerText = "A character's perosnality trait can help when you make decisions during the game. Please select one or write your own. Choose two traits from below."
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            allPT = data[bkgnd]['-personalityTrait']
            console.log("id " + allPT)
            optDiv = appendToContent('div', 'standardDiv')
            for (id in allPT) {
                let clicked = false
                const btn = appendToContent('button')
                btn.setAttribute('id', 'personalityBtn')
                btn.addEventListener('click', function () {
                    // Toggle the 'clicked' class when the button is clicked
                    clicked = !clicked

                    // if two chosen, load them and move on
                    if (numberOfPersonalityTraits < 2) {
                        this.classList.toggle('clicked');
                        if (clicked) {
                            chosenTraitsArr[numberOfPersonalityTraits++] = btn.innerText
                        }
                        else {
                            chosenTraitsArr[numberOfPersonalityTraits--] = ''
                        }

                        // personalityTraits += numberOfPersonalityTraits + '. ' + btn.innerText + '  '
                        // console.log("PT: +" + personalityTraits)
                    }
                    if (numberOfPersonalityTraits == 2) {
                        localStorage.setItem("backgroundState", "4")
                        localStorage.setItem('_personalityTraits', chosenTraitsArr[0] + '\n' + chosenTraitsArr[1])
                        // characterName()
                        chooseIdeals()
                    }
                });
                btn.innerText = allPT[id]
                optDiv.appendChild(btn)
            }

            // Load the instructions
            content.appendChild(optDiv)
            inp = document.createElement('input')
            inpDiv = appendToContent('div', 'standardDiv')
            inpDiv.innerText = "You can write your own here:"
            inp.setAttribute('class', 'textinput')
            content.appendChild(inp)
            subButton = document.createElement('button')
            subButton.innerText = "Submit"
            subButton.setAttribute('type', 'submit')
            content.appendChild(subButton)
            subButton.onclick = function () {
                localStorage.setItem('_personalityTraits', inp.value)
                localStorage.setItem("backgroundState", "4")
                chooseIdeals()
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Choose the languages from the table, based on race and background.
function chooseLanguages() {
    // set extra languages to 0
    localStorage.setItem('extraLangs', '0')
    content = clearContentAndGet()
    explainer = appendToContent('div', 'standardDiv')
    console.log('All details are here: ' + allDetails)
    currLangDiv = appendToContent()
    getFromCSV('raceFeatures.csv', localStorage.getItem('_subRace'), 'Languages')
        .then(data => {
            if (data !== null) {
                numExtraLangs = 0
                localStorage.setItem('langsFromRace', data)
                langs = data.split(',')
                if (langs[langs.length - 1].includes('extra')) {
                    txt = ''
                    for (var i = 0; i < langs.length - 1; i++) {
                        txt += langs[i]
                    }
                    currLangDiv.innerText = txt
                    addToLocalStorageInt('extraLangs', 1)
                    numExtraLangs++;

                } else {
                    currLangDiv.innerText = data
                }

                console.log("langsfrombackground:" + localStorage.getItem('langsFromBackground'))
                numExtraLangs += parseInt(localStorage.getItem('langsFromBackground'))
                if (numExtraLangs == 0) {
                    localStorage.setItem('backgroundState', '8')
                    // chooseBonds()
                    otherBackgroundTraits()
                    return
                }

                explainer.innerHTML = highlightTextWithMouseover(
                    'As a ' + localStorage.getItem('_subRace') + ' you can already speak these languages: ',
                    allDetails
                )
                localStorage.setItem('extraLangs', numExtraLangs)
                moreExplainer = appendToContent('div', 'standardDiv')
                if (numExtraLangs == 1) {
                    moreExplainer.innerText = 'You may choose ' + numExtraLangs + ' extra languageby clicking the table rows below.'
                } else {
                    moreExplainer.innerText = 'You may choose ' + numExtraLangs + ' extra languages by clicking the table rows below.'
                }
                langTables = createLanguageTables(langs)
                content.appendChild(langTables)

            } else {
                console.log("Target Not Found for chooseLanguages: " + localStorage.getItem('_subRace'));
            }
        })
}

// Find the allowed amount of languages by accessing the background csv.
async function getNumLanguagesFromBackground() {
    try {
        const data = await getFromCSV('background.csv', localStorage.getItem('_background'), 'Languages');
        if (data !== null && data !== '') {
            return parseInt(data.charAt(0));
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error:', error);
        return 0; // Handle the error and return a default value
    }
}

// Roll for abilities. Explain what abilities are and give details for each one. Present standard Array and die roll options.
function rollForAbilities() {
    console.log('here')

    content = clearContentAndGet()
    main = appendToContent('div', 'standardDiv')
    main.innerHTML = "Ability scores affect how your character plays Dungeons & Dragons. There are six different abilities:"
    strengthDiv = appendToContent('div', 'smallDiv')
    strengthDiv.innerHTML = '<b>Strength</b>: measures physical power.'
    dexDiv = appendToContent('div', 'smallDiv')
    dexDiv.innerHTML = "<b>Dexterity</b>: measures agility and finess."
    constDiv = appendToContent('div', 'smallDiv')
    constDiv.innerHTML = "<b>Constitution</b>: measures endurance, or how long you can engage in physical activity before tiring."
    intDiv = appendToContent('div', 'smallDiv')
    intDiv.innerHTML = "<b>Intelligence</b>: measures reasoning and memory."
    wisDiv = appendToContent('div', 'smallDiv')
    wisDiv.innerHTML = "<b>Wisdom</b>: measures perception and insight."
    charDiv = appendToContent('div', 'smallDiv')
    charDiv.innerHTML = "<b>Charisma</b>: measures the force of your personality."
    abilScoreContextDiv = appendToContent('div')
    abilScoreContextDiv.innerText = "These six physical and mental characteristics determine your character's ability modifiers and skills. They are used often while playing D&D for ability checks, saving throws, attack rolls, and passive checks. We have two ways of determining ability scores. Please select one of the options below:\n"
    stdArray = document.createElement('button')
    stdArray.innerText = "Standard Array"
    stdArray.onclick = function () {
        standardArray()
    }
    content.appendChild(stdArray)
    rollDice = document.createElement('button')
    rollDice.innerText = "Rolling for Stats"
    rollDice.onclick = function () {
        rollTheDice('_strength')
    }
    content.appendChild(rollDice)

}

// Using the button linked to 
function rollTheDice(abil) {
    localStorage.setItem('currentRoll', abil)
    localStorage.setItem('nextRoll', 'false')
    rollDiv = document.getElementById('rolling')
    rollDiv.style.display = 'block'
    content = clearContentAndGet()
    explainer = document.createElement('div')
    abilTitle = abil.slice(1)
    explainer.innerHTML = '<h2>' + abilTitle.charAt(0).toUpperCase() + abilTitle.slice(1) + '</h2>'

    content.insertBefore(explainer, document.getElementById('rolling'))
    nextBtn = document.createElement('button')
    nextBtn.setAttribute('id', 'nextButton')
    nextBtn.style.display = 'none'
    nextBtn.innerText = "Next"
    content.appendChild(nextBtn)

    nextBtn.onclick = function () {
        next = getNextRoll(abil)
        if (next != 'done') {
            localStorage.setItem('canThrow', 'true')
            rollTheDice(next)
        }
        else {
            assignProficiencies()
            if (localStorage.getItem('_race') == 'Half-Elf') {
                handleHalfElfAbilityScores()
            }
            if (localStorage.getItem('_race' == 'Human')) {
                handleHumanAbilityScores()
            }

            // fullDebrief()
        }
        // rollTheDice(getNextRoll(abil))
    }

}

function handleHumanAbilityScores() {
    const abilityScores = ['_strength', '_dex', '_constitution', '_intellegence', '_wisdom', '_charisma'];

    for (abil in abilityScores) {
        console.log("Adding " + abilityScores[abil] + " plus 1 to " + localStorage.getItem(abilityScores[abil]))
        addToLocalStorageInt(abilityScores[abil], 1)
    }
}

function assignProficiencies() {
    var savingThrowProfs = []
    getFromCSV('classFeatures.csv', localStorage.getItem('_class'), 'Saving Throw Proficiencies')
        .then(data => {
            if (data !== null) {
                rmSpace = data.replace(/\s/g, '');
                console.log('rmSpace: ' + rmSpace)
                profArr = data.split(',')
                for (prof in profArr) {
                    console.log(profArr[prof])
                    target = profArr[prof].toLowerCase()
                    // if ()
                }
            } else {
                console.log("Target Not Found for assignProficiencies");
            }
        })
}

function getNextRoll(currentScore) {
    console.log(currentScore + "Current score")
    const abilityScores = ['_strength', '_dex', '_constitution', '_intellegence', '_wisdom', '_charisma'];

    // Find the index of the current score
    const currentIndex = abilityScores.indexOf(currentScore);
    console.log(currentIndex + "currindex")

    // If the current score is not found or is the last one, return 'done'
    if (currentIndex === -1 || currentIndex === abilityScores.length - 1) {
        console.log('done')
        fullDebrief()
        return 'done';
    }

    localStorage.setItem('currentRoll', abilityScores[currentIndex + 1])
    // Return the next ability score
    return abilityScores[currentIndex + 1];
}

vals = [8, 10, 12, 13, 14, 15]
assignedAbils = []


// helper function that gets the data from the given csv file name and column.
function getFromCSV(fileName, target, column) {
    return fetch('../misc/' + fileName)
        .then(response => response.text())
        .then(csvText => {
            return new Promise(resolve => {
                Papa.parse(csvText, {
                    header: true,
                    complete: function (results) {
                        const matchingRow = results.data.find(row => row[results.meta.fields[0]] === target);
                        if (matchingRow) {
                            resolve(matchingRow[column]);
                        } else {
                            resolve(null); // Target not found
                        }
                    }
                });
            });
        });
}

// init the stardard array sequence
function standardArray() {
    if (assignedAbils.length == 6) {
        content = clearContentAndGet()
        if (localStorage.getItem('_race') != 'Half-Elf')
            content.innerText = 'If you are happy with your scores, your character sheet is now complete.'
        contBtn = document.createElement('button')
        contBtn.innerText = 'Continue'
        contBtn.onclick = function () { // we are totally done
            calculateValsFromAbilityScores()
            fullDebrief()
        }
        content.appendChild(contBtn)
    }
    else {
        content = clearContentAndGet()
        main = appendToContent('div', 'standardDiv')
        main.innerText = 'Assign any of these values to an ability:'

        if (!assignedAbils.includes('strength')) {
            const abil1 = document.createElement('div')

            abil1.setAttribute("id", "ab1")
            abil1.innerText = 'Strength:'
            appendAbilityValues(abil1, vals, 'strength')
            main.appendChild(abil1)
        }

        if (!assignedAbils.includes('dex')) {
            const abil2 = document.createElement('div')

            abil2.setAttribute("id", "ab2")
            abil2.innerText = 'Dexterity:'
            appendAbilityValues(abil2, vals, 'dex')
            main.appendChild(abil2)
        }

        if (!assignedAbils.includes('constitution')) {
            const abil3 = document.createElement('div')

            abil3.setAttribute("id", "ab3")
            abil3.innerText = 'Constitution:'
            appendAbilityValues(abil3, vals, 'constitution')
            main.appendChild(abil3)
        }

        if (!assignedAbils.includes('wisdom')) {
            const abil4 = document.createElement('div')

            abil4.setAttribute("id", "ab4")
            abil4.innerText = 'Wisdom:'
            appendAbilityValues(abil4, vals, 'wisdom')
            main.appendChild(abil4)
        }

        if (!assignedAbils.includes('intellegence')) {
            const abil5 = document.createElement('div')

            abil5.setAttribute("id", "ab5")
            abil5.innerText = 'Intelligence:'
            appendAbilityValues(abil5, vals, 'intellegence')
            main.appendChild(abil5)
        }

        if (!assignedAbils.includes('charisma')) {
            console.log("Charisma is " + localStorage.getItem('_charisma'))
            const abil6 = document.createElement('div')

            abil6.setAttribute("id", "ab6")
            abil6.innerText = 'Charisma:'
            appendAbilityValues(abil6, vals, 'charisma')
            main.appendChild(abil6)
        }

    }
    resetBtn = document.createElement('button')
    resetBtn.innerText = 'Reset'
    resetBtn.onclick = function () {
        vals = [8, 10, 12, 13, 14, 15]
        assignedAbils = []
        standardArray()
    }
    content.appendChild(resetBtn)
}

// All done, explain the process and present the character sheet button.
function fullDebrief() {
    content = clearContentAndGet()
    main = appendToContent('div', 'standardDiv')
    main.innerText = "Your character creation process is complete. You can now view your detailed character sheet to explore your character's abilities, skills, and traits."
    charSheetViewDiv = appendToContent('div')
    charSheetViewDiv.innerHTML = "<button onclick=\"window.location.href = 'charsheet.html';\">Character Sheet</button>"
}

// flag ability scores and increase based on the given abilities.
function appendAbilityValues(divAbil, vals, abil) {
    for (i = 0; i < vals.length; i++) {
        const toAppend = document.createElement('button')
        toAppend.setAttribute('id', 'abilBtn')
        toAppend.innerText = vals[i]
        divAbil.appendChild(toAppend)
        toAppend.onclick = function () {
            assignedAbils.push(abil)
            localStorage.setItem('_' + abil.toLowerCase(), toAppend.innerText)
            vals = removeValue(vals, parseInt(toAppend.innerText));
            standardArray()
        }
    }
}

// function flagProficiencies() {
//     getFromCSV('')
// }

// based on race csv, get the proficiency bonuses from that column and flag them on the character sheet.
function applyProficiencies() {
    var filePath = '../misc/raceFeatures.csv';
    fetch(filePath)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function (results) {
                    const categoryIndex = results.meta.fields.indexOf('Category');
                    const categories = results.data.map(row => row[results.meta.fields[categoryIndex]]);
                    const uniqueCategories = Array.from(new Set(categories));
                    console.log(uniqueCategories);
                }
            });
        });
}

// Calculate the values of ability score modifiers: flr((score-10)/2)
// Also set passive wisdom as the dependencies for that are calculated here as well.
function calculateValsFromAbilityScores(humanHandled = false) {
    localStorage.setItem(
        '_armorClass',
        parseInt(localStorage.getItem('_dex')) + 10
    )

    localStorage.setItem('_proficiencyBonus', '2')

    localStorage.setItem(
        '_strengthMod',
        parseInt((parseInt(localStorage.getItem('_strength')) - 10) / 2)
    )
    localStorage.setItem(
        '_dexMod',
        parseInt((parseInt(localStorage.getItem('_dex')) - 10) / 2)
    )
    localStorage.setItem(
        '_constitutionMod',
        parseInt((parseInt(localStorage.getItem('_constitution')) - 10) / 2)
    )
    localStorage.setItem(
        '_intellegenceMod',
        parseInt((parseInt(localStorage.getItem('_intellegence')) - 10) / 2)
    )
    localStorage.setItem(
        '_wisdomMod',
        parseInt((parseInt(localStorage.getItem('_wisdom')) - 10) / 2)
    )
    localStorage.setItem(
        '_charismaMod',
        parseInt((parseInt(localStorage.getItem('_charisma')) - 10) / 2)
    )

    localStorage.setItem(
        '_initiative',
        '+' + localStorage.getItem('_dexMod')
    )


    if (!humanHandled) applyRaceBenifits()


    // Dependant stats
    
    localStorage.setItem(
        '_passiveWisdom',
        parseInt(localStorage.getItem('_wisdomMod')) + 10
    )

}

// From the race csv, seek ability scores that need to be increased and increase them.
function applyRaceBenifits() {
    plRace = localStorage.getItem('_race')
    plSubRace = localStorage.getItem('_subRace')
    console.log('pl subrace: ' + plSubRace)
    parseRaceFeatures(plRace, 'Ability Score Increase (Race)').then(value => {
        console.log(value)
        scores = value.split(',')
        for (sc in scores) {
            if (localStorage.getItem('_race') == 'Half-Elf') {
                handleHalfElfAbilityScores()
            }
            if (localStorage.getItem('_race') == 'Human') {
                handleHumanAbilityScores()
                calculateValsFromAbilityScores(true)
            }
            splitVal = scores[sc].split(' ')
            var currentInt = parseInt(localStorage.getItem('_' + splitVal[0].toLowerCase()))
            currentInt += parseInt(splitVal[1])
            console.log('New value: ' + currentInt)
            localStorage.setItem('_' + splitVal[0].toLowerCase(), currentInt)
        }

    })

    // From the race features, add the values in the csv to local storage.
    parseRaceFeatures(plSubRace, 'Ability Score Increase (Subrace)').then(value => {
        console.log("subrace val: " + value)
        splitVal = value.split(' ')
        var currentInt = parseInt(localStorage.getItem('_' + splitVal[0].toLowerCase()))
        currentInt += parseInt(splitVal[1])
        console.log('New value: ' + currentInt)
        localStorage.setItem('_' + splitVal[0].toLowerCase(), currentInt)
    })

    // 
    parseRaceFeatures(plRace, 'Traits (Race)').then(value => {
        localStorage.setItem('_featuresandtraits', value)
    })

    parseRaceFeatures(plSubRace, 'Traits (Subrace)').then(value => {
        curr = localStorage.getItem('_featuresandtraits')
        curr += " " + value
        console.log(curr)
        localStorage.setItem('_featuresandtraits', curr)
    })

    updateModifiers()
    updateSkillLocalStorageValues()
    console.log('Class: ' + localStorage.getItem('_class'))


    // GET 
    getFromCSV('classFeatures.csv', localStorage.getItem('_class'), 'Class Features (Level 1)')
        .then(data => {
            if (data !== null) {
                console.log("Class Features level 1: " + data);
                addToLocalStorageString(
                    '_featuresandtraits',
                    data
                )
            } else {
                console.log("Target Not Found for Class Features");
            }
        })
        .catch(error => console.error('Error: ', error));
    // calculateSkills() 
    calculateMaxHP()
}

// Max hp is found in the class csv, load and move on.
function calculateMaxHP() {
    getFromCSV('classFeatures.csv', localStorage.getItem('_class'), 'Hit Points')
        .then(data => {
            if (data !== null) {
                console.log(data)
                var HPMax = data.split(' ')
                localStorage.setItem('_hitPointMaximum', HPMax[0])
                localStorage.setItem('_currentHitPoints', HPMax[0])
            } else {
                console.log("Target Not Found for Max HP");
            }
        })
}

// Half elfs get to choose two more ability scores to increase. Handle here.
function handleHalfElfAbilityScores() {
    q = 'As a Half-Elf, you get to choose two more ability scores to increase by 1.'
    ansBtns = []
    var choices = 0
    const abilityScores = ['Strength', 'Dex', 'Constitution', 'Intelligence', 'Wisdom']
    for (const abilScrs in abilityScores) {
        const btn = document.createElement('button')
        btn.innerText = abilityScores[abilScrs]
        const key = '_' + abilityScores[abilScrs].toLowerCase()
        if (abilityScores[abilScrs] == 'Intelligence') {
            const key = '_intellegence'
        }
        else {
            const key = '_' + abilityScores[abilScrs].toLowerCase()
        }
        btn.onclick = function () {
            console.log('Key: ' + key)
            addToLocalStorageInt(key, 1)
            btn.remove()
            choices++
            if (choices >= 2) {
                fullDebrief()
            }
        }
        ansBtns.push(btn)
    }
    basicQuestionAnswer(q, ansBtns)
    contBtn = document.createElement('button')
    contBtn.innerText = "Continue"
    contBtn.onclick = function () {
        fullDebrief()
    }
}

// Clears and begins another sequence
function basicQuestionAnswer(question, answers, explainer = '', clear = true) {
    if (clear) content = clearContentAndGet()
    else content = document.getElementById('content')
    if (explainer !== '') {
        explain = appendToContent('div', 'standardDiv')
        explain.innerText = explainer
    }
    q = appendToContent('div', 'standardDiv')
    q.innerText = question
    for (ans in answers) {
        content.appendChild(answers[ans])
    }
}

// gold amount is a sbustring in background csv. Seek and load to local storage.
function setGold() {
    getFromCSV('background.csv', localStorage.getItem('_background'), 'Equipment')
        .then(data => {
            if (data !== null) {
                console.log(data + '  looking for GOLD')
                gpArr = data.split(' ')
                console.log(gpArr[gpArr.length - 2] + ' gp arr minus 2')
                localStorage.setItem('_eqGP', gpArr[gpArr.length - 2])
            } else {
                console.log("Target Not Found for Gold");
            }
        })
}

// add a value to a current value in local storage.
function addToLocalStorageInt(key, value) {

    if (localStorage.getItem(key) == 'NaN') {
        console.log("value here: " + localStorage.getItem(key))
        localStorage.setItem(key, '0')
    }
    try {
        currVal = parseInt(localStorage.getItem(key))
        newVal = currVal + value
        localStorage.setItem(key, newVal)
        console.log(newVal + " newVAl")
    }
    catch {
        console.error("Could not parse the local storage value in addToLocalStorage.")
    }
}

// append a string to a current string in local storage.
function addToLocalStorageString(key, value) {
    try {
        currVal = localStorage.getItem(key)
        if (currVal !== null) {
            newVal = currVal + '  ' + value
            localStorage.setItem(key, newVal)
        } else {
            localStorage.setItem(key, value)
        }
    }
    catch {
        console.error("Could not parse the local storage value in addToLocalStorage.")
    }
}

// modifiers are calculated here.
function updateModifiers() {
    const abilityScores = ['strength', 'dex', 'constitution', 'intellegence', 'wisdom', 'charisma'];

    abilityScores.forEach(score => {
        const abilityScoreKey = `_${score}`;
        const abilityScoreValue = parseInt(localStorage.getItem(abilityScoreKey), 10);

        if (!isNaN(abilityScoreValue)) {
            const modifiedValue = Math.floor((abilityScoreValue - 10) / 2);
            // console.log('abil is '+score + ' at ' +localStorage.getItem('_'+score)+ ' and value is '+modifiedValue)
            const modifiedKey = `_${score}ST`;

            localStorage.setItem(modifiedKey, modifiedValue.toString());
        }
    });
}

// Remove the value from an array.
function removeValue(arr, valueToRemove) {
    const index = arr.indexOf(valueToRemove);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

// Set local storage values if they are a part of the race/class choice.
function updateSkillLocalStorageValues() {
    const skills = [
        'Acrobatics', 'Animalhandling', 'Arcana', 'Athletics',
        'Deception', 'History', 'Insight', 'Intimidation',
        'Investigation', 'Medicine', 'Nature', 'Perception',
        'Performance', 'Persuasion', 'Religion', 'Sleightofhand',
        'Stealth', 'Survival'
    ];

    skills.forEach(skill => {
        const skillKey = `_${skill.toLowerCase()}`;
        const abilityScoreKey = `_${getRelevantAbilityScore(skill)}`;
        console.log("Abilityscore key: " + abilityScoreKey)

        // Get the value from localStorage for the ability score
        const abilityScoreValue = localStorage.getItem(abilityScoreKey);

        // Set the value in localStorage for the skill
        localStorage.setItem(skillKey, abilityScoreValue);
    });
}

// Helper function to get the relevant ability score for a skill
function getRelevantAbilityScore(skill) {
    // Implement your logic here to map each skill to its relevant ability score
    // This is just a placeholder example
    const skillToAbilityScore = {
        'Acrobatics': 'dexMod',
        'Animalhandling': 'wisdomMod',
        'Arcana': 'intellegenceMod',
        'Athletics': 'strengthMod',
        'Deception': 'charismaMod',
        'History': 'intellegenceMod',
        'Insight': 'wisdomMod',
        'Intimidation': 'charismaMod',
        'Investigation': 'intellegenceMod',
        'Medicine': 'wisdomMod',
        'Nature': 'intellegenceMod',
        'Perception': 'wisdomMod',
        'Performance': 'charismaMod',
        'Persuasion': 'charismaMod',
        'Religion': 'intellegenceMod',
        'Sleightofhand': 'dexMod',
        'Stealth': 'dexMod',
        'Survival': 'wisdomMod'
    };


    return skillToAbilityScore[skill] || 'Unknown';
}

// clear the content div (its on all pages) and return it.
function clearContentAndGet() {
    const contentDiv = document.getElementById('content');

    // Get all children of the 'content' div
    const children = contentDiv.children;

    // Loop through the children and remove them, excluding the one with id 'rolling'
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.id !== 'rolling') {
            contentDiv.removeChild(child);
        }
    }

    // Return the 'content' div
    return contentDiv;
}

// hide or show the rolling info.
function toggleRollDisplay() {
    rolling = document.getElementById('rolling')
    console.log('rolling info: ' + rolling.style.display)
    if (rolling.style.display === 'none') {
        console.log('sdfgsbd')
        rolling.style.display = "block"
    }
    else {
        rolling.style.display = 'none'
    }
}

// seek content div and add a new html elemnt to it.
function appendToContent(type, id = 'standardDiv') {
    res = document.createElement(type)
    document.getElementById('content').appendChild(res)
    if (id != null) res.setAttribute('id', id)
    return res

}

// create and append (if true) a button that says 'continue'. Load action in
// calling function
function newContinueButton(append = false) {
    res = document.createElement('button')
    res.innerText = "Continue"
    res.setAttribute('id', 'continueBtn')
    if (append) document.getElementById('content').appendChild(res)
    return res
}












































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

function armors(arm) {												 //Function that takes a feature and makes an API call

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

function races(race) {

    let raceS = String(race)
    let search = API2("races", raceS);
    const raceDiv = document.createElement('div')
    raceDiv.setAttribute('class', 'raceInfoDiv')

    fetch(search).then((response) => { 										 //API call using fetch then taking a json as a response
        if (response.ok) {													 //Check if you get a proper response since fetch only fails due to network issues
            return response.json();

        } else {															 //Accounting for possible network issues
            throw new Error("Network Error");
        }
    })
        .then(data => {

            const termInfo = parseAPIString(JSON.stringify(data.name));	     //Turning JSON attribute into a string
            const term = termInfo[0]
            // console.log("TERM: " + term)
            stat = document.createElement("h1")
            stat.innerHTML = term;
            raceDiv.appendChild(stat)

            const termdescInfo = parseAPIString(JSON.stringify(data.desc));
            const termdesc = termdescInfo[0]
            // console.log("TERMdesc: " + termdesc)
            statdesc = document.createElement("p")
            statdesc.innerHTML = termdesc
            raceDiv.appendChild(statdesc)

            const termdesc2Info = parseAPIString(JSON.stringify(data.asi_desc));
            const termdesc2 = termdesc2Info[0]
            statdesc2 = document.createElement("p")
            statdesc2.innerHTML = termdesc2
            raceDiv.appendChild(statdesc2)

            const termdesc3Info = parseAPIString(JSON.stringify(data.alignment));
            const termdesc3 = termdesc3Info[0]
            statdesc3 = document.createElement("p")
            statdesc3.innerHTML = termdesc3
            raceDiv.appendChild(statdesc3)

            const termdesc4 = parseAPIString(JSON.stringify(data.asi_desc))[0];
            statdesc4 = document.createElement("p")
            statdesc4.innerHTML = termdesc4
            raceDiv.appendChild(statdesc4)

            const termdesc5 = parseAPIString(JSON.stringify(data.languages))[0];
            statdesc5 = document.createElement("p")
            statdesc5.innerHTML = termdesc5
            raceDiv.appendChild(statdesc5)

            const termdesc6 = parseAPIString(JSON.stringify(data.vision))[0];
            statdesc6 = document.createElement("p")
            statdesc6.innerHTML = termdesc6
            raceDiv.appendChild(statdesc6)

            const termdesc7 = parseAPIString(JSON.stringify(data.traits))[0];
            statdesc7 = document.createElement("p")
            statdesc7.innerHTML = termdesc7
            raceDiv.appendChild(statdesc7)

            // const termdesc8 = parseAPIString(JSON.stringify(data.subraces))[0];
            // statdesc8 = document.createElement("p")
            // statdesc8.innerHTML = termdesc8
            // raceDiv.appendChild(statdesc8)

        })												 //using the JSON file

    return raceDiv

}

function parseAPIString(string) {
    res = []
    string = string.replaceAll("\"", '')
    string = string.replaceAll("##", '<h2>')
    string = string.replaceAll("\\n", "</h2>")
    string = string.replaceAll("**_", "<h2>")
    string = string.replaceAll("._**", "</h2>")
    res.push(string)

    return res
}