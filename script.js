// Constants
const PUBLIC_KEY = "c5c797efc4cf200741ba7a553fc506cc";
const PRIVATE_KEY = "05d4e28fa0d2154fa06ea1ffab90b4f51f1c2be1";
const API_URL = "https://gateway.marvel.com/v1/public/characters";

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const favoritesList = document.getElementById("favoritesList");

// Event listeners
searchBtn.addEventListener("click", searchSuperhero);

// Functions

function generateHash(timestamp, privateKey, publicKey) {
  const input = timestamp + privateKey + publicKey;
  const hash = CryptoJS.MD5(input).toString();
  return hash;
}

function searchSuperhero() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") return;

  const timestamp = new Date().getTime();
  const hash = generateHash(timestamp, PRIVATE_KEY, PUBLIC_KEY);

  const url = `${API_URL}?nameStartsWith=${searchTerm}&apikey=${PUBLIC_KEY}&ts=${timestamp}&hash=${hash}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.data.results);
    })
    .catch((error) => console.log(error));
}

function displayResults(superheroes) {
  resultsDiv.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row";

  superheroes.forEach((dataItem) => {
    const col = document.createElement("div");
    col.className = "col-4";

    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.className = "card-img-top";
    image.setAttribute(
      "src",
      dataItem.thumbnail?.path +
        "/standard_medium." +
        dataItem.thumbnail?.extension
    );
    image.setAttribute("alt", dataItem.name);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const name = document.createElement("h5");
    name.className = "card-title";

    const nameLink = document.createElement("a");
    nameLink.textContent = dataItem.name;
    nameLink.href = `html/hero-details.html?id=${dataItem.id}`;
    name.appendChild(nameLink);

    const addToFavoritesBtn = document.createElement("button");
    addToFavoritesBtn.className = "btn btn-primary";
    addToFavoritesBtn.textContent = isSuperheroInFavorites(dataItem)
      ? "Remove from Favorites"
      : "Add to Favorites";
    addToFavoritesBtn.addEventListener("click", () =>
      toggleFavorites(dataItem, addToFavoritesBtn)
    );

    cardBody.appendChild(name);
    cardBody.appendChild(addToFavoritesBtn);

    card.appendChild(image);
    card.appendChild(cardBody);

    col.appendChild(card);
    row.appendChild(col);
  });

  resultsDiv.appendChild(row);
}

function isSuperheroInFavorites(superhero) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((favSuperhero) => favSuperhero.name === superhero.name);
}

function toggleFavorites(superhero, button) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const isDuplicate = favorites.some(
    (favSuperhero) => favSuperhero.name === superhero.name
  );

  if (isDuplicate) {
    const updatedFavorites = favorites.filter(
      (favSuperhero) => favSuperhero.name !== superhero.name
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    button.textContent = "Add to Favorites";
  } else {
    favorites.push(superhero);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    button.textContent = "Remove from Favorites";
  }
}

function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoritesList.innerHTML = "";

  favorites.forEach((favorite) => {
    const li = document.createElement("li");
    li.textContent = favorite.name;
    favoritesList.appendChild(li);
  });
}

displayFavorites();
