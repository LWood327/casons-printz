/* ==========================================================================
   Cason's Printz — main.js
   - Reads products.json and renders the product grids
   - Hash-router (#product/<id>) swaps in individual product detail pages
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
  var BY_ID = {}; // id -> product

  /* ---- Elements that make up the "browse" view (hidden on detail pages) ---- */
  var browseEls = [];
  function collectBrowseEls() {
    browseEls = [
      document.querySelector(".hero"),
      document.getElementById("premade"),
      document.getElementById("custom"),
    ].filter(Boolean);
  }

  var productView = document.getElementById("product-view");
  var productViewContent = document.getElementById("product-view-content");

  /* ---- Escape text into HTML ---- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ==========================================================================
     Grid rendering
     ========================================================================== */
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

  /* ==========================================================================
     Product detail view
     ========================================================================== */
  function sizeButtonsHTML(sizes) {
    if (!sizes || !sizes.length) return "";
    return (
      '<div class="field">' +
      '<label class="field__label">Size</label>' +
      '<div class="size-options" role="group" aria-label="Select a size">' +
      sizes
        .map(function (s) {
          return (
            '<button type="button" class="size-btn" data-size="' +
            esc(s) + '">' + esc(s) + "</button>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function detailHTML(p) {
    var isCustom = p.type === "custom";
    var customField = isCustom
      ? '<div class="field">' +
        '<label class="field__label" for="design-prompt">Describe your design</label>' +
        '<textarea id="design-prompt" class="prompt-field" rows="5" ' +
        'placeholder="Tell us exactly what you want printed — characters, colors, placement, style, references..."></textarea>' +
        '<p class="field__hint">The more detail the better. This note is sent with your order.</p>' +
        "</div>"
      : "";

    var ctaLabel = isCustom ? "Order Custom" : "Buy Now";

    return (
      '<a class="back-link" href="#premade"><span aria-hidden="true">&larr;</span> Back to shop</a>' +
      '<div class="product-detail">' +
        '<div class="product-detail__media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' +
        "</div>" +
        '<div class="product-detail__info">' +
          '<span class="product-card__badge">' + (isCustom ? "Custom" : "Premade") + "</span>" +
          "<h1>" + esc(p.name) + "</h1>" +
          '<p class="product-detail__price">' + esc(p.price) + "</p>" +
          '<p class="product-detail__desc">' + esc(p.description) + "</p>" +
          sizeButtonsHTML(p.sizes) +
          customField +
          '<button type="button" class="btn btn-primary btn-block" id="cta-btn" data-id="' +
            esc(p.id) + '">' + ctaLabel + "</button>" +
          '<p class="field__hint" id="cta-note">Select a size to continue.</p>' +
        "</div>" +
      "</div>"
    );
  }

  /* ---- Wire up interactions inside the detail view ---- */
  function bindDetail(p) {
    var selectedSize = null;
    var sizeBtns = productViewContent.querySelectorAll(".size-btn");
    var ctaNote = productViewContent.querySelector("#cta-note");

    Array.prototype.forEach.call(sizeBtns, function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(sizeBtns, function (b) {
          b.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        selectedSize = btn.getAttribute("data-size");
        if (ctaNote) ctaNote.textContent = "Size " + selectedSize + " selected.";
      });
    });

    var cta = productViewContent.querySelector("#cta-btn");
    if (cta) {
      cta.addEventListener("click", function () {
        if (!selectedSize) {
          if (ctaNote) ctaNote.textContent = "Please select a size first.";
          return;
        }
        var prompt = "";
        var promptEl = productViewContent.querySelector("#design-prompt");
        if (promptEl) prompt = promptEl.value.trim();
        if (p.type === "custom" && !prompt) {
          if (ctaNote)
            ctaNote.textContent = "Please describe your design before ordering.";
          return;
        }
        /* Stripe wiring lands in Stage 5. For now, confirm the captured order. */
        handleCheckout(p, selectedSize, prompt);
      });
    }
  }

  /* ---- Placeholder checkout (replaced by Stripe Payment Links in Stage 5) ---- */
  function handleCheckout(p, size, prompt) {
    var lines = [
      "Order captured (checkout wiring comes in Stage 5):",
      "",
      "Item: " + p.name,
      "Size: " + size,
      "Price: " + p.price,
    ];
    if (p.type === "custom") lines.push("Design: " + prompt);
    window.alert(lines.join("\n"));
  }

  /* ==========================================================================
     Router
     ========================================================================== */
  function showBrowse() {
    if (productView) productView.hidden = true;
    browseEls.forEach(function (el) {
      el.hidden = false;
    });
  }

  function showProduct(id) {
    var p = BY_ID[id];
    if (!p) {
      // Unknown id — fall back to the shop.
      showBrowse();
      return;
    }
    browseEls.forEach(function (el) {
      el.hidden = true;
    });
    productViewContent.innerHTML = detailHTML(p);
    if (productView) productView.hidden = false;
    bindDetail(p);
    window.scrollTo(0, 0);
  }

  function route() {
    var m = location.hash.match(/^#product\/(.+)$/);
    if (m) {
      showProduct(decodeURIComponent(m[1]));
    } else {
      showBrowse();
    }
  }

  /* ==========================================================================
     Load + init
     ========================================================================== */
  function loadProducts() {
    return fetch("products.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        PRODUCTS.premade = data.premade || [];
        PRODUCTS.custom = data.custom || [];
        BY_ID = {};
        PRODUCTS.premade.concat(PRODUCTS.custom).forEach(function (p) {
          BY_ID[p.id] = p;
        });
        renderGrid("premade-grid", PRODUCTS.premade);
        renderGrid("custom-grid", PRODUCTS.custom);
        route(); // honor a #product/<id> deep link on first load
      })
      .catch(function (err) {
        console.error("Could not load products.json:", err);
        var msg =
          '<p style="color:var(--color-text-muted)">Couldn\'t load products. ' +
          "If you opened this file directly, run a local server " +
          "(see README) so the browser can read products.json.</p>";
        var pEl = document.getElementById("premade-grid");
        var cEl = document.getElementById("custom-grid");
        if (pEl) pEl.innerHTML = msg;
        if (cEl) cEl.innerHTML = "";
      });
  }

  collectBrowseEls();
  window.addEventListener("hashchange", route);
  loadProducts();
})();
