import { PokemonContainer } from "./components/PokemonContainer.js";
import { SearchInput } from "./components/SearchInput.js";

// Initialize components
const pokedex = new PokemonContainer();
const searchInput = new SearchInput(
  document.querySelector(".search-container"),
  (search) => pokedex.handleSearch(search)
);

// Insert search input before pagination controls
document
  .querySelector(".search-container")
  .insertBefore(
    searchInput.element,
    document.querySelector(".pagination-controls")
  );
