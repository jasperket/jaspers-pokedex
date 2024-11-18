export class TypePill {
  constructor(type) {
    this.type = type;
    this.element = this.createElement();
  }

  createElement() {
    const pill = document.createElement("span");
    pill.classList.add("type-pill", this.type.toLowerCase());
    pill.textContent = this.type[0].toUpperCase() + this.type.slice(1);
    return pill;
  }
}
