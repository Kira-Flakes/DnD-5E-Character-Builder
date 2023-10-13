// Scipts that allow for us to listen to html pages and update the pages based on 
// user actions.

// Sets the message for the user to be greeted with
function setWelcomeInfo(page) {
    const welcomeTxt = document.getElementById('welcomeMessage');
    const info = document.getElementById('info')
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currPage = data[page]
            welcomeTxt.innerText = currPage.welcome;
            info.innerHTML = highlightTextWithMouseover(currPage.explainer,['race', 'class', 'ability scores', 'personality', 'equipment']);
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
                    intersect = setFunctions("intersection", this.value, currentSet(page)) // perform set interesciton so the players choices narrow
                    localStorage.setItem('$' + page, intersect)
                    alterState(page, 1); // add one to the state, so we go to the next question
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
            raceOptions = set.split(',')
            for (r in raceOptions) {
                const choice = document.createElement('button');
                choice.innerText = raceOptions[r]
                tempButtons.push(choice)
                div.appendChild(choice)
                // TODO: add listeners for mousover and 
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
    switch (action) {
        case "intersection":
            res = getIntersection(s1, settwo)
            // console.log("Res "+Array.from(res).join(','))
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