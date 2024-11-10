import { debounce } from "../utils/debounce.js";

export class SearchInput {
  constructor(container, onSearch) {
    this.container = container;
    this.onSearch = onSearch;
    this.element = this.createElement();
    this.setupListener();
  }

  createElement() {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search for a Pokemon";
    return input;
  }

  setupListener() {
    const debouncedSearch = debounce((search) => {
      if (this.onSearch) {
        this.onSearch(search);
      }
    }, 300);

    this.element.addEventListener("input", (e) => {
      const search = e.target.value.toLowerCase();
      debouncedSearch(search);
    });
  }

  clear() {
    this.element.value = "";
  }
}
