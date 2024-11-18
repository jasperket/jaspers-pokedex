import { TypePill } from "./TypePill.js";

export class TypeFilter {
  constructor(type, onToggle) {
    this.type = type;
    this.onToggle = onToggle;
    this.isSelected = false;
    this.element = this.createElement();
  }

  createElement() {
    const button = document.createElement("button");
    button.classList.add("type-filter");
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("role", "switch");
    button.setAttribute("aria-label", `Filter by ${this.type} type`);

    const typePill = new TypePill(this.type);
    button.appendChild(typePill.element);

    button.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle();
    });

    return button;
  }

  toggle() {
    this.isSelected = !this.isSelected;
    this.element.classList.toggle("selected", this.isSelected);
    this.element.setAttribute("aria-pressed", this.isSelected.toString());
    if (this.onToggle) {
      this.onToggle(this.type, this.isSelected);
    }
  }

  reset() {
    this.isSelected = false;
    this.element.classList.remove("selected");
    this.element.setAttribute("aria-pressed", "false");
  }
}
