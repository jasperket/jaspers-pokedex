export class PokemonCard {
  constructor(pokemon) {
    this.pokemon = pokemon;
    this.element = this.createElement();
  }

  getTypeColor(type) {
    const colors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return colors[type] || "#888888";
  }

  createElement() {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const name =
      this.pokemon.name[0].toUpperCase() + this.pokemon.name.slice(1);
    const id = this.pokemon.id.toString().padStart(3, "0");
    const types = this.pokemon.types.map((type) => ({
      name: type.type.name[0].toUpperCase() + type.type.name.slice(1),
      color: this.getTypeColor(type.type.name),
    }));

    const typeHtml = types
      .map(
        (type) =>
          `<span class="type-pill" style="background-color: ${type.color}">${type.name}</span>`
      )
      .join("");

    card.innerHTML = `
            <div class="img-container">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon.id}.png" alt="${name}">
            </div>
            <div class="info">
                <span class="number">#${id}</span>
                <h3 class="name">${name}</h3>
                <div class="types">${typeHtml}</div>
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
