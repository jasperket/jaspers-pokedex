import { TypeFilter } from "./TypeFilter.js";

export class TypeFilters {
  constructor(container, onFiltersChange) {
    this.container = container;
    this.onFiltersChange = onFiltersChange;
    this.activeFilters = new Set();
    this.filters = [];

    this.types = [
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
    ];

    this.createElement();
    this.initializeFromURL();
  }

  createElement() {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Pokemon type filters");
    nav.classList.add("type-filters");

    this.types.forEach((type) => {
      const filter = new TypeFilter(type, (type, isSelected) => {
        if (isSelected) {
          this.activeFilters.add(type);
        } else {
          this.activeFilters.delete(type);
        }

        this.updateURL();

        if (this.onFiltersChange) {
          this.onFiltersChange(Array.from(this.activeFilters));
        }
      });

      this.filters.push(filter);
      nav.appendChild(filter.element);
    });

    this.container.appendChild(nav);
  }

  initializeFromURL() {
    const params = new URLSearchParams(window.location.search);
    const types = params.get("types");

    if (types) {
      const activeTypes = types.split(",");
      activeTypes.forEach((type) => {
        const filter = this.filters.find((f) => f.type === type);
        if (filter) {
          filter.toggle();
        }
      });
    }
  }

  updateURL() {
    const params = new URLSearchParams(window.location.search);

    if (this.activeFilters.size > 0) {
      params.set("types", Array.from(this.activeFilters).join(","));
    } else {
      params.delete("types");
    }

    // Update URL without reloading the page
    const newURL = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    window.history.pushState({}, "", newURL);
  }

  reset() {
    this.activeFilters.clear();
    this.filters.forEach((filter) => filter.reset());
    this.updateURL();
  }
}
