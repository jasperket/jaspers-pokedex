export class PokemonDialog {
  constructor() {
    this.dialog = this.createElement();
    document.body.appendChild(this.dialog);
  }

  createElement() {
    const dialog = document.createElement("dialog");
    dialog.classList.add("pokemon-dialog");
    return dialog;
  }

  showLoading() {
    this.dialog.innerHTML = `
      <div class="dialog-content loading-content">
        <div class="spinner"></div>
        <p>Loading Pokemon details...</p>
      </div>
    `;
    this.dialog.showModal();
  }

  calculateWeaknesses(types) {
    const typeChart = {
      normal: { weaknesses: ["fighting"], immunities: ["ghost"] },
      fire: { weaknesses: ["water", "ground", "rock"] },
      water: { weaknesses: ["electric", "grass"] },
      electric: { weaknesses: ["ground"] },
      grass: { weaknesses: ["fire", "ice", "poison", "flying", "bug"] },
      ice: { weaknesses: ["fire", "fighting", "rock", "steel"] },
      fighting: { weaknesses: ["flying", "psychic", "fairy"] },
      poison: { weaknesses: ["ground", "psychic"] },
      ground: {
        weaknesses: ["water", "grass", "ice"],
        immunities: ["electric"],
      },
      flying: {
        weaknesses: ["electric", "ice", "rock"],
        immunities: ["ground"],
      },
      psychic: { weaknesses: ["bug", "ghost", "dark"] },
      bug: { weaknesses: ["fire", "flying", "rock"] },
      rock: { weaknesses: ["water", "grass", "fighting", "ground", "steel"] },
      ghost: {
        weaknesses: ["ghost", "dark"],
        immunities: ["normal", "fighting"],
      },
      dragon: { weaknesses: ["ice", "dragon", "fairy"] },
      dark: {
        weaknesses: ["fighting", "bug", "fairy"],
        immunities: ["psychic"],
      },
      steel: { weaknesses: ["fire", "fighting", "ground"] },
      fairy: { weaknesses: ["poison", "steel"], immunities: ["dragon"] },
    };

    let weaknesses = new Set();
    let immunities = new Set();

    types.forEach((type) => {
      const typeData = typeChart[type.type.name];
      if (typeData) {
        typeData.weaknesses?.forEach((w) => weaknesses.add(w));
        typeData.immunities?.forEach((i) => immunities.add(i));
      }
    });

    immunities.forEach((immunity) => weaknesses.delete(immunity));

    return Array.from(weaknesses);
  }

  getTypeGradient(types) {
    if (types.length === 1) {
      return `var(--type-${types[0].type.name})`;
    }
    return `linear-gradient(135deg, var(--type-${types[0].type.name}) 0%, var(--type-${types[1].type.name}) 100%)`;
  }

  async show(pokemon) {
    this.showLoading();

    try {
      const speciesResponse = await fetch(pokemon.species.url);
      const speciesData = await speciesResponse.json();

      const description =
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace(/\f/g, " ") || "No description available.";

      const weaknesses = this.calculateWeaknesses(pokemon.types);

      const dialogContent = document.createElement("div");
      dialogContent.classList.add("dialog-content");
      dialogContent.style.background = this.getTypeGradient(pokemon.types);

      dialogContent.innerHTML = `
        <div class="dialog-header">
          <h2>${
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          }</h2>
          <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
          <button class="dialog-close">×</button>
        </div>
        
        <div class="dialog-body">
          <div class="dialog-image">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              pokemon.id
            }.png" 
                 alt="${pokemon.name}">
          </div>
          
          <div class="pokemon-info">
            <p class="description">${description}</p>
            
            <div class="types-section">
              <h3>Types</h3>
              <div class="types-dialog">
                ${pokemon.types
                  .map(
                    (type) => `
                  <span class="type-pill ${type.type.name}">${
                      type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)
                    }</span>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="weaknesses">
              <h3>Weaknesses</h3>
              <div class="types-dialog">
                ${weaknesses
                  .map(
                    (type) => `
                  <span class="type-pill ${type}">${
                      type.charAt(0).toUpperCase() + type.slice(1)
                    }</span>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="stats">
              <h3>Base Stats</h3>
              ${pokemon.stats
                .map(
                  (stat) => `
                <div class="stat-row">
                  <span class="stat-name">${stat.stat.name.replace(
                    "-",
                    " "
                  )}:</span>
                  <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${
                      (stat.base_stat / 255) * 100
                    }%;">
                      <span class="stat-value">${stat.base_stat}</span>
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
            
            <div class="pokemon-details">
              <div class="detail">
                <span class="label">Height:</span>
                <span class="value">${pokemon.height / 10}m</span>
              </div>
              <div class="detail">
                <span class="label">Weight:</span>
                <span class="value">${pokemon.weight / 10}kg</span>
              </div>
            </div>
          </div>
        </div>
      `;

      this.dialog.innerHTML = "";
      this.dialog.appendChild(dialogContent);

      const closeBtn = this.dialog.querySelector(".dialog-close");
      closeBtn.addEventListener("click", () => this.close());
    } catch (error) {
      this.dialog.innerHTML = `
        <div class="dialog-content">
          <div class="dialog-header">
            <h2>Error</h2>
            <button class="dialog-close">×</button>
          </div>
          <div class="dialog-body">
            <p class="error">Failed to load Pokemon details. Please try again.</p>
          </div>
        </div>
      `;

      const closeBtn = this.dialog.querySelector(".dialog-close");
      closeBtn.addEventListener("click", () => this.close());
    }
  }

  close() {
    this.dialog.close();
  }
}
