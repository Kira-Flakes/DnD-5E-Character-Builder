// Scipts that allow for us to listen to html pages and update the pages based on 
// user actions.

// Sets the message for the user to be greeted with
function setWelcomeInfo() {
    const welcomeTxt = document.getElementById('welcomeMessage');

    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {

            welcomeTxt.innerText = data.gettingStarted.welcome;

        })
        .catch(error => {
            console.error('Error:', error);
        });
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

// access API and get the races
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

function loadQuestion(page) {

    const question = document.getElementById('prompt');
    const tempButtonsId = []
    // const state
    q = 'q' + localStorage.getItem(page + 'State');
    console.log("Q: " + q)


    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            const currentPage = data[page];
            title.innerText = capitalize(page);
            const questionJSON = currentPage.questions[q];
            try {
                question.innerText = questionJSON.q;
            }
            catch {
                console.log("End of questions for this section")
                const qDiv = document.getElementById('question');

                // Remove all child elements within the div
                while (qDiv.firstChild) {
                    qDiv.removeChild(qDiv.firstChild);
                }
                console.log("Type: ", currentPage.questions.response.type)
                loadResponse(page, currentPage.questions.response.type)
                return
            }
            answers = currentPage.questions[q].ans
            console.log(answers)

            // create buttons for each answer, assigning the value of the button the 
            // subset of characters it will offer the player, depending on the answer.
            for (let ans in answers) {
                var answerButton = document.createElement("button");
                answerButton.setAttribute('id', ans)
                var buttonText = document.createTextNode(ans);
                answerButton.appendChild(buttonText);
                document.getElementById('answers').appendChild(answerButton);
                document.getElementById(ans).setAttribute('value', answers[ans])
                console.log("ans " + answers[ans])
                tempButtonsId.push(ans)
                answerButton.onclick = function () {
                    // get the intersection of the returned set and the new set
                    // console.log("Set from answers: " + this.getAttribute('value'))
                    intersect = setFunctions("intersection", this.value, currentSet(page))
                    // console.log("Clicked " + this.innerText + " set is " + intersect)
                    localStorage.setItem('$' + page, intersect)
                    // console.log("Temp buttons: "+tempButtonsId[1])
                    alterState(page, 1);
                    for (btn in tempButtonsId) {
                        console.log("BTN:" + tempButtonsId[btn])
                        document.getElementById(tempButtonsId[btn]).remove()
                    }
                    loadQuestion(page)
                }; // set actions for the buttons
                loadHelperInfo(answerButton,answers[ans])
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // document.getElementById('prompt')
}

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

function loadResponse(page, type) {
    fetch('/guide.json')
        .then(response => response.json())
        .then(data => {
            switch (type) {
                case "set": // we present user with options
                    console.log("We are in a choice from a set")
                    giveChoices(page)

                    break;

                default:
                    console.error("Error: response did not load");
                    break;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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

function currentSet(seeking) {
    const query = '$' + seeking;
    const resString = localStorage.getItem(query);
    const res = resString.split(',');
    // console.log("currentSet, res "+res);

    return new Set(res)
}


// Returns a new set based on a set operation between two sets
function setFunctions(action, setone, settwo) {
    var s1arr = setone.split(',');
    // var s2arr = settwo.split(',');
    var s1 = new Set(s1arr)
    // var s2 = new Set(s2arr)
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
function alterState(topic, change) {
    var storageItem = topic + "State"
    s = parseInt(localStorage.getItem(storageItem)) + change
    localStorage.setItem(storageItem, s)
}