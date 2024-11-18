import { PokemonContainer } from "./components/PokemonContainer.js";
import { SearchInput } from "./components/SearchInput.js";
import { Pagination } from "./components/Pagination.js";
import { TypeFilters } from "./components/TypeFilters.js";
import { GenerationFilter } from "./components/GenerationFilter.js";

class PokedexApp {
  constructor() {
    this.ITEMS_PER_PAGE = 24;
    this.totalPokemon = 0;
    this.currentSearch = "";

    // Initialize components
    this.pokedex = new PokemonContainer();
    const searchContainer = document.querySelector(".search-container");

    // Initialize search input
    this.searchInput = new SearchInput(searchContainer, (search) =>
      this.handleSearch(search)
    );

    // Initialize filters first
    this.generationFilter = new GenerationFilter((generation) =>
      this.handleGenerationFilter(generation)
    );

    // Add components to the DOM in the correct order
    searchContainer.appendChild(this.searchInput.element);
    searchContainer.appendChild(this.generationFilter.element);

    // Initialize type filters after adding generation filter
    this.typeFilters = new TypeFilters(searchContainer, (activeFilters) =>
      this.handleTypeFilters(activeFilters)
    );

    // Initialize paginations
    const paginationOptions = {
      itemsPerPage: this.ITEMS_PER_PAGE,
      onPageChange: (page) => {
        this.topPagination.setCurrentPage(page);
        this.bottomPagination.setCurrentPage(page);
        this.fetchCurrentPage(page);
      },
    };

    this.topPagination = new Pagination(searchContainer, paginationOptions);
    this.bottomPagination = new Pagination(
      document.querySelector(".pagination-footer"),
      paginationOptions
    );

    // Add paginations to DOM
    searchContainer.appendChild(this.topPagination.element);
    document
      .querySelector(".pagination-footer")
      .appendChild(this.bottomPagination.element);

    window.addEventListener("popstate", () => {
      this.typeFilters.reset();
      this.typeFilters.initializeFromURL();
    });

    this.allPokemonData = [];

    this.initialize();
  }

  async initialize() {
    try {
      this.pokedex.showLoading();

      // Fetch basic Pokemon list first
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1010"
      );
      const data = await response.json();
      this.totalPokemon = data.count;

      // Fetch detailed data for all Pokemon
      this.allPokemonData = await Promise.all(
        data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      // Initialize pagination
      this.topPagination.setTotalItems(this.totalPokemon);
      this.bottomPagination.setTotalItems(this.totalPokemon);

      // Show first page
      await this.displayFilteredPokemon();
    } catch (error) {
      console.error("Error initializing:", error);
      this.pokedex.showError();
    }
  }

  async displayFilteredPokemon() {
    let filteredPokemon = [...this.allPokemonData];

    // Apply search filter
    if (this.currentSearch) {
      filteredPokemon = filteredPokemon.filter((pokemon) =>
        pokemon.name.startsWith(this.currentSearch)
      );
    }

    // Apply generation filter
    const generation = this.generationFilter.getCurrentGeneration();
    if (generation) {
      filteredPokemon = filteredPokemon.filter(
        (pokemon) =>
          pokemon.id >= generation.start && pokemon.id <= generation.end
      );
    }

    // Apply type filters
    if (this.typeFilters.activeFilters.size > 0) {
      filteredPokemon = filteredPokemon.filter((pokemon) =>
        Array.from(this.typeFilters.activeFilters).every((type) =>
          pokemon.types.some((t) => t.type.name === type)
        )
      );
    }

    // Update pagination
    const totalItems = filteredPokemon.length;
    const maxPage = Math.ceil(totalItems / this.ITEMS_PER_PAGE);
    const targetPage = Math.min(this.topPagination.currentPage, maxPage);

    this.topPagination.totalItems = totalItems;
    this.bottomPagination.totalItems = totalItems;
    this.topPagination.updateControls();
    this.bottomPagination.updateControls();

    if (filteredPokemon.length === 0) {
      this.pokedex.showError("No Pokemon found matching your criteria.");
      return;
    }

    // Display current page
    const startIdx = (targetPage - 1) * this.ITEMS_PER_PAGE;
    const endIdx = startIdx + this.ITEMS_PER_PAGE;
    const currentPagePokemon = filteredPokemon.slice(startIdx, endIdx);
    this.pokedex.displayPokemon(currentPagePokemon);
  }

  async handleSearch(search) {
    this.currentSearch = search;
    this.pokedex.showLoading();
    await this.displayFilteredPokemon();
  }

  async handleTypeFilters(activeFilters) {
    this.pokedex.showLoading();
    await this.displayFilteredPokemon();
  }

  async handleGenerationFilter(generation) {
    this.pokedex.showLoading();
    await this.displayFilteredPokemon();
  }

  async fetchCurrentPage(page) {
    this.pokedex.showLoading();
    await this.displayFilteredPokemon();
  }
}

// Initialize the app
new PokedexApp();
