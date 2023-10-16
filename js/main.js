// Calling this function will reset every aspect of the creator, as if a new
// User was creating their character. Useful for testing, but should not be called as much in
// the final implementation
function init() {

    // initialize localStorage values
    races = "Dwarf,Elf,Tiefling,Dragonborn,Human,Half-Elf,Half-Orc,Halfling,Gnome";
    localStorage.setItem("$race",races); // working set
    localStorage.setItem("%race", races);

    // States are directly associated with the questions. 
    // Example: chainging race to state 2 will mean question 2 of the state will be asked.
    localStorage.setItem("state",'0'); // saves the state of the program, set to zero
    localStorage.setItem("raceState","1");
}   
