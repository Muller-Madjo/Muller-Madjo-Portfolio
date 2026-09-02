/* =========================================================
   MULLER MADJO — PORTFOLIO — INTERACTIONS
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- 1. THEME CLAIR / SOMBRE ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("mm-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else if (prefersDark) {
    root.setAttribute("data-theme", "dark");
  }

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("mm-theme", next);
  });

  /* ---------- 2. MENU MOBILE ---------- */
  var burger = document.getElementById("navBurger");
  var nav = document.getElementById("mainNav");

  burger.addEventListener("click", function () {
    burger.classList.toggle("open");
    nav.classList.toggle("open");
  });

  nav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      burger.classList.remove("open");
      nav.classList.remove("open");
    });
  });

  /* ---------- 3. HEADER : OMBRE AU SCROLL + BOUTON RETOUR EN HAUT ---------- */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 12);
    backToTop.classList.toggle("show", y > 600);
  }, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 4. SCROLL SPY (nav active + indicateur) ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll(".nav-link"));
  var navIndicator = nav.querySelector(".nav-indicator");
  var sections = navLinks.map(function (l) {
    return document.getElementById(l.dataset.section);
  });

  function positionIndicator(link) {
    if (!link || window.innerWidth <= 720) return;
    navIndicator.style.width = link.offsetWidth + "px";
    navIndicator.style.transform = "translateX(" + link.offsetLeft + "px)";
  }

  function setActiveLink(link) {
    navLinks.forEach(function (l) { l.classList.remove("active"); });
    link.classList.add("active");
    positionIndicator(link);
  }

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        var link = navLinks.filter(function (l) { return l.dataset.section === id; })[0];
        if (link) setActiveLink(link);
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(function (s) { if (s) spyObserver.observe(s); });

  window.addEventListener("load", function () {
    positionIndicator(nav.querySelector(".nav-link.active"));
  });
  window.addEventListener("resize", function () {
    positionIndicator(nav.querySelector(".nav-link.active"));
  });

  /* ---------- 5. REVEAL AU SCROLL ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add("is-visible");
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- 6. LAMES DE COMPETENCES (accordéon) ---------- */
  var skillBlades = document.querySelectorAll("[data-blade]");
  skillBlades.forEach(function (blade) {
    var head = blade.querySelector(".skill-blade-head");
    head.addEventListener("click", function () {
      var willOpen = !blade.classList.contains("open");
      blade.classList.toggle("open", willOpen);
    });
  });

  /* ---------- 7. ONGLETS PROJETS ---------- */
  var tabs = document.querySelectorAll(".project-tab");
  var panels = document.querySelectorAll("[data-panel]");
  var tabIndicator = document.querySelector(".project-tab-indicator");

  function moveTabIndicator(tab) {
    tabIndicator.style.width = tab.offsetWidth + "px";
    tabIndicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      moveTabIndicator(tab);

      var target = tab.dataset.target;
      panels.forEach(function (panel) {
        panel.classList.toggle("active", panel.id === "panel-" + target);
      });
    });
  });

  window.addEventListener("load", function () {
    var activeTab = document.querySelector(".project-tab.active");
    if (activeTab) moveTabIndicator(activeTab);
  });
  window.addEventListener("resize", function () {
    var activeTab = document.querySelector(".project-tab.active");
    if (activeTab) moveTabIndicator(activeTab);
  });

  /* ---------- 8. "VOIR PLUS" — dépliage des cartes sans rechargement ---------- */
  document.querySelectorAll("[data-see-more]").forEach(function (btn) {
    var panel = btn.closest("[data-panel]");
    var grid = panel.querySelector("[data-card-grid]");
    var hiddenCards = grid.querySelectorAll(".project-card.is-hidden");

    if (hiddenCards.length === 0) {
      btn.classList.add("is-hidden");
      return;
    }

    btn.addEventListener("click", function () {
      var isOpen = btn.classList.contains("is-open");

      if (!isOpen) {
        hiddenCards.forEach(function (card, i) {
          card.classList.remove("is-hidden");
          card.classList.remove("card-enter");
          void card.offsetWidth; /* relance l'animation */
          card.style.animationDelay = (i * 70) + "ms";
          card.classList.add("card-enter");
        });
        btn.classList.add("is-open");
        btn.childNodes[0].textContent = "Voir moins ";
      } else {
        hiddenCards.forEach(function (card) { card.classList.add("is-hidden"); });
        btn.classList.remove("is-open");
        btn.childNodes[0].textContent = "Voir plus ";
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  /* ---------- 9. LEGER EFFET DE TILT SUR LA PHOTO HERO ---------- */
  var heroPhoto = document.querySelector("[data-tilt]");
  if (heroPhoto && window.matchMedia("(hover: hover)").matches) {
    heroPhoto.addEventListener("mousemove", function (e) {
      var rect = heroPhoto.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroPhoto.style.transform =
        "perspective(800px) rotateY(" + (x * 8) + "deg) rotateX(" + (y * -8) + "deg)";
    });
    heroPhoto.addEventListener("mouseleave", function () {
      heroPhoto.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
    });
  }

  /* ---------- 10. ANNEE COURANTE DANS LE FOOTER ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

})();
