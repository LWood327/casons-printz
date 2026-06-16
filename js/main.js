/* ==========================================================================
   Cason's Printz — main.js
   Reads products.json and renders the product grids.
   Stage 4 will add the #product/<id> hash-router for detail pages.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- State ---- */
  var PRODUCTS = { premade: [], custom: [] };

  /* ---- Small helper to safely escape text into HTML ---- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---- Build one product card ---- */
  function cardHTML(product) {
    var badge = product.type === "custom" ? "Custom" : "Premade";
    return (
      '<a class="product-card" href="#product/' + esc(product.id) + '">' +
      '<img class="product-card__img" loading="lazy" src="' + esc(product.image) +
      '" alt="' + esc(product.name) + '">' +
      '<div class="product-card__body">' +
      '<span class="product-card__badge">' + esc(badge) + "</span>" +
      '<h3 class="product-card__name">' + esc(product.name) + "</h3>" +
      '<p class="product-card__price">' + esc(product.price) + "</p>" +
      "</div>" +
      "</a>"
    );
  }

  /* ---- Render a list of products into a grid container ---- */
  function renderGrid(containerId, list) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (!list || !list.length) {
      container.innerHTML =
        '<p style="color:var(--color-text-muted)">No products yet — check back soon.</p>';
      return;
    }
    container.innerHTML = list.map(cardHTML).join("");
  }

  /* ---- Load products.json and render both sections ---- */
  function loadProducts() {
    return fetch("products.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        PRODUCTS.premade = data.premade || [];
        PRODUCTS.custom = data.custom || [];
        renderGrid("premade-grid", PRODUCTS.premade);
        renderGrid("custom-grid", PRODUCTS.custom);
      })
      .catch(function (err) {
        console.error("Could not load products.json:", err);
        var msg =
          '<p style="color:var(--color-text-muted)">Couldn\'t load products. ' +
          "If you opened this file directly, run a local server " +
          "(see README) so the browser can read products.json.</p>";
        var p = document.getElementById("premade-grid");
        var c = document.getElementById("custom-grid");
        if (p) p.innerHTML = msg;
        if (c) c.innerHTML = "";
      });
  }

  /* ---- Init ---- */
  loadProducts();
})();
