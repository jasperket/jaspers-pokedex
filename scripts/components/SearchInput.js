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
    this.element.addEventListener("input", (e) => {
      const search = e.target.value.toLowerCase();
      if (this.onSearch) {
        this.onSearch(search);
      }
    });
  }
}
