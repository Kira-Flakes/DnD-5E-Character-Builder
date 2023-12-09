# DnD-5E-Character-Builder

## Authors: John Gilbert, Simon Hockin, Marcus Martinez, Erick Ortiz

## [Link to Project](https://wiz-rad.com/)

### Some special instructions.
#### The state of the character creation process is cached in local storage. If any unnexpected issues arise, please refresh your cache and hit the 'Reset' button found on the right-hand side of the page of the class or race tab.

## File descriptions:
### listeners.js:
#### The driver of the project. All events are handles in this file. Most of the logic is handled here as well. You'll find all button events, mouseover actions, calculations, and storage management occurs in this file.
### api.js:
#### All API calls are handled here and piped into the listener functions. The API's used are [Dnd5eapi](https://www.dnd5eapi.co/api/) and [open5e](https://api.open5e.com/v1/). These API's include information about races, classes and backgrounds found in the DnD 5E handbook. 
### guide.json
#### All information not found in the APIs are loaded to this custom json file. Information is based on the official DnD 5E handbook. json Data is fetched  as needed to help the user understand the character creation process and relevant aspects of a DnD campaign.
### dice.js, D20Logo.js and OrbitControls.js
#### Using three.js and CANNON.js, custom 3D assets have been built to add flair to the project. The D6 die is used to roll for ability scores and the logo is displayed by the webpage title. 
### HTML
#### This project contains HTML files that represent a different tab (getting started, class, race, background, equipment, ability scores). These pages all contain the same divs (content, helperInfo and tabs). The similarity between these pages are by design and the functional goal is to provide simple browser history logging. Nearly all the other html elements are created on the fly in listener.js. These HTML files are skeletons for the real content.
### CSS
#### Our html styles are handled in these css files. 
### Miscellanous Files
#### We also have custom art for different races and presets, as well as CSV data to help pipe in attributes for specific races, classes, backgrounds, and other special info we need to account for.
