export class TypePill {
  constructor(type) {
    this.type = type;
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
    const pill = document.createElement("span");
    pill.classList.add("type-pill");
    pill.style.backgroundColor = this.getTypeColor(this.type.toLowerCase());
    pill.textContent = this.type[0].toUpperCase() + this.type.slice(1);
    return pill;
  }
}
