/* DESTERRADO — catalog filters, sort & view */
(function () {
  const grid = document.getElementById("grid");
  if (!grid) return;

  const state = { availability: "all", price: "all", sort: "featured", view: "grid" };
  const products = Array.from(grid.querySelectorAll(".product"));

  function priceBand(price) {
    if (price < 200) return "under200";
    if (price <= 300) return "200to300";
    return "over300";
  }

  function apply() {
    let visible = products.filter(function (p) {
      const price = Number(p.dataset.price);
      if (state.availability === "soldout" && !p.classList.contains("sold-out")) return false;
      if (state.availability === "available" && p.classList.contains("sold-out")) return false;
      if (state.price !== "all" && priceBand(price) !== state.price) return false;
      return true;
    });

    if (state.sort === "az") {
      visible.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name, "es"); });
    } else if (state.sort === "price-asc") {
      visible.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
    } else if (state.sort === "price-desc") {
      visible.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
    }

    products.forEach(function (p) { p.style.display = "none"; });
    visible.forEach(function (p) { grid.appendChild(p); p.style.display = ""; });

    let empty = grid.querySelector(".empty");
    if (!visible.length && !empty) {
      empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Nothing here. Everything is sold out.";
      grid.appendChild(empty);
    } else if (visible.length && empty) {
      empty.remove();
    }

    document.getElementById("count").textContent =
      visible.length + (visible.length === 1 ? " item" : " items");
  }

  document.querySelectorAll(".menu").forEach(function (menu) {
    const key = menu.dataset.filter;
    menu.addEventListener("change", function (e) {
      state[key] = e.target.value;
      menu.querySelectorAll("label").forEach(function (l) {
        l.classList.toggle("checked", l.contains(e.target));
      });
      menu.closest("details").removeAttribute("open");
      apply();
    });
  });

  const viewGrid = document.getElementById("view-grid");
  const viewList = document.getElementById("view-list");
  function setView(view) {
    state.view = view;
    grid.classList.toggle("list", view === "list");
    viewGrid.classList.toggle("active", view === "grid");
    viewList.classList.toggle("active", view === "list");
  }
  viewGrid.addEventListener("click", function () { setView("grid"); });
  viewList.addEventListener("click", function () { setView("list"); });

  document.addEventListener("click", function (e) {
    document.querySelectorAll("details.filter[open]").forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute("open");
    });
  });

  apply();
})();
