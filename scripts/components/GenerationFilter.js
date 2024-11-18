export class GenerationFilter {
  constructor(onGenerationChange) {
    this.onGenerationChange = onGenerationChange;
    this.currentGeneration = null;

    // Generation ranges (National Pokedex numbers)
    this.generations = {
      1: { start: 1, end: 151, name: "Gen I" },
      2: { start: 152, end: 251, name: "Gen II" },
      3: { start: 252, end: 386, name: "Gen III" },
      4: { start: 387, end: 493, name: "Gen IV" },
      5: { start: 494, end: 649, name: "Gen V" },
      6: { start: 650, end: 721, name: "Gen VI" },
      7: { start: 722, end: 809, name: "Gen VII" },
      8: { start: 810, end: 905, name: "Gen VIII" },
      9: { start: 906, end: 1010, name: "Gen IX" },
    };

    // Create the element after initializing generations
    this.element = this.createElement();
  }

  createElement() {
    const container = document.createElement("div");
    container.classList.add("generation-filter");

    const select = document.createElement("select");
    select.setAttribute("aria-label", "Filter by generation");

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Generations";
    select.appendChild(defaultOption);

    Object.entries(this.generations).forEach(([gen, data]) => {
      const option = document.createElement("option");
      option.value = gen;
      option.textContent = data.name;
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      const generation = e.target.value ? parseInt(e.target.value) : null;
      this.currentGeneration = generation;
      if (this.onGenerationChange) {
        this.onGenerationChange(
          generation ? this.generations[generation] : null
        );
      }
    });

    container.appendChild(select);
    return container;
  }

  reset() {
    this.currentGeneration = null;
    this.element.querySelector("select").value = "";
  }

  getCurrentGeneration() {
    return this.currentGeneration
      ? this.generations[this.currentGeneration]
      : null;
  }
}
