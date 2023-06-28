//This JavaScript file is linked to the index.html file. 
//It contains the logic for handling user interactions and making API requests to retrieve superhero data. 
//includes functions for generating a hash for API authentication, searching superheroes, displaying search results, 
//checking if a superhero is in the favorites list, toggling favorites, and displaying the favorites list.


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

// generates nd MD5 hash using CryptoJS library. This hash is used for API authentication
function generateHash(timestamp, privateKey, publicKey) {
  const input = timestamp + privateKey + publicKey;
  const hash = CryptoJS.MD5(input).toString();
  return hash;
}

// uses the fetch API to make the API request using the constructed URL. returns a Promise that resolves to the JSON response.
function searchSuperhero() {
  //retrieves search term from input given by user
  const searchTerm = searchInput.value.trim();

  //If the search term is empty, the function returns early and does nothing
  if (searchTerm === "") return;

  const timestamp = new Date().getTime();
  const hash = generateHash(timestamp, PRIVATE_KEY, PUBLIC_KEY);

  // constructs the API URL
  const url = `${API_URL}?nameStartsWith=${searchTerm}&apikey=${PUBLIC_KEY}&ts=${timestamp}&hash=${hash}`;

  // performs an API request using the fetch() function
  fetch(url)
    //got response in JSON format
    .then((response) => response.json())
    .then((data) => {
      //API response is passed to displayResults()
      displayResults(data.data.results);
    })
    //if Response is not successfull, we throw error
    .catch((error) => console.log(error));
}

//takes an array of superhero data as a parameter & dynamically generates HTML elements to display the search results
//For each superhero, it creates a card containing an image,  name as a link & button to add/remove the superhero
function displayResults(superheroes) {
  
  //clears the existing content of the resultsDiv
  resultsDiv.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row";

  //iterates over each superhero in the array
  superheroes.forEach((dataItem) => {
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
      dataItem.thumbnail?.path +
        "/standard_medium." +
        dataItem.thumbnail?.extension
    );
    image.setAttribute("alt", dataItem.name);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const name = document.createElement("h5");
    name.className = "card-title";

    //set superhero name as link to hero-details.hml page
    const nameLink = document.createElement("a");
    nameLink.textContent = dataItem.name;
    nameLink.href = `html/hero-details.html?id=${dataItem.id}`;
    name.appendChild(nameLink);

    //set evenListeners to add button to call isSuperheroInFavorites()
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

  //all the generated elements are appended to resultsDiv
  resultsDiv.appendChild(row);
}


// takes a superhero object as a parameter and checks if the superhero is already present in the favorites list
function isSuperheroInFavorites(superhero) {
  //retrieves favorites list from browser's local storage & parses it from JSON string to JSON object using JSON.parse()
  //If the value is null (i.e., the key is not found), an empty array is assigned as the value of favorites using the logical OR operator ||.
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  //uses the Array.some() method to iterate over list and checks if any superhero in the list has the same name as the given superhero
  //If a match is found, the function returns true, indicating that the superhero is already in the favorites list.
  return favorites.some((favSuperhero) => favSuperhero.name === superhero.name);
}

//toggles the status of a superhero in the favorites list stored in the local storage
//responsible for managing the addition or removal of a superhero from the favorites list
//takes the superhero object and the button element associated with that superhero as parameters.
function toggleFavorites(superhero, button) {

  //retrieves favorites list from browser's local storage & parses it from JSON string to JSON object using JSON.parse()
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
  //checks it this superhero name is already present in favorites list and return boolean value depending on the result 
  const isDuplicate = favorites.some(
    (favSuperhero) => favSuperhero.name === superhero.name
  );

  //if superhero is already present, it is removed from the list by filetering the list
  if (isDuplicate) {
    //create new updated favorite list after removing the superhero
    const updatedFavorites = favorites.filter(
      (favSuperhero) => favSuperhero.name !== superhero.name
    );

    //updated list is stored back in local storage using setItem() as JSON String
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    //button text changed to "Add to Favorites" as superhoro is not in list
    button.textContent = "Add to Favorites";
  } 
  
  //if superhero is not present in the list, it is added by pushing into superhero object
  else {
    favorites.push(superhero);

    //again the updated favorite list is stored in local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    //button text changed to "Remove from Favorites" as superhoro is present in list
    button.textContent = "Remove from Favorites";
  }
}

//retrieves the favorites list from the local storage & display the favorite superhero
function displayFavorites() {
  
  //retrieves favorites list from local storage and parses into JSON object
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  //clears the existing content of favouritesList element
  favoritesList.innerHTML = "";

  //iterates over each superhero in the list
  favorites.forEach((favorite) => {
    
    //creates a list item for each superhero
    const li = document.createElement("li");
    li.textContent = favorite.name;

    //appends to favoritesList element
    favoritesList.appendChild(li);
  });
}

// Finally, the displayFavorites() function is called to display the favorites list when the page loads.
displayFavorites();
