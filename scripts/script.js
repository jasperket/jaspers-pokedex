const pokemonContainer = document.querySelector(".pokemon-container");
const searchInput = document.querySelector("input");
const POKEMON_COUNT = 151; // First generation Pokemon

// Fetch all Pokemon data
async function fetchPokemons() {
  for (let i = 1; i <= POKEMON_COUNT; i++) {
    await getPokemon(i);
  }
}

// Fetch individual Pokemon data
async function getPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(url);
  const pokemon = await response.json();
  createPokemonCard(pokemon);
}

// Create Pokemon card
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("pokemon-card");

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");
  const types = pokemon.types.map((type) => type.type.name);

  card.innerHTML = `
        <div class="img-container">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              pokemon.id
            }.png" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: <span>${types.join(", ")}</span></small>
        </div>
    `;

  pokemonContainer.appendChild(card);
}

// Search functionality
searchInput.addEventListener("input", function (e) {
  const search = e.target.value.toLowerCase();
  const pokemonCards = document.querySelectorAll(".pokemon-card");

  pokemonCards.forEach((card) => {
    const name = card.querySelector(".name").textContent.toLowerCase();
    if (name.includes(search)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// Initialize
fetchPokemons();
