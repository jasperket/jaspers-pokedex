import { PokemonCard } from "./PokemonCard.js";
import { Pagination } from "./Pagination.js";
import { SearchInput } from "./SearchInput.js";

export class PokemonContainer {
  constructor() {
    this.container = document.querySelector(".pokemon-container");
    this.pokemonCards = [];
    this.ITEMS_PER_PAGE = 24;
    this.totalPokemon = 0;

    // Initialize search
    this.searchInput = new SearchInput(
      document.querySelector(".search-container"),
      (search) => this.filterPokemon(search)
    );
    document
      .querySelector(".search-container")
      .insertBefore(
        this.searchInput.element,
        document.querySelector(".pagination-controls")
      );

    // Initialize pagination
    this.pagination = new Pagination(
      document.querySelector(".search-container"),
      {
        itemsPerPage: this.ITEMS_PER_PAGE,
        onPageChange: (page) => this.fetchCurrentPage(page),
      }
    );

    this.initialize();
  }

  async initialize() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon-species?limit=1"
      );
      const data = await response.json();
      this.totalPokemon = data.count;
      this.pagination.setTotalItems(this.totalPokemon);
      await this.fetchCurrentPage(1);
    } catch (error) {
      console.error("Error initializing:", error);
      this.container.innerHTML =
        '<div class="error">Error loading Pokemon. Please try again.</div>';
    }
  }

  async fetchCurrentPage(page) {
    this.container.innerHTML = '<div class="loading">Loading...</div>';
    const startIdx = (page - 1) * this.ITEMS_PER_PAGE + 1;
    const endIdx = Math.min(
      startIdx + this.ITEMS_PER_PAGE - 1,
      this.totalPokemon
    );

    const promises = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      promises.push(fetch(url).then((res) => res.json()));
    }

    try {
      const pokemonData = await Promise.all(promises);
      this.container.innerHTML = "";
      this.pokemonCards = [];
      pokemonData.forEach((pokemon) => this.createPokemonCard(pokemon));
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      this.container.innerHTML =
        '<div class="error">Error loading Pokemon. Please try again.</div>';
    }
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
