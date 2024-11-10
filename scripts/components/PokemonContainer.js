import { PokemonCard } from "./PokemonCard.js";
import { Pagination } from "./Pagination.js";
import { SearchInput } from "./SearchInput.js";

export class PokemonContainer {
  constructor() {
    this.container = document.querySelector(".pokemon-container");
    this.pokemonCards = [];
    this.ITEMS_PER_PAGE = 24;
    this.totalPokemon = 0;
    this.currentSearch = "";

    // Initialize search
    this.searchInput = new SearchInput(
      document.querySelector(".search-container"),
      (search) => this.handleSearch(search)
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

  async handleSearch(search) {
    this.currentSearch = search;
    if (search === "") {
      // If search is cleared, reset to normal pagination
      this.pagination.setTotalItems(this.totalPokemon);
      await this.fetchCurrentPage(1);
      return;
    }

    try {
      // Fetch all Pokemon names that match the search
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${this.totalPokemon}`
      );
      const data = await response.json();

      // Filter Pokemon that start with the search term
      const filteredPokemon = data.results.filter((pokemon) =>
        pokemon.name.startsWith(search)
      );

      // Update pagination with new total
      this.pagination.setTotalItems(filteredPokemon.length);

      if (filteredPokemon.length === 0) {
        this.container.innerHTML =
          '<div class="error">No Pokemon found matching your search.</div>';
        return;
      }

      // Fetch first page of filtered results
      const startIdx = 0;
      const endIdx = Math.min(this.ITEMS_PER_PAGE, filteredPokemon.length);
      const currentPagePokemon = filteredPokemon.slice(startIdx, endIdx);

      // Fetch detailed data for each Pokemon
      const promises = currentPagePokemon.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );

      this.container.innerHTML = '<div class="loading">Loading...</div>';
      const pokemonData = await Promise.all(promises);

      this.container.innerHTML = "";
      this.pokemonCards = [];
      pokemonData.forEach((pokemon) => this.createPokemonCard(pokemon));
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      this.container.innerHTML =
        '<div class="error">Error searching Pokemon. Please try again.</div>';
    }
  }

  async fetchCurrentPage(page) {
    if (this.currentSearch) {
      // If there's an active search, fetch filtered results
      await this.handleSearch(this.currentSearch);
      return;
    }

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
}
