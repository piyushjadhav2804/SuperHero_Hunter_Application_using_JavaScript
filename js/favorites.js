//This JavaScript file is linked to the favorites.html file. 
//It contains the logic for loading and displaying the favorite superheroes from local storage. 
//It also includes a function for removing a superhero from the favorites list.

// Constants
const PUBLIC_KEY = "c5c797efc4cf200741ba7a553fc506cc";
const PRIVATE_KEY = "05d4e28fa0d2154fa06ea1ffab90b4f51f1c2be1";
const API_URL = "https://gateway.marvel.com/v1/public/characters";

// DOM Elements
const favoritesList = document.getElementById("favoritesList");

// This event listener is triggered when the DOM content of the page is loaded. 
document.addEventListener("DOMContentLoaded", () => {

  // It calls the loadFavorites() function to load and display the favorite superheroes.
  loadFavorites();
});

function loadFavorites() {
  //retrieves favorites list from browser's local storage & parses it from JSON string to JSON object using JSON.parse()
  //If the value is null (i.e., the key is not found), an empty array is assigned as the value of favorites using the logical OR operator ||.
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  //clears the existing content of favouritesList element
  favoritesList.innerHTML = "";

  //iterates over each superhero in the list
  //For each superhero, it creates a card containing an image, name as a link & button to remove the superhero
  favorites.forEach((superhero) => {
    //creates HTML elements dynamically to display information

    const col = document.createElement("div");
    col.className = "col-4";

    const card = document.createElement("div");
    card.className = "card";

    //set thumbnail image
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

    //set superhero name as link to hero-details.hml page
    const nameLink = document.createElement("a");
    nameLink.setAttribute("href", `hero-details.html?id=${superhero.id}`);
    nameLink.textContent = superhero.name;

    name.appendChild(nameLink);

    //set evenListeners to add button to call removeFromFavorites()
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-primary";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromFavorites(superhero));

    cardBody.appendChild(name);
    cardBody.appendChild(removeBtn);

    card.appendChild(image);
    card.appendChild(cardBody);

    col.appendChild(card);

    //all the generated elements are appended to FavoritesList div
    favoritesList.appendChild(col);
  });
}

// responsible for removing a superhero from the favorites list when the remove button is clicked.
function removeFromFavorites(superhero) {
  //favorites list is retrieved from local storage as Json Onject
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // if superhero is present, it is removed from list using Filter()
  const updatedFavorites = favorites.filter(
    (favSuperhero) => favSuperhero.name !== superhero.name
  );

  //new list is stored in local storage after superhero is removed
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  // reload and display the updated favorites list after removing the superhero.
  loadFavorites();
}
