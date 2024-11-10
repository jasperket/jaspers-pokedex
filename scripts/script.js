class PokemonCard {
  constructor(pokemon) {
    this.pokemon = pokemon;
    this.element = this.createElement();
  }

  createElement() {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const name =
      this.pokemon.name[0].toUpperCase() + this.pokemon.name.slice(1);
    const id = this.pokemon.id.toString().padStart(3, "0");
    const types = this.pokemon.types.map((type) => type.type.name);

    card.innerHTML = `
            <div class="img-container">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  this.pokemon.id
                }.png" alt="${name}">
            </div>
            <div class="info">
                <span class="number">#${id}</span>
                <h3 class="name">${name}</h3>
                <small class="type">Type: <span>${types.join(
                  ", "
                )}</span></small>
            </div>
        `;

    return card;
  }

  show() {
    this.element.style.display = "block";
  }

  hide() {
    this.element.style.display = "none";
  }
}

class PokemonContainer {
  constructor() {
    this.container = document.querySelector(".pokemon-container");
    this.searchInput = document.querySelector("input");
    this.pokemonCards = [];
    this.POKEMON_COUNT = 151;

    this.initialize();
  }

  async initialize() {
    this.setupSearchListener();
    await this.fetchPokemons();
  }

  setupSearchListener() {
    this.searchInput.addEventListener("input", (e) => {
      const search = e.target.value.toLowerCase();
      this.filterPokemon(search);
    });
  }

  async fetchPokemons() {
    for (let i = 1; i <= this.POKEMON_COUNT; i++) {
      await this.getPokemon(i);
    }
  }

  async getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const pokemon = await response.json();
    this.createPokemonCard(pokemon);
  }

  createPokemonCard(pokemon) {
    const card = new PokemonCard(pokemon);
    this.pokemonCards.push(card);
    this.container.appendChild(card.element);
  }

  filterPokemon(search) {
    this.pokemonCards.forEach((card) => {
      const name = card.element
        .querySelector(".name")
        .textContent.toLowerCase();
      if (name.includes(search)) {
        card.show();
      } else {
        card.hide();
      }
    });
  }
}

// Initialize the app
const pokedex = new PokemonContainer();
