import { PokemonCard } from "./PokemonCard.js";
import { PokemonDialog } from "./PokemonDialog.js";

export class PokemonContainer {
  constructor() {
    this.container = document.querySelector(".pokemon-container");
    this.pokemonCards = [];
    this.dialog = new PokemonDialog();
  }

  // Show loading state
  showLoading() {
    this.container.innerHTML = '<div class="loading">Loading...</div>';
  }

  // Show error state
  showError(message = "Error loading Pokemon. Please try again.") {
    this.container.innerHTML = `<div class="error">${message}</div>`;
  }

  // Clear and display new Pokemon data
  displayPokemon(pokemonData) {
    this.container.innerHTML = "";
    this.pokemonCards = [];
    pokemonData.forEach((pokemon) => this.createPokemonCard(pokemon));
  }

  createPokemonCard(pokemon) {
    const card = new PokemonCard(pokemon, (clickedPokemon) => {
      this.dialog.show(clickedPokemon);
    });
    this.pokemonCards.push(card);
    this.container.appendChild(card.element);
  }
}
