import { TypePill } from "./TypePill.js";

export class PokemonCard {
  constructor(pokemon, onCardClick) {
    this.pokemon = pokemon;
    this.onCardClick = onCardClick;
    this.element = this.createElement();
  }

  getTypeGradient() {
    const types = this.pokemon.types;
    if (types.length === 1) {
      return `var(--type-${types[0].type.name})`;
    }
    return `linear-gradient(135deg, var(--type-${types[0].type.name}) 0%, var(--type-${types[1].type.name}) 100%)`;
  }

  createElement() {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // Add background color based on type
    card.style.background = this.getTypeGradient();

    card.addEventListener("click", () => {
      if (this.onCardClick) {
        this.onCardClick(this.pokemon);
      }
    });

    const name =
      this.pokemon.name[0].toUpperCase() + this.pokemon.name.slice(1);
    const id = this.pokemon.id.toString().padStart(3, "0");

    const typesContainer = document.createElement("div");
    typesContainer.classList.add("types");

    this.pokemon.types.forEach((type) => {
      const typePill = new TypePill(type.type.name);
      typesContainer.appendChild(typePill.element);
    });

    card.innerHTML = `
        <div class="img-container">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon.id}.png" alt="${name}">
        </div>
        <div class="info">
            <span class="number">#${id}</span>
            <h3 class="name">${name}</h3>
        </div>
    `;

    // Insert types container after the name
    card.querySelector(".info").appendChild(typesContainer);

    return card;
  }

  show() {
    this.element.style.display = "block";
  }

  hide() {
    this.element.style.display = "none";
  }
}
