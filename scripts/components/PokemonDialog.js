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

  async show(pokemon) {
    this.showLoading();

    try {
      // Fetch additional Pokemon species data for description
      const speciesResponse = await fetch(pokemon.species.url);
      const speciesData = await speciesResponse.json();

      // Get English flavor text
      const description =
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "en")
          ?.flavor_text.replace(/\f/g, " ") || "No description available.";

      this.dialog.innerHTML = `
        <div class="dialog-content">
          <div class="dialog-header">
            <h2>${
              pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            }</h2>
            <span class="number">#${pokemon.id
              .toString()
              .padStart(3, "0")}</span>
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
        </div>
      `;

      // Reattach event listener to close button
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
