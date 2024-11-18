export class Pagination {
  constructor(container, options) {
    this.container = container;
    this.currentPage = 1;
    this.totalItems = options.totalItems || 0;
    this.itemsPerPage = options.itemsPerPage || 24;
    this.onPageChange = options.onPageChange;

    this.createElement();
    this.updateControls();
  }

  setCurrentPage(page) {
    this.currentPage = page;
    this.updateControls();
  }

  createElement() {
    const controls = document.createElement("div");
    controls.classList.add("pagination-controls");
    controls.innerHTML = `
            <button class="prev-btn" aria-label="Previous page">←</button>
            <span class="page-info">Page <span class="current-page">1</span></span>
            <button class="next-btn" aria-label="Next page">→</button>
        `;

    this.prevBtn = controls.querySelector(".prev-btn");
    this.nextBtn = controls.querySelector(".next-btn");
    this.pageInfo = controls.querySelector(".current-page");

    this.prevBtn.addEventListener("click", () => this.changePage("prev"));
    this.nextBtn.addEventListener("click", () => this.changePage("next"));

    this.container.appendChild(controls);
  }

  updateControls() {
    this.pageInfo.textContent = this.currentPage;
    this.prevBtn.disabled = this.currentPage === 1;
    this.nextBtn.disabled =
      this.currentPage >= Math.ceil(this.totalItems / this.itemsPerPage);
  }

  setTotalItems(total) {
    this.totalItems = total;
    this.currentPage = 1;
    this.updateControls();
  }

  async changePage(direction) {
    const oldPage = this.currentPage;
    if (direction === "prev" && this.currentPage > 1) {
      this.currentPage--;
    } else if (
      direction === "next" &&
      this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage)
    ) {
      this.currentPage++;
    }

    if (oldPage !== this.currentPage && this.onPageChange) {
      await this.onPageChange(this.currentPage);
    }
  }
}
