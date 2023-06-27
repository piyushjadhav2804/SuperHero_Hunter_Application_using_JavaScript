// Constants
const PUBLIC_KEY = "c5c797efc4cf200741ba7a553fc506cc";
const PRIVATE_KEY = "05d4e28fa0d2154fa06ea1ffab90b4f51f1c2be1";
const API_URL = "https://gateway.marvel.com/v1/public/characters";

// DOM Elements
const favoritesList = document.getElementById("favoritesList");

// Load favorites from localStorage
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
});

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favoritesList.innerHTML = "";

  favorites.forEach((superhero) => {
    const col = document.createElement("div");
    col.className = "col-4";

    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.className = "card-img-top";
    image.setAttribute(
      "src",
      superhero.thumbnail?.path +
        "/standard_medium." +
        superhero.thumbnail?.extension
    );
    image.setAttribute("alt", superhero.name);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const name = document.createElement("h5");
    name.className = "card-title";

    const nameLink = document.createElement("a");
    nameLink.setAttribute("href", `hero-details.html?id=${superhero.id}`);
    nameLink.textContent = superhero.name;

    name.appendChild(nameLink);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-primary";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromFavorites(superhero));

    cardBody.appendChild(name);
    cardBody.appendChild(removeBtn);

    card.appendChild(image);
    card.appendChild(cardBody);

    col.appendChild(card);
    favoritesList.appendChild(col);
  });
}

function removeFromFavorites(superhero) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter(
    (favSuperhero) => favSuperhero.name !== superhero.name
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  loadFavorites();
}
