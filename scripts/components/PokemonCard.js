export class PokemonCard {
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
