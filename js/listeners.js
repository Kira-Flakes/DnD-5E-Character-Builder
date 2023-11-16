// TODO:
// 1. Fix dieties to present multiple options
// 2 fix highlight text with mousover. Just rewrite it.


// import { API } from './api.js';
// Scipts that allow for us to listen to html pages and update the pages based on 
// user actions.


// var api = new API()

// const { nextTick } = require("process");
const divCache = []
var allDetails
let racePrev = 0

const sd = "standardDiv"


// Use the fetch API to retrieve the JSON data
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

function getAllDetails() {
    // Use the fetch API to retrieve the JSON data
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            // Data is the parsed JSON object
            res = Object.keys(data.misc);
            console.log("in getAllDetails: " + res);
            return res
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
}

// Sets the message for the user to be greeted with
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
}


function presentPreset() {
    clearHelperInfo()
    localStorage.setItem('gettingstartedState', '1')
    colLeft = document.getElementById("colLeft")
    // console.log("Content:::: "+document.getElementById('_playername').value)
    if (document.getElementById('_playername').value === null) {
        localStorage.setItem('_playername', '')
    }
    else {
        localStorage.setItem('_playername', document.getElementById('_playername').value)
    }
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
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            let explainDiv = document.createElement('div')
            explainDiv.innerHTML = highlightTextWithMouseover(data['presetChoice'].explainer, allDetails)
            colLeft.appendChild(explainDiv)

            let qDiv = document.createElement('div')
            qDiv.innerHTML = data['presetChoice'].questions.q
            colLeft.appendChild(qDiv)
            pBtn = document.createElement('button')
            npBtn = document.createElement('button')
            pBtn.innerHTML = data['presetChoice'].questions.ans[0]
            pBtn.onclick = function () {
                clearDiv(colLeft)
                loadPresetBios()

            }
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

}

function flushSheet(ignore) {
    for (var i = 0; i < localStorage.length; i++) {
        item = localStorage.key(i);
        // console.log("Item: " + item)
        if (item.charAt(0) != '_') {
            // console.log(item + " doesnt start with _")
            continue
        }
        if (contains(ignore, item)) {
            // console.log("Item: "+ item+" is to be ignored")
            continue
        }
        localStorage.setItem(localStorage.key(i), '')
        // console.log("LS now: " + localStorage.key(i))

    }
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function loadPresetBios() {
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            colLeft = document.getElementById("colLeft")
            presets = data['presetChoice'].presets
            for (const p in presets) {
                console.log("P: " + p)
                bioContainer = document.createElement('div')
                // bioContainer.setAttribute('class','container')
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
                pImg = document.createElement('img')
                pImg.setAttribute('src', '../img/' + presets[p].id + '.png')
                // pImg.setAttribute('id','pImg')
                boxL.appendChild(pImg)
                pBio = document.createElement('div')
                pBio.innerHTML = presets[p].bio
                boxR.appendChild(pBio)
                var viewSheet = document.createElement('button')
                viewSheet.setAttribute('id', 'viewSheetBtn' + p)
                viewSheet.innerText = "View Character Sheet"
                // console.log("DSFDFDSF:  " + presets[p].id)
                var funcHelper = presets[p].id
                viewSheet.onclick = function () {
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

// Put all explainer information on the page
function loadExplainer(page, iter) {
    explainerDiv = document.getElementById("explainer")
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]
            // console.log("setting details")
            explainerDiv.innerHTML = highlightTextWithMouseover(currentPage.explainer.details, allDetails)
            continueBtn = document.createElement('button')
            continueBtn.setAttribute('id', 'beginButton')
            continueBtn.innerText = 'Begin'
            continueBtn.onclick = function () {
                clearDiv(explainerDiv)
                alterState(page, 1)
                // initPageInfo(page, iter + 1)
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

// Sets alignment information
function setAlignmentInfo() {
    const alignButtons = Array.from(document.getElementsByName('_alignment'));
    console.log("Alignbuttons: " + alignButtons);

    // for (const b of alignButtons) {
    //     // console.log("SFUSDNF");
    //     console.log(b);
    // }
    alignButtons.forEach((button, index) => {
        button.addEventListener('mouseenter', function () {
            // Code to run when the button is hovered over
            // button.style.backgroundColor = 'rgb(119, 45, 45)'; // Change background color, for example
            fetch('/guide.json')
                .then(response => response.json())
                .then(data => {
                    // Use the JSON data here
                    const v = button.value;
                    console.log(v);
                    const desc = data.background.alignment.options[v];
                    document.getElementById('alignmentSelection').innerText = v + ": " + desc;
                    console.log(desc);
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

// access guide and get the races
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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// function loadPageInfo() {

// }

function initPageInfo(page, iter) {
    // const continueButton = document.createElement('button')
    const mainContent = document.getElementsByClassName('content')
    console.log("Initializing page \'" + page + "\'")

    if (localStorage.getItem('_' + page) != "") {
        console.log("In special case on page")
    }

    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]
            // console.log("Looking for: \'" + Object.keys(currentPage)[iter] + '\' message at iter: ' + iter)
            switch (Object.keys(currentPage)[iter]) {
                case "welcome":
                    console.log("Setting welcome info for " + page)
                    setWelcomeInfo(page) // adds continue button on return
                    break;
                case "explainer":
                    // console.log("In explainer")
                    // test()
                    loadExplainer(page, iter)
                    break;
                case "questions":
                    console.log("Setting questions info for " + page)
                    // console.log("In questions")
                    loadQuestion(page)
                    break;
                default:
                    console.log("No info type found, handling")
                    handleSpecialCase(page)

                // mainContent.appendChild(continueButton)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // initPageInfo(page, iter+1)
}

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
            console.log("In class case\n")
            loadResponse(page)
        // conclusion('class');
        // case 'background':
        //     console.log('In background case');
        //     loadResponse(page);
        default: return
    }
}

// function decisionTree(page) {
//     state = localStorage.getItem(page + 'State')
//     console.log("Init decision tree at state "+state)
//     fetch('/guide.json') // open json data
//         .then(response => response.json())
//         .then(data => {
//             const currentPage = data[page]; // seek data from the current page (race, class, etc)
//             const questionJSON = currentPage.questions[q]; // get question based on state
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

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
                // console.log("End of questions for this section")
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
                // console.log("ANSWERS: " + answers[ans][2])
                tempButtonsId.push(ans) // add button to array that will be deleted when the user has answered the question
                answerButton.onclick = function () {
                    // get the intersection of the returned set and the new set
                    localStorage.setItem('$' + page, answers[ans][0])
                    // nextQuestion(answers[ans])
                    // racePrev = localStorage.getItem(page+"State")
                    // console.log("RacePrev: " + racePrev)
                    alterState(page, nextQuestion(answers[ans])); // add one to the state, so we go to the next question
                    // console.log("State changed to: " + localStorage.getItem("raceState"))
                    for (btn in tempButtonsId) { // delete all buttons, since we are done with this question
                        document.getElementById(tempButtonsId[btn]).remove()
                    }
                    document.getElementById('backbutton').remove()
                    loadQuestion(page) // load the next question
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

function nextQuestion(previousAnswer) {
    console.log("PREV ANS: " + previousAnswer[2])
    if (previousAnswer[2] == '->more') {
        console.log("In more case")
        // TODO: Add more logic here
    }
    return parseInt(previousAnswer[2])
}

function extractNames(inputString, asSet = false) {
    if (asSet) {
        // Initialize a Set to store names
        const namesSet = new Set();
        // Split the input string by commas to separate elements
        const parts = inputString.split(',');
        for (const part of parts) {
            // Split each part by a semicolon to separate the name and value
            const elements = part.split(';');
            // Check if the part has the required format (name;value)
            if (elements.length === 2) {
                const name = elements[0].trim(); // Extract and trim the name
                namesSet.add(name); // Add the name to the set
            }
        }
        return namesSet; // Return the set of names
    } else {
        // Initialize an array to store names
        const namesArray = [];
        // Split the input string by commas to separate elements
        const parts = inputString.split(',');
        for (const part of parts) {
            // Split each part by a semicolon to separate the name and value
            const elements = part.split(';');
            // Check if the part has the required format (name;value)
            if (elements.length === 2) {
                const name = elements[0].trim(); // Extract and trim the name
                namesArray.push(name); // Add the name to the array
            }
        }
        // Join the names in the array into a comma-separated string
        const namesString = namesArray.join(', ');
        return namesString; // Return the string of names
    }
}

function combineValues(string1, string2) {
    const result = new Map();

    function parseString(inputString) {
        const parts = inputString.split(',');

        for (const part of parts) {
            const elements = part.split(';');
            if (elements.length === 2) {
                const name = elements[0];
                const value = parseInt(elements[1]);

                if (!isNaN(value)) {
                    if (result.has(name)) {
                        result.set(name, result.get(name) + value);
                    } else {
                        result.set(name, value);
                    }
                }
            }
        }
    }

    parseString(string1);
    parseString(string2);

    const combinedString = Array.from(result, ([name, value]) => `${name};${value}`).join(',');
    console.log(combinedString)
    return combinedString;
}

// put this in alterstate param. Checks for
// the next question that actually changes the working set
function checkAnswerViability(title, currentPage, qNumber) {
    var nextQ = currentPage.questions['q' + (qNumber + 1)];
    if (nextQ === undefined) return 1
    workingSet = localStorage.getItem('$' + title)
    console.log("Working set: " + workingSet)
    for (var ans in nextQ.ans) {
        // console.log("Set func results: " + setFunctions("intersection", extractNames(workingSet), extractNames(nextQ.ans[ans][0])))
        // console.log("ans: " + nextQ.ans[ans][0])
        if (setFunctions("intersection", workingSet, nextQ.ans[ans][0]).length == 0) {

            // if (setFunctions("intersection", extractNames(workingSet), extractNames(nextQ.ans[ans][0])).length == 0) {
            // console.log("Intersection: " + setFunctions("intersection", workingSet, nextQ.ans[ans][0]))
            return 1 + checkAnswerViability(title, currentPage, qNumber + 1)
        }
    }
    return 0
}

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
        // console.log("TYPE: " +type)
        .then(response => response.json())
        .then(data => {
            switch (type) {
                case "set": // we present user with options
                    // console.log("We are in a choice from a set")
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
                explanation: 'Your answers indicate that this would be a good fit for your playstyle.',
            })
            responses = data[page].questions.response
            set = localStorage.getItem(responses.options)
            let options = set.split(',')
            switch (page) {
                case "race":
                    raceChoices(options, tempButtons, div, page);
                    break;
                case "class":
                    classChoices(options, tempButtons, div, page);
                    break;
                default:
                    console.log("Case not handled in giveChoices()")
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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
        console.log("divcache: " + raceD.val)
        divCache.push(raceD)
        choice.setAttribute('id', 'choiceButton')
        choice.innerText = options[r]
        choice.onclick = function () {
            if (options[r].includes('Dragonborn')) {
                console.log("optionsR: " + options[r])
                localStorage.setItem('_subrace', options[r])
                localStorage.setItem('_race', 'Dragonborn')
            }
            else {
                console.log("optionsR: " + options[r])
                localStorage.setItem('_' + page, options[r])
            }

            for (btn in tempButtons) { // delete all buttons, since we are done with this question
                document.getElementById('choiceButton').remove()
            }
            if (page == 'race') pickSubrace(options[r])

        }; // set actions for the buttons
        // button.addEventListener('mouseenter', function () {
        choice.addEventListener('mouseenter', function () {
            console.log("MOUSEDOVER")
            clearHelperInfo()
            document.getElementById('helperInfo').appendChild(divCache[r].val)
            // button.style.backgroundColor = 'rgb(119, 45, 45)';
        })
        tempButtons.push(choice)
        // div.appendChild(raceDiscreptionDiv(options[r]))
        div.appendChild(choice)
        // TODO: add listeners for mousover and 
    }
}

function classChoices(options, tempButtons, div, page) {
    // while (divCache.length > 0) {
    //     divCache.pop(); // Remove the last element
    // }
    for (const c in options) {
        const choice = document.createElement('button');
        classD = {}
        classD.id = options[c]
        // console.log("opts: " + c)

        classD.val = classDescriptionDiv(options[c])

        // classD.val = DiscreptionDiv(options[c])
        // console.log("classD.val.innerHtml:" + classD.val.innerHTML)

        divCache.push(classD)
        // console.log("DIVCHACHA: "+divCache)
        // console.log("divcache[0]: " + divCache[0].val.innerHTML)
        // console.log("cache at "+c+ " "+divCache[c].val.innerHTML)
        choice.setAttribute('id', 'choiceButton')
        choice.innerText = options[c]
        choice.onclick = function () {
            localStorage.setItem('_' + page, options[c])
            for (btn in tempButtons) { // delete all buttons, since we are done with this question
                document.getElementById('choiceButton').remove()
            }
            // Set the class
            // console.log("optsc " +options[c])
            setClass(options[c]);
            conclusion(page);

        }; // set actions for the buttons
        // button.addEventListener('mouseenter', function () {
        choice.addEventListener('mouseenter', function () {
            console.log("current Class" + divCache[c])
            clearHelperInfo()
            console.log("divCache[" + c + "]: " + divCache[c].val.innerHTML)
            document.getElementById('helperInfo').appendChild(divCache[c].val)
        })
        tempButtons.push(choice)
        // div.appendChild(raceDiscreptionDiv(options[r]))
        div.appendChild(choice)
    }
}

function setClass(_class) {
    localStorage.setItem("_classlevel", _class + " 1");
}

function clearHelperInfo() {
    document.getElementById('helperInfo').innerText = ''
    document.getElementById('helperInfo').innerHTML = ''

}

function clearMainInfo() {
    document.getElementById('title').innerText = ""
    document.getElementById('explainer').innerText = ""
    document.getElementById('question').innerText = ""
    // document.getElementById('prompt').innerText = ""


}

function raceDiscreptionDiv(race) {
    res = races(race.toLowerCase())
    // children = res.childElements()
    // for (const child in children) {
    //     child.
    // }
    return res

}

function classDescriptionDiv(_class) {
    const res = document.createElement('div')
    res.setAttribute('id', 'raceDesc' + _class)
    console.log("class: " + _class)
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            info = data.class.classes[_class]
            // console.log("Info " + info.desc)
            res.innerHTML = '<h2>' + _class + '</h2>' +
                '<div>' + info.desc + '<div>' +
                '<div>Primary Ability: ' + info.primaryAbility + '<div>' +
                '<div>Saving Throws: ' + info.savingThrows + '<div>' +
                '<div>Armor & Weapon Proficiencies: ' + info.ArmorWeaponProf + '<div>', allDetails
            // console.log("RESINNER: " + res.innerHTML)
            return res
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // res = classes(_class.toLowerCase());

    return res
}

function pickSubrace(race) {
    console.log("Race is " + race)
    const tempButtonsId = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            // console.log('Json test: ' + data['race'].subRace[race])
            // if no subrace is to be chosen.
            console.log("Value here: " + data['race'].subRace[race])
            if (data['race'].subRace[race] === 'null') {
                localStorage.setItem("_race", race)
                localStorage.setItem('_subRace', '')

                clearMainInfo()
                conclusion("race")
                return
            }
            setElementsInColumnOne({
                title: 'Choose a Subrace for your ' + race,
                explanation: 'A subrace will give your character more depth and personality.',
                // prompt: 'Select your race:',
                responseTitle: ''
            })
            opts = data['race'].subRace[race]
            for (const o in opts) {
                btn = document.createElement('button')
                btn.setAttribute('id', o)
                btn.innerText = o
                btn.onclick = function () {
                    localStorage.setItem('_subRace', o)
                    // localStorage.setItem('_race', o)
                    clearMainInfo()

                    for (const b in tempButtonsId) {
                        console.log("B: " + tempButtonsId[b])
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

function conclusion(page) {
    const conclusionDiv = document.createElement('div')
    conclusionDiv.setAttribute('id', 'conclusionDiv')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('content').innerHTML = highlightTextWithMouseover(data[page].conclusion.header)
            // const continueBtn = document.createElement('button')
            // continueBtn.innerText = "Continue"
            // document.getElementById('footerButton').innerText = 'Continue'
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

function continueToNextPage(currentPage, nextPage) {
    btn = document.createElement('button')
    btn.setAttribute('id', 'continueBtn')
    btn.innerText = "Continue"
    btn.onclick = function () {
        window.location.href = "../html/" + nextPage + ".html"
        // for (c in divCache) {
        //     divCache.pop()
        // }
    }
    document.getElementById('content').appendChild(btn)
    // console.log("WHats up?")
}

function loadRaceCompletionDiv() {

}

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

    // Additional elements can be set similarly

    // Optionally, you can also add error handling or checks for null values if needed
}

function getItemsWithHighestValues(inputString) {
    const pairs = inputString.split(',');
    let highestValue = -1;
    let secondHighestValue = -1;
    let highestValueRaces = [];
    let secondHighestValueRaces = [];

    pairs.forEach(pair => {
        const [race, value] = pair.split(';');
        const numericValue = parseInt(value, 10);

        if (numericValue > highestValue) {
            secondHighestValue = highestValue;
            secondHighestValueRaces = [...highestValueRaces];
            highestValue = numericValue;
            highestValueRaces = [race];
        } else if (numericValue === highestValue) {
            highestValueRaces.push(race);
        } else if (numericValue > secondHighestValue) {
            secondHighestValue = numericValue;
            secondHighestValueRaces = [race];
        } else if (numericValue === secondHighestValue) {
            secondHighestValueRaces.push(race);
        }
    });

    if (highestValueRaces.length === 1) {
        return [...highestValueRaces, ...secondHighestValueRaces];
    }
    console.log("Highest value races: " + highestValueRaces)
    return highestValueRaces;
}

// Returns a set object based on the working set in localstorage
// Useful for perfroming set operations.
function currentSet(seeking) {
    const query = '$' + seeking;
    const resString = localStorage.getItem(query);
    const res = resString.split(',');
    return new Set(res)
}


// Returns a new set based on a set operation between two sets
function setFunctions(action, setone, settwo) {
    var s1arr = setone.split(',');

    var s1 = new Set(s1arr)
    var s2arr = settwo.split(',');
    var s2 = new Set(s2arr);
    switch (action) {
        case "intersection":
            res = getIntersection(s1, s2)
            // console.log("Res "+Array.from(res).join(','))
            return Array.from(res).join(',')
        // break;
        default:
            console.error("Error: No set action taken (listeners.js setFunctions");
    }
}

// Performs an interseciton on a set.
function getIntersection(set1, set2) {
    // console.log("IN intersection - Set1: " + Array.from(set1) + " set2" + Array.from(set2))
    const ans = new Set();
    for (let i of set2) {
        if (set1.has(i)) {
            ans.add(i);
        }
    }
    // console.log("Intersection: " + ans);
    return ans;
}

// change the state of the topic.
// Params: Topic we are changeing the state of, and the amount we will change it by
// Example uses: User answered question 2. Change it by 1 to go to question 3.
//               User's answers have already narrowed down their options enough, Change it to
//                  the number that corresponds to the response state.
function alterState(topic, change) {
    var storageItem = topic + "State"
    // s = parseInt(localStorage.getItem(storageItem)) + change
    // console.log("Storage item: " + change)
    localStorage.setItem(storageItem, change)
}


function highlightTextWithMouseover(inputString, textsToHighlight) {

    console.log("Texts to highlight: " + textsToHighlight)
    if (!inputString || !Array.isArray(textsToHighlight) || textsToHighlight.length === 0) { //TODO: Account for multiple '**' sequences

        const strEl = inputString.split("**")
        // console.log("STREL: " + strEl)
        const newString = strEl[0] + localStorage.getItem(strEl[1]) + ' ' + strEl[strEl.length - 1]
        console.log(!Array.isArray(textsToHighlight))
        return newString;
    }

    const closeTag = '</mark>';

    let highlightedString = inputString;
    const encounteredTexts = new Set();
    const strEl = inputString.split("**")
    // console.log("STREL: " + strEl)
    const newString = strEl[0] + localStorage.getItem("_") + strEl[strEl.length]

    textsToHighlight.forEach(textToHighlight => {
        const regex = new RegExp(textToHighlight, 'gi');
        highlightedString = highlightedString.replace(regex, match => {
            if (!encounteredTexts.has(match)) {
                encounteredTexts.add(match);
                const mouseoverAction = 'loadHelperInfoFromMisc(\'' + match + '\')';
                const openTag = '<mark onmouseover="' + mouseoverAction + '">';
                return openTag + match + closeTag;
            }
            return match; // Return the match without highlighting if it's encountered again
        });
    });
    console.log("Highlighted String: " + highlightedString)
    return highlightedString;
}

function loadHelperInfoFromMisc(text) {
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            response = data["misc"][text.toLowerCase()]
            document.getElementById('helperInfo').innerText = response
            // console.log(response)
        })
        .catch(error => {
            console.error('Error:', error);
        });


    document.getElementById('helperInfo').innerText = text
}

function beginBackground(specialCaseHandled = false) {

    // add a boo param, if true then skip special background case
    if (!specialCaseHandled) checkForSpecialBackgroundCase();
    else {
        chooseAlignment()
    }


}

// Before we give the generic backround sequence, we need to handle special cases
function checkForSpecialBackgroundCase() {
    const cl = localStorage.getItem("_class")
    // cleric case - dieties are tied to alignment
    if (cl == "Cleric") {
        console.log("Cleric background special case. Handling...")
        initClericDieties();
    }
    else if (cl == 'Warlock') {
        console.log("Warlock background special case. Handling...")
        warlockDetails()
    }

    else {
        beginBackground(true)
    }

}

function warlockDetails() {
    content = clearContentAndGet()
    wlDetailDiv = appendToContent('div', 'standardDiv')
    wlDetailDiv.innerHTML = highlightTextWithMouseover(
        "Warlocks in D&D form pacts with powerful beings from other planes, resembling godlike entities. Patrons grant diverse powers and demand favors, with varying attitudes toward sharing knowledge or forming exclusive pacts. Warlocks sharing a patron can see each other as allies, siblings, or rivals, fostering unique relationships.", allDetails
    )

}

function getRealms() {
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
                }
            });
        });
}


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

function limitAlighment(realm) {
    // console.log(realm)
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
// 
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
    console.log(lsValue)
    localStorage.setItem("possibleAlignments", lsValue)

    chooseAlignment()
}

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

// </p><div class=\"container\"><button name=\"_alignment\"  value=\"Lawful Good\" onclick=\"character.setAlignment(value)\">Lawful Good</button><button name=\"_alignment\" value=\"Neutral Good\" onclick=\"character.setAlignment(value)\">Neutral Good</button><button name=\"_alignment\" value=\"Chaotic Good\" onclick=\"character.setAlignment(value)\">Chaotic Good</button></div><div class=\"container\"><button name=\"_alignment\" value=\"Lawful Neutral\" onclick=\"character.setAlignment(value)\">Lawful Neutral</button><button name=\"_alignment\" value=\"True Neutral\" onclick=\"character.setAlignment(value)\">True Neutral</button><button name=\"_alignment\" value=\"Chaotic Neutral\" onclick=\"character.setAlignment(value)\">Chaotic Neutral</button></div><div class=\"container\"><button name=\"_alignment\" value=\"Lawful Evil\" onclick=\"character.setAlignment(value)\">Lawful Evil</button><button name=\"_alignment\" value=\"Neutral Evil\" onclick=\"character.setAlignment(value)\">Neutral Evil</button><button name=\"_alignment\" value=\"Chaotic Evil\" onclick=\"character.setAlignment(value)\">Chaotic Evil</button></div>"

function chooseAlignment() {
    content = document.getElementById("content")
    console.log("allDetails: " + allDetails)
    clearDiv(content)
    appendToContent('div', "standardDiv").innerHTML = "<h2>Alignment</h2>"
    appendToContent('div', 'standardDiv').innerHTML = "It's time to choose an alignment, representing the nature of your character's actions. How would your character respond to the following scenarios?"

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
                    console.log("qans: "+quest1.ans[ans][0])
                    localStorage.setItem("alignAxis1", quest1.ans[ans][0])
                    alignQuestion2(data)
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });


    // get all children from content
    // children = content.children
    // allowedAlignments = localStorage.getItem("possibleAlignments").split(',')
    // // console.log("Allowed align: " + allowedAlignments)
    // for (let i = 0; i < children.length; i++) {
    //     const child = children[i];
    //     const childsChild = child.children
    //     for (let j = 0; j < childsChild.length; j++) {
    //         const cc = childsChild[j]
    //         // console.log("cval: " + cc.innerText)
    //         // Do something with each child element
    //         if (!allowedAlignments.includes(cc.value)) {
    //             // console.log("Grey out: " + child.innerText)
    //             cc.setAttribute('id', 'greyOut')
    //         }
    //         else cc.setAttribute('id', '')

    //         cc.onclick = function () {
    //             localStorage.setItem("_alignment", cc.innerText)
    //             if (localStorage.getItem("_class") == "Cleric") {
    //                 chooseDiety(localStorage.getItem("_alignment"))
    //                     .then(chosenDeity => {

    //                         console.log("Chosen Deity:", chosenDeity);
    //                         localStorage.setItem("_diety", chosenDeity)
    //                         addDietyInfo(chosenDeity)
    //                     })
    //                     .catch(error => {
    //                         console.error("Error:", error);
    //                     });
    //             }
    //             // dietyDebrief()
    //         }
    //     }
    // }
}

function alignQuestion2(data) {
    content = clearContentAndGet()
    var quest2 = data.background.questionsAlign.q2
    appendToContent('div', 'standardDiv').innerText = quest2.q
    // console.log(response)
    for (ans in quest2.ans) {
        console.log(ans)
        var ansBtn = appendToContent('button')
        ansBtn.innerText = ans
        ansBtn.onclick = function () {
            localStorage.setItem("alignAxis2", quest2.ans[ans][0])
            // goto to next step
            // chooseDevineDomain()
            localStorage.setItem('_alignment',localStorage.getItem('alignAxis1') + " "+ localStorage.getItem('alignAxis2'))
            alignDebrief()
        }
    }
}

function alignDebrief() {
    content = clearContentAndGet()
    appendToContent('div','standardDiv').innerHTML = highlightTextWithMouseover("You have been aligned with "+localStorage.getItem('_alignment')+ ".",allDetails)
    cont = appendToContent('button')
    cont.innerText = 'Continue'
    cont.onclick = function () {
        backgroundQuestions()
    }

    
}

function chooseDiety(alignment) {
    alignchars = alignment.split(" ")
    var alignKey = []
    alignKey.push(alignchars[0].charAt(0))
    if (alignKey[0] == 'T') alignKey[0] = 'N'
    alignKey.push(alignchars[1].charAt(0))
    var filePath = '../misc/clericDieties.csv';

    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    complete: function (results) {
                        const data = results.data;

                        // Replace 'YourCategory' with the desired category
                        // const desiredCategory = 'YourCategory';

                        // Filter data for the desired category
                        const categoryData = data.filter(row => row['Category'] === localStorage.getItem("realm"));

                        // Find all deities that match the conditions
                        const matchingDeities = categoryData
                            .filter(row => row['Order'] === alignKey[0] && row['Morality'] === alignKey[1])
                            .map(row => row['Deity']);

                        // Resolve with the array of deities if found, otherwise, reject
                        if (matchingDeities.length > 0) {
                            resolve(matchingDeities);
                        } else {
                            reject("No deities found for the specified alignment.");
                        }
                    }
                });
            })
            .catch(error => reject('Error fetching the CSV file: ' + error));
    });
}

function addDietyInfo(listOfDieties) {
    content = clearContentAndGet()


    if (listOfDieties.length == 1) {
        d = appendToContent('div', "standardDiv")
        d.innerHTML = highlightTextWithMouseover("You have been assigned " + listOfDieties[0] + ".", allDetails)
        // content.appendChild(d)
        localStorage.setItem("_diety", listOfDieties[0])
    }
    else {
        var explain = appendToContent('div', 'standardDiv')
        possibleDietiesDiv = appendToContent('div', 'standardDiv')
        explain.innerHTML = highlightTextWithMouseover("Choose a Diety to worship:\n", allDetails)
        for (const d in listOfDieties) {
            const diety = listOfDieties[d]
            const dietyInfo = document.createElement('button')
            dietyInfo.setAttribute('id', 'standardDiv')
            dietyInfo.innerHTML = highlightTextWithMouseover(
                listOfDieties[d],
                allDetails)
            possibleDietiesDiv.appendChild(dietyInfo)
        }
    }
    cBtn = newContinueButton(true)
    cBtn.onclick = function () {
        console.log("TBT button action in function addDietyInfo")
        pickJob()
    }
}

function dietyDebrief() {
    content = clearContentAndGet()
    dietyOutro = appendToContent('div', 'standardDiv')
    dietyOutro.innerHTML = highlightTextWithMouseover('Your cleric worships ' + localStorage.getItem("_diety"), allDetails)
}


// TODO: For humans we need to get region
function characterName() {
    content = clearContentAndGet()
    appendToContent('h2').innerText = "Character Name"
    appendToContent('div', 'standardDiv').innerHTML = "It's time to choose what you would like to be called throughout your campaign."

    appendToContent('div').innerHTML = '<input id="_name" class="textinput" type="text" placeholder="Enter name"><br><button class="submitButton" onclick="storeKeyFromInput(\'_name\')" role="button">Submit</button>'
    appendToContent('div').innerHTML = "You can choose any name you please, but if you do want to pick a standard name for a " + localStorage.getItem("_race") + ", these are some examples."

    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            var race = localStorage.getItem("_race")
            console.log(race)
            var males = data.races[race].maleNames
            var females = data.races[race].femaleNames
            console.log(males)
            document.getElementById('content').appendChild(createNameTable(race, males, females))
        })

        .catch(error => {
            console.error('Error:', error);
        });
}

function createNameTable(race, maleValues, femaleValues) {
    // Create a table element
    const table = document.createElement('table');

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

function backgroundQuestions(questionNum = 1) {
    content = clearContentAndGet()
    if (questionNum == 1) {
        explainer = appendToContent('div', 'standardDiv')
        explainer.innerHTML = highlightTextWithMouseover(
            "Every character's story begins with a background that shapes their identity and journey. Whether a knight, soldier, sage, or artisan, your character's past provides essential clues about their origin and motivations. Delving into your background prompts crucial questions about change, the transition to adventuring, the source of your initial funds, skill acquisition, and what distinguishes you within your shared background.",
            allDetails
        )
        // explainer2 = appendToContent('div','standardDiv')
        // explainer2.innerHTML = highlightTextWithMouseover(
        //     "",
        //     allDetails
        // )
    }
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            var quest = data.background.questions['q' + questionNum.toString()]
            console.log(quest)
            appendToContent('div', 'standardDiv').innerHTML = quest.q
            for (const ans in quest.ans) {
                const btn = appendToContent('button')
                btn.innerText = ans
                btn.onclick = function () {
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

function pickBackgroundFromQuestions(optionsAsString) {
    possibleChoices = optionsAsString.split(',')
    for (const choice in possibleChoices) {
        // console.log("Choice: "+possibleChoices[choice])
        // console.log(possibleChoices[choice].toLowerCase())
        loadAllBackgroundInfo(possibleChoices[choice])
    }
}

function loadAllBackgroundInfo(choice) {
    // var bgData
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const bgDiv = document.createElement('div')
            bgDiv.setAttribute('id','backgroundInfo')
            const title = document.createElement('h2')
            title.innerText = choice
            bgDiv.appendChild(title)
            const bgData = data[choice]
            // console.log("bgDATA: " + bgData)
            for (el in bgData) {
                console.log(el)
                const label = document.createElement('h3')
                label.innerText = el
                const info = document.createElement('p')
                if ( bgData[el] instanceof Object) {
                    info.setAttribute('id','innerInfo')
                    console.log("Object found")
                    for (var thing in bgData[el]) {
                        const tng = document.createElement('p')
                        tng.innerText = bgData[el][thing]
                        info.appendChild(tng)
                    }
                }
                else {
                    if (el == 'Description' || el == 'Suggested Characteristics') {
                        info.innerHTML = bgData[el]
                    }
                    else {
                        info.innerHTML = highlightTextWithMouseover(bgData[el],allDetails)
                    }
                }
                
                bgDiv.appendChild(label)
                bgDiv.appendChild(info)
            }
            select = document.createElement('button')
            select.innerText = "Select "+choice
            select.onclick = function () {
                localStorage.setItem("_background",choice)
                // move to next sequence
                console.log("Chose "+choice+" as background")
                characterName()
            }
            bgDiv.appendChild(select)
            document.getElementById('content').appendChild(bgDiv)
        })
        .catch(error => {
            console.error('Error:', error);
        });

    
}


function clearContentAndGet() {
    clearDiv(document.getElementById('content'))
    return document.getElementById('content')
}

function appendToContent(type, id = null) {
    res = document.createElement(type)
    document.getElementById('content').appendChild(res)
    if (id != null) res.setAttribute('id', id)
    return res

}

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