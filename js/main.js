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

  /* ---- Checkout: send the customer to this product's Stripe Payment Link ----
     - Size is passed as client_reference_id (id_size) so the owner sees it in
       the Stripe dashboard. (Stripe restricts this value to letters, numbers,
       "-" and "_", so free text can't go here.)
     - For custom orders the free-text design can't ride in the URL, so we copy
       it to the clipboard and tell the customer to paste it into the
       "Design details" custom field on the Stripe checkout page. See
       STRIPE_SETUP.md for how to add that field to each custom Payment Link.
  */
  function handleCheckout(p, size, prompt) {
    var link = p.stripeLink;
    var ctaNote = productViewContent.querySelector("#cta-note");

    if (!link) {
      if (ctaNote) {
        ctaNote.textContent =
          "Checkout isn't connected for this item yet. (Owner: add a Stripe " +
          "Payment Link to products.json — see STRIPE_SETUP.md.)";
      }
      return;
    }

    // Dashboard-visible reference: which item + size.
    var ref = (p.id + "_" + size).replace(/[^A-Za-z0-9_-]/g, "");
    var url = link + (link.indexOf("?") > -1 ? "&" : "?") +
      "client_reference_id=" + encodeURIComponent(ref);

    function go() {
      window.location.href = url;
    }

    if (p.type === "custom" && prompt) {
      var notice =
        "Your design notes were copied — paste them into the " +
        '"Design details" box on the secure checkout page. Redirecting…';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prompt).then(
          function () {
            if (ctaNote) ctaNote.textContent = notice;
            setTimeout(go, 1200);
          },
          function () {
            // Clipboard blocked — fall back to redirect; field stays manual.
            go();
          }
        );
        return;
      }
    }
    go();
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

  /* ---- Editable site text (content/site.json, managed via /admin) ---- */
  function setText(id, val) {
    var el = document.getElementById(id);
    if (el && val != null && val !== "") el.textContent = val;
  }

  function setSocial(linkId, itemId, url) {
    var link = document.getElementById(linkId);
    var item = document.getElementById(itemId);
    if (!link) return;
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      if (item) item.hidden = false;
    } else if (item) {
      item.hidden = true; // hide empty social links rather than show dead "#"
    }
  }

  function loadSiteContent() {
    return fetch("content/site.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (s) {
        setText("hero-tagline", s.heroTagline);
        setText("premade-intro", s.premadeIntro);
        setText("custom-intro", s.customIntro);
        var email = document.getElementById("contact-email");
        if (email && s.contactEmail) {
          email.textContent = s.contactEmail;
          email.href = "mailto:" + s.contactEmail;
        }
        setSocial("social-instagram", "social-instagram-item", s.instagramUrl);
        setSocial("social-tiktok", "social-tiktok-item", s.tiktokUrl);
        setSocial("social-twitter", "social-twitter-item", s.twitterUrl);
        // Hide the whole "Follow" column if there are no social links yet
        var followCol = document.getElementById("follow-col");
        if (followCol) {
          followCol.hidden = !(s.instagramUrl || s.tiktokUrl || s.twitterUrl);
        }
      })
      .catch(function (err) {
        console.warn("content/site.json not loaded; using built-in text.", err);
      });
  }

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
  loadSiteContent();
  loadProducts();
})();
