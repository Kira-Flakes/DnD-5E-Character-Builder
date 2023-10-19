// import { API } from './api.js';
// Scipts that allow for us to listen to html pages and update the pages based on 
// user actions.


// var api = new API()

// const { nextTick } = require("process");

// Sets the message for the user to be greeted with
function setWelcomeInfo(page) {
    const welcomeTxt = document.getElementById('welcomeMessage');
    const info = document.getElementById('info')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currPage = data[page]
            welcomeTxt.innerText = currPage.welcome;
            info.innerHTML = highlightTextWithMouseover(currPage.explainer, ['race', 'class', 'ability scores', 'personality', 'equipment', 'character sheet']);
            console.log("Here")
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
            explainerDiv.innerText = currentPage.explainer.details
            continueBtn = document.createElement('button')
            continueBtn.innerText = 'Begin'
            continueBtn.onclick = function () {
                clearDiv(explainerDiv)
                initPageInfo(page, iter + 1)
                document.getElementById('content').removeChild(continueBtn)
            }
            document.getElementById('content').appendChild(continueBtn)
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function clearDiv(div) {
    while (div.firstChild) { // delete all buttons, since we are done with this question
        div.removeChild(div.firstChild)
    }
}

// Sets alignment information
function setAlignmentInfo() {
    const alignButtons = Array.from(document.getElementsByName('_alignment'));
    console.log("Alignbuttons: " + alignButtons);

    for (const b of alignButtons) {
        // console.log("SFUSDNF");
        console.log(b);
    }
    alignButtons.forEach((button, index) => {
        button.addEventListener('mouseenter', function () {
            // Code to run when the button is hovered over
            button.style.backgroundColor = 'red'; // Change background color, for example
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
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {

            res.innerText = data.race.explainer;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadPageInfo() {

}

function initPageInfo(page, iter) {
    // const continueButton = document.createElement('button')
    const mainContent = document.getElementsByClassName('content')
    console.log("Initializing page \'" + page + "\'")

    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]
            // console.log("Looking for: \'" + Object.keys(currentPage)[iter] + '\' message at iter: ' + iter)
            switch (Object.keys(currentPage)[iter]) {
                case "welcome":
                    setWelcomeInfo(page) // adds continue button on return
                    break;
                case "explainer":
                    // console.log("In explainer")
                    // test()
                    loadExplainer(page, iter)
                    break;
                case "questions":
                    // console.log("In questions")
                    loadQuestion(page)

                default:
                    console.log("No info type found, returning")
                // mainContent.appendChild(continueButton)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // initPageInfo(page, iter+1)
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
                console.log("ANSWERS: " + answers[ans][2])
                tempButtonsId.push(ans) // add button to array that will be deleted when the user has answered the question
                answerButton.onclick = function () {
                    // get the intersection of the returned set and the new set
                    localStorage.setItem('$' + page, answers[ans][0])
                    // nextQuestion(answers[ans])
                    alterState(page, nextQuestion(answers[ans])); // add one to the state, so we go to the next question
                    // console.log("State changed to: " + localStorage.getItem("raceState"))
                    for (btn in tempButtonsId) { // delete all buttons, since we are done with this question
                        document.getElementById(tempButtonsId[btn]).remove()
                    }
                    loadQuestion(page) // load the next question
                }; // set actions for the buttons
                loadHelperInfoFromButton(answerButton, answers[ans]) // add the helper information to the page, explaining the implications of the choice.
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function nextQuestion(previousAnswer) {
    // console.log("PREV ANS: "+previousAnswer[2])
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
        button.style.backgroundColor = 'red'; // Change background color, for example
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
                title: 'Race',
                explanation: 'Based on your responses, we think these races would be a good fit for your playstyle.',
            })
            responses = data[page].questions.response
            set = localStorage.getItem(responses.options)
            let options = set.split(',')
            for (const r in options) {
                const choice = document.createElement('button');
                choice.setAttribute('id', 'choiceButton')
                choice.innerText = options[r]
                choice.onclick = function () {
                    localStorage.setItem('_' + page, options[r])
                    for (btn in tempButtons) { // delete all buttons, since we are done with this question
                        document.getElementById('choiceButton').remove()
                    }
                    pickSubrace(options[r])

                }; // set actions for the buttons
                tempButtons.push(choice)
                // div.appendChild(API)
                div.appendChild(choice)
                // TODO: add listeners for mousover and 
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function raceDiscreptionDiv(div) {
    document.createElement('div')
}

function pickSubrace(race) {
    console.log("Race is " + race)
    tempButtons = []
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            console.log('Json test: ' + data['race'].subRace[race])
            // response = document.getElementById('response')
            // response.innerText = 'Choose a subrace for your ' + race
            // document.getElementById('prompt').innerText = 'PROMTP'
            setElementsInColumnOne({
                title: 'Choose a Subrace for your ' + race,
                explanation: 'A subrace will give your character more depth and personality.',
                prompt: 'Select your race:',
                responseTitle: ''
            })
            opts = data['race'].subRace[race].split(',')
            for (const o in opts) {
                btn = document.createElement('button')
                btn.innerText = opts[o]
                btn.onclick = function () {
                    localStorage.setItem('subRace')
                }
                document.getElementById('content').appendChild(btn)
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
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
    localStorage.setItem(storageItem, change)
}
// function alterState(topic, change) {
//     var storageItem = topic + "State"
//     s = parseInt(localStorage.getItem(storageItem)) + change
//     localStorage.setItem(storageItem, s)
// }

function highlightTextWithMouseover(inputString, textsToHighlight) {
    if (!inputString || !Array.isArray(textsToHighlight) || textsToHighlight.length === 0) {
        return inputString;
    }

    const closeTag = '</mark>';

    let highlightedString = inputString;
    const encounteredTexts = new Set();

    textsToHighlight.forEach(textToHighlight => {
        const regex = new RegExp(textToHighlight, 'g');
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

    return highlightedString;
}

function loadHelperInfoFromMisc(text) {
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            response = data["misc"][text]
            document.getElementById('helperInfo').innerText = response
            console.log(response)
        })
        .catch(error => {
            console.error('Error:', error);
        });


    document.getElementById('helperInfo').innerText = text
}

function test() {
    console.log(backgrounds("Human"))
}


function displayRaceDetails(race) {

}




































// API


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
            document.getElementById("statdes6").innerHTML = termdesc6;
        }

            //weapons need text added to describe weight, value, etc.

        )
}

//weapons("rapier");

function armor(arm) {												 //Function that takes a feature and makes an API call

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
            document.getElementById("statdesc6").innerHTML = termdesc5;

            //armors need text added to describe weight, value, etc.
            //Weight and Stealth disadvantage values not showing up fml
        }
        )
}
//armor("scale-mail");
