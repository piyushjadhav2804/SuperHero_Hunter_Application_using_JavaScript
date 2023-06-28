//This JavaScript file is linked to the hero-details.html file. 
//It contains the logic for retrieving and displaying detailed information about a specific superhero, 
//such as the hero's thumbnail, name, description, and related comics, events, series, and stories.

// Constants
const PUBLIC_KEY = "c5c797efc4cf200741ba7a553fc506cc";
const PRIVATE_KEY = "05d4e28fa0d2154fa06ea1ffab90b4f51f1c2be1";
const API_URL = "https://gateway.marvel.com/v1/public/characters";

// DOM Elements
// These elements will be used to display the superhero's information on the page.
const heroThumbnail = document.getElementById("heroThumbnail");
const heroName = document.getElementById("heroName");
const heroDescription = document.getElementById("heroDescription");
const comicsList = document.getElementById("comics");
const eventsList = document.getElementById("events");
const seriesList = document.getElementById("series");
const storiesList = document.getElementById("stories");

// Get hero ID from URL parameter
// The URLSearchParams object is used to parse the query string of the URL and get() retrieves value of id
const urlParams = new URLSearchParams(window.location.search);
const heroId = urlParams.get("id");

// Event listeners
// This event listener is triggered when the DOM content of the page is loaded
document.addEventListener("DOMContentLoaded", () => {

  // retrieve and display the details of the superhero with the specified ID.
  getHeroDetails(heroId);
});

// Functions

// generates nd MD5 hash using CryptoJS library. This hash is used for API authentication
function generateHash(timestamp, privateKey, publicKey) {
  const input = timestamp + privateKey + publicKey;
  const hash = CryptoJS.MD5(input).toString();
  return hash;
}

// retrieves the detailed information of a superhero from the Marvel API using the provided hero ID.
function getHeroDetails(heroId) {
  const timestamp = new Date().getTime();
  const hash = generateHash(timestamp, PRIVATE_KEY, PUBLIC_KEY);

  // constructs the API URL
  const url = `${API_URL}/${heroId}?apikey=${PUBLIC_KEY}&ts=${timestamp}&hash=${hash}`;

  // performs an API request using the fetch() function
  fetch(url)
    //got response in JSON format
    .then((response) => response.json())
    .then((data) => {
      //API response is passed to displayResults()
      displayHeroDetails(data.data.results[0]);
    })
    .catch((error) => console.log(error));
}

function displayHeroDetails(hero) {
  //set thumbnail as image
  heroThumbnail.innerHTML = `<img src="${hero.thumbnail.path}/standard_medium.${hero.thumbnail.extension}" alt="${hero.name}">`;

  //set hero name as string
  heroName.textContent = hero.name;

  //set description as string to heroDescription element if present, otherwise show the message
  heroDescription.textContent = hero.description || "No description available";

  //called for each related item category (comics, events, series, and stories) to display the list of related items. 
  displayListItems(hero.comics.items, comicsList);
  displayListItems(hero.events.items, eventsList);
  displayListItems(hero.series.items, seriesList);
  displayListItems(hero.stories.items, storiesList);
}

function displayListItems(items, listElement) {
  
  //clears the existing content of the lisElement
  listElement.innerHTML = "";

  //iterates over each item
  items.forEach((item) => {

    //li element created dynamically to display the list
    const li = document.createElement("li");
    li.textContent = item.name;
    listElement.appendChild(li);
  });
}
