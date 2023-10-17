// Scipts that allow for us to listen to html pages and update the pages based on 
// user actions.

const { nextTick } = require("process");

// Sets the message for the user to be greeted with
function setWelcomeInfo(page) {
    const welcomeTxt = document.getElementById('welcomeMessage');
    const info = document.getElementById('info')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currPage = data[page]
            welcomeTxt.innerText = currPage.welcome;
            info.innerHTML = highlightTextWithMouseover(currPage.explainer, ['race', 'class', 'ability scores', 'personality', 'equipment']);
            console.log("Here")
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // returnedBtn = document.createElement('button')
    // returnedBtn.innerText = 'Continue'
    // returnedBtn.onclick = function () {
    //     document.location.href = "../html/class.html"
    // }

}

// Put all explainer information on the page
function loadExplainer(page, iter) {
    explainerDiv = document.getElementById("explainer")
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page]
            console.log("setting details")
            explainerDiv.innerText = currentPage.explainer.details
            continueBtn = document.createElement('button')
            continueBtn.innerText = 'Continue'
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
            console.log("Looking for: \'" + Object.keys(currentPage)[iter] + '\' message at iter: ' + iter)
            switch (Object.keys(currentPage)[iter]) {
                case "welcome":
                    setWelcomeInfo(page) // adds continue button on return
                    break;
                case "explainer":
                    console.log("In explainer")
                    loadExplainer(page, iter)
                    break;
                case "questions":
                    console.log("In questions")
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
            // title.innerText = capitalize(page); 

            const questionJSON = currentPage.questions[q]; // get question based on state
            try {  // try to load the question
                question.innerText = questionJSON.q;
            }
            catch { // question is null, we are at the end of the sequence
                console.log("End of questions for this section")
                const qDiv = document.getElementById('question'); // get question div

                // Remove all child elements within the div, since we are done with the questions
                while (qDiv.firstChild) {
                    qDiv.removeChild(qDiv.firstChild);
                }
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

                tempButtonsId.push(ans) // add button to array that will be deleted when the user has answered the question
                answerButton.onclick = function () {
                    // get the intersection of the returned set and the new set
                    // intersect = setFunctions("intersection", this.value, localStorage.getItem('$' + page)) // TODO: Change to combine strings
                    var vals = combineValues(this.value, localStorage.getItem('$' + page))
                    // localStorage.setItem('$' + page, intersect)
                    localStorage.setItem('$' + page, vals)
                    alterState(page, 1 + checkAnswerViability(page, currentPage, state)); // add one to the state, so we go to the next question
                    console.log("State changed to: " + localStorage.getItem("raceState"))
                    for (btn in tempButtonsId) { // delete all buttons, since we are done with this question
                        document.getElementById(tempButtonsId[btn]).remove()
                    }
                    loadQuestion(page) // load the next question
                }; // set actions for the buttons
                loadHelperInfo(answerButton, answers[ans]) // add the helper information to the page, explaining the implications of the choice.
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
    console.log(title + " Current page")

    if (nextQ === undefined) return 1
    workingSet = localStorage.getItem('$' + title)
    console.log("Working set: " + workingSet)
    for (var ans in nextQ.ans) {
        console.log("Set func results: " + setFunctions("intersection", extractNames(workingSet), extractNames(nextQ.ans[ans][0])))
        console.log("ans: " + nextQ.ans[ans][0])
        if (setFunctions("intersection", extractNames(workingSet), extractNames(nextQ.ans[ans][0])).length == 0) {
            console.log("Intersection: " + setFunctions("intersection", workingSet, nextQ.ans[ans][0]))
            return 1 + checkAnswerViability(title, currentPage, qNumber + 1)
        }
    }
    return 0
}

// Function uses the json data attached to each question, specifically the helpful information.
// loads it to the right column of the page when the user hovers over the option.
function loadHelperInfo(button, jsonData) {
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
        .then(response => response.json())
        .then(data => {
            switch (type) {
                case "set": // we present user with options
                    console.log("We are in a choice from a set")
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
            responses = data[page].questions.response
            document.getElementById('responseTitle').innerText = responses.title;
            set = localStorage.getItem(responses.options)
            var options = getItemsWithHighestValues(set)
            for (r in options) {
                const choice = document.createElement('button');
                choice.innerText = options[r]
                console.log(options[r])
                tempButtons.push(choice)
                div.appendChild(choice)
                // TODO: add listeners for mousover and 
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
    console.log("Highest value races: "+highestValueRaces)
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
    console.log(s2arr + "SJASFNLASKFN")
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
    console.log("IN intersection - Set1: " + Array.from(set1) + " set2" + Array.from(set2))
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
    s = parseInt(localStorage.getItem(storageItem)) + change
    localStorage.setItem(storageItem, s)
}

function highlightTextWithMouseover(inputString, textsToHighlight, mouseoverAction) {
    if (!inputString || !Array.isArray(textsToHighlight) || textsToHighlight.length === 0) {
        return inputString;
    }

    const openTag = '<mark>';
    const closeTag = '</mark>';

    let highlightedString = inputString;

    textsToHighlight.forEach(textToHighlight => {
        const regex = new RegExp(textToHighlight, 'g');
        highlightedString = highlightedString.replace(regex, match => {
            return openTag + match + closeTag;
        });
    });

    return highlightedString;
}