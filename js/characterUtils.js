// Functions that dertmine attributes based on multiple user inputs

// based on tick boxes the user has selected, determines the most likely
//class the player would like to role-play under.
// input: bitmap of the 
// import './api.js';
// let api = new API;

function classSelector(preferences) {
  classes = API(classes, "");
  console.log(classes)
}

// Returns a random integer between the min and max values.
function roll(min, max) {
  // Generate a random decimal number between 0 and 1
  const randomDecimal = Math.random();

  // Scale and shift the random decimal to the desired range [min, max]
  const randomInRange = min + (randomDecimal * (max - min + 1));

  // Take the floor to get an integer value within the range [min, max]
  return Math.floor(randomInRange);
}

function loadQuestion() {
  const cq = document.getElementById('currQuery');
  fetch('/guide.json')
    .then(response => response.json())
    .then(data => {

      cq.innerText = data.race.questions.q1;

    })
    .catch(error => {
      console.error('Error:', error);
    });
}