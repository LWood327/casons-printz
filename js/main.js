/* ==========================================================================
   Cason's Printz — main.js
   Stage 1: minimal shell. Reads nothing yet.
   Stage 3 will fetch products.json and render the product grids.
   Stage 4 will add the #product/<id> hash-router for detail pages.
   ========================================================================== */

(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Product rendering + routing arrive in later stages.
})();
