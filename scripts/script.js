import { PokemonContainer } from "./components/PokemonContainer.js";
import { SearchInput } from "./components/SearchInput.js";
import { Pagination } from "./components/Pagination.js";

class PokedexApp {
  constructor() {
    this.ITEMS_PER_PAGE = 24;
    this.totalPokemon = 0;
    this.currentSearch = "";

    // Initialize components
    this.pokedex = new PokemonContainer();
    this.searchInput = new SearchInput(
      document.querySelector(".search-container"),
      (search) => this.handleSearch(search)
    );

    // Initialize both paginations
    const paginationOptions = {
      itemsPerPage: this.ITEMS_PER_PAGE,
      onPageChange: (page) => {
        // Update both paginations when either one changes
        this.topPagination.setCurrentPage(page);
        this.bottomPagination.setCurrentPage(page);
        this.fetchCurrentPage(page);
      },
    };

    this.topPagination = new Pagination(
      document.querySelector(".search-container"),
      paginationOptions
    );

    this.bottomPagination = new Pagination(
      document.querySelector(".pagination-footer"),
      paginationOptions
    );

    // Insert search input before pagination controls
    document
      .querySelector(".search-container")
      .insertBefore(
        this.searchInput.element,
        document.querySelector(".pagination-controls")
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
      this.topPagination.setTotalItems(this.totalPokemon);
      this.bottomPagination.setTotalItems(this.totalPokemon);
      await this.fetchCurrentPage(1);
    } catch (error) {
      console.error("Error initializing:", error);
      this.pokedex.showError();
    }
  }

  async handleSearch(search) {
    this.currentSearch = search;
    if (search === "") {
      // If search is cleared, reset to normal pagination
      this.topPagination.setTotalItems(this.totalPokemon);
      this.bottomPagination.setTotalItems(this.totalPokemon);
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

      // Update both paginations with new total
      this.topPagination.setTotalItems(filteredPokemon.length);
      this.bottomPagination.setTotalItems(filteredPokemon.length);

      if (filteredPokemon.length === 0) {
        this.pokedex.showError("No Pokemon found matching your search.");
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

      this.pokedex.showLoading();
      const pokemonData = await Promise.all(promises);
      this.pokedex.displayPokemon(pokemonData);
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      this.pokedex.showError("Error searching Pokemon. Please try again.");
    }
  }

  async fetchCurrentPage(page) {
    if (this.currentSearch) {
      // If there's an active search, fetch filtered results
      await this.handleSearch(this.currentSearch);
      return;
    }

    this.pokedex.showLoading();
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
      this.pokedex.displayPokemon(pokemonData);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      this.pokedex.showError();
    }
  }
}

// Initialize the app
new PokedexApp();
