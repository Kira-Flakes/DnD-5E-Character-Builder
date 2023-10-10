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
