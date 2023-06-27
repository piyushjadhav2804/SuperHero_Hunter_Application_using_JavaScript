// Constants
const PUBLIC_KEY = "c5c797efc4cf200741ba7a553fc506cc";
const PRIVATE_KEY = "05d4e28fa0d2154fa06ea1ffab90b4f51f1c2be1";
const API_URL = "https://gateway.marvel.com/v1/public/characters";

// DOM Elements
const heroThumbnail = document.getElementById("heroThumbnail");
const heroName = document.getElementById("heroName");
const heroDescription = document.getElementById("heroDescription");
const comicsList = document.getElementById("comics");
const eventsList = document.getElementById("events");
const seriesList = document.getElementById("series");
const storiesList = document.getElementById("stories");

// Get hero ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const heroId = urlParams.get("id");

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  getHeroDetails(heroId);
});

// Functions
function generateHash(timestamp, privateKey, publicKey) {
  const input = timestamp + privateKey + publicKey;
  const hash = CryptoJS.MD5(input).toString();
  return hash;
}

function getHeroDetails(heroId) {
  const timestamp = new Date().getTime();
  const hash = generateHash(timestamp, PRIVATE_KEY, PUBLIC_KEY);

  const url = `${API_URL}/${heroId}?apikey=${PUBLIC_KEY}&ts=${timestamp}&hash=${hash}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayHeroDetails(data.data.results[0]);
    })
    .catch((error) => console.log(error));
}

function displayHeroDetails(hero) {
  heroThumbnail.innerHTML = `<img src="${hero.thumbnail.path}/standard_medium.${hero.thumbnail.extension}" alt="${hero.name}">`;
  heroName.textContent = hero.name;
  heroDescription.textContent = hero.description || "No description available";

  displayListItems(hero.comics.items, comicsList);
  displayListItems(hero.events.items, eventsList);
  displayListItems(hero.series.items, seriesList);
  displayListItems(hero.stories.items, storiesList);
}

function displayListItems(items, listElement) {
  listElement.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    listElement.appendChild(li);
  });
}
