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
    let timeout;
    this.element.addEventListener("input", (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const search = e.target.value.toLowerCase();
        if (this.onSearch) {
          this.onSearch(search);
        }
      }, 300);
    });
  }

  clear() {
    this.element.value = "";
  }
}
