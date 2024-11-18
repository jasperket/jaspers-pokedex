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
    const currentPage = this.topPagination.currentPage;

    // Show loading state immediately when search changes
    this.pokedex.showLoading();

    const generation = this.generationFilter.getCurrentGeneration();
    if (generation) {
      // If a generation is selected, call handleGenerationFilter instead
      await this.handleGenerationFilter(generation);
      return;
    }

    if (search === "" && this.typeFilters.activeFilters.size === 0) {
      // If search is cleared and no type filters, reset to normal pagination
      this.topPagination.setTotalItems(this.totalPokemon);
      this.bottomPagination.setTotalItems(this.totalPokemon);
      await this.fetchCurrentPage(currentPage);
      return;
    }

    try {
      // Fetch all Pokemon names that match the search
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${this.totalPokemon}`
      );
      const data = await response.json();

      // Filter Pokemon that start with the search term
      let filteredPokemon = data.results.filter((pokemon) =>
        pokemon.name.startsWith(search)
      );

      // Fetch detailed data for filtered Pokemon
      const detailedPokemon = await Promise.all(
        filteredPokemon.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      // Apply type filters if any are active
      if (this.typeFilters.activeFilters.size > 0) {
        filteredPokemon = detailedPokemon.filter((pokemon) =>
          Array.from(this.typeFilters.activeFilters).every((type) =>
            pokemon.types.some((t) => t.type.name === type)
          )
        );
      } else {
        filteredPokemon = detailedPokemon;
      }

      // Update pagination with filtered results WITHOUT resetting to page 1
      const totalItems = filteredPokemon.length;
      const maxPage = Math.ceil(totalItems / this.ITEMS_PER_PAGE);
      const targetPage = Math.min(currentPage, maxPage); // Ensure we don't exceed max pages

      this.topPagination.totalItems = totalItems; // Set total items directly
      this.bottomPagination.totalItems = totalItems;
      this.topPagination.updateControls(); // Update controls without changing page
      this.bottomPagination.updateControls();

      if (filteredPokemon.length === 0) {
        this.pokedex.showError("No Pokemon found matching your criteria.");
        return;
      }

      // Display current page of filtered results
      const startIdx = (targetPage - 1) * this.ITEMS_PER_PAGE;
      const endIdx = startIdx + this.ITEMS_PER_PAGE;
      const currentPagePokemon = filteredPokemon.slice(startIdx, endIdx);
      this.pokedex.displayPokemon(currentPagePokemon);
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      this.pokedex.showError("Error searching Pokemon. Please try again.");
    }
  }

  async fetchCurrentPage(page) {
    if (this.currentSearch || this.typeFilters.activeFilters.size > 0) {
      // If there's an active search or type filters, fetch filtered results
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

  async handleTypeFilters(activeFilters) {
    const currentPage = this.topPagination.currentPage;

    // Show loading state immediately when filters change
    this.pokedex.showLoading();

    const generation = this.generationFilter.getCurrentGeneration();
    if (generation) {
      // If a generation is selected, call handleGenerationFilter instead
      await this.handleGenerationFilter(generation);
      return;
    }

    if (activeFilters.length === 0) {
      // If no filters are active, reset to normal view
      this.topPagination.setTotalItems(this.totalPokemon);
      this.bottomPagination.setTotalItems(this.totalPokemon);
      await this.fetchCurrentPage(currentPage);
      return;
    }

    try {
      // Fetch all Pokemon
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${this.totalPokemon}`
      );
      const data = await response.json();

      // Fetch detailed data for all Pokemon
      const allPokemonDetails = await Promise.all(
        data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      // Filter Pokemon by selected types
      const filteredPokemon = allPokemonDetails.filter((pokemon) =>
        activeFilters.every((type) =>
          pokemon.types.some((t) => t.type.name === type)
        )
      );

      // Update pagination with filtered results WITHOUT resetting to page 1
      const totalItems = filteredPokemon.length;
      const maxPage = Math.ceil(totalItems / this.ITEMS_PER_PAGE);
      const targetPage = Math.min(currentPage, maxPage);

      this.topPagination.totalItems = totalItems;
      this.bottomPagination.totalItems = totalItems;
      this.topPagination.updateControls();
      this.bottomPagination.updateControls();

      if (filteredPokemon.length === 0) {
        this.pokedex.showError("No Pokemon found with the selected type(s).");
        return;
      }

      // Display current page of filtered results
      const startIdx = (targetPage - 1) * this.ITEMS_PER_PAGE;
      const endIdx = startIdx + this.ITEMS_PER_PAGE;
      const currentPagePokemon = filteredPokemon.slice(startIdx, endIdx);

      this.pokedex.displayPokemon(currentPagePokemon);
    } catch (error) {
      console.error("Error filtering Pokemon:", error);
      this.pokedex.showError("Error filtering Pokemon. Please try again.");
    }
  }

  async handleGenerationFilter(generation) {
    const currentPage = this.topPagination.currentPage;
    this.pokedex.showLoading();

    if (!generation) {
      // If no generation selected, reset to normal view
      this.topPagination.setTotalItems(this.totalPokemon);
      this.bottomPagination.setTotalItems(this.totalPokemon);
      await this.fetchCurrentPage(currentPage);
      return;
    }

    try {
      // Fetch Pokemon for the selected generation
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${
          generation.end - generation.start + 1
        }&offset=${generation.start - 1}`
      );
      const data = await response.json();

      // Apply existing search filter if any
      let filteredPokemon = data.results;
      if (this.currentSearch) {
        filteredPokemon = filteredPokemon.filter((pokemon) =>
          pokemon.name.startsWith(this.currentSearch)
        );
      }

      // Fetch detailed data for filtered Pokemon
      const detailedPokemon = await Promise.all(
        filteredPokemon.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      // Apply type filters if any are active
      if (this.typeFilters.activeFilters.size > 0) {
        filteredPokemon = detailedPokemon.filter((pokemon) =>
          Array.from(this.typeFilters.activeFilters).every((type) =>
            pokemon.types.some((t) => t.type.name === type)
          )
        );
      } else {
        filteredPokemon = detailedPokemon;
      }

      // Update pagination
      const totalItems = filteredPokemon.length;
      const maxPage = Math.ceil(totalItems / this.ITEMS_PER_PAGE);
      const targetPage = Math.min(currentPage, maxPage);

      this.topPagination.totalItems = totalItems;
      this.bottomPagination.totalItems = totalItems;
      this.topPagination.updateControls();
      this.bottomPagination.updateControls();

      if (filteredPokemon.length === 0) {
        this.pokedex.showError("No Pokemon found matching your criteria.");
        return;
      }

      // Display current page of filtered results
      const startIdx = (targetPage - 1) * this.ITEMS_PER_PAGE;
      const endIdx = startIdx + this.ITEMS_PER_PAGE;
      const currentPagePokemon = filteredPokemon.slice(startIdx, endIdx);
      this.pokedex.displayPokemon(currentPagePokemon);
    } catch (error) {
      console.error("Error filtering Pokemon by generation:", error);
      this.pokedex.showError("Error filtering Pokemon. Please try again.");
    }
  }
}

// Initialize the app
new PokedexApp();
