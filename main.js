/* Portfolio JavaScript — vanilla, no libraries.
   Each function does one job and only runs if its elements exist on the page. */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initThemeToggle();
  initProjectFilter();
  initProjectModal();
  initContactForm();
  document.querySelector("#year").textContent = new Date().getFullYear();
});

/* ---- Mobile menu: opens/closes the nav on small screens ---- */
function initMobileMenu() {
  const button = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");
  if (!button || !links) return;

  function setOpen(open) {
    links.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  button.addEventListener("click", () =>
    setOpen(!links.classList.contains("open")),
  );
  links
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/* ---- Theme toggle: saves the choice in localStorage ---- */
function initThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;
  const root = document.documentElement;

  function update() {
    const dark = root.dataset.theme === "dark";
    button.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode",
    );
  }
  button.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    if (dark) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {}
    update();
  });
  update();
}

/* ---- Work page: filter buttons show/hide cards by data-category ---- */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      const filter = button.dataset.filter;
      cards.forEach((card) => {
        card.hidden = !(filter === "all" || card.dataset.category === filter);
      });
    });
  });
}

/* ---- Work page: project details open in a native <dialog> ---- */
function initProjectModal() {
  const modal = document.querySelector("#project-modal");
  const cards = document.querySelectorAll(".project-card");
  if (!modal || !cards.length) return;

  const categoryNames = {
    webflow: "WebFlow",
    wordpress: "WordPress",
    code: "Html/CSS/JS",
  };

  function open(card) {
    modal.querySelector("#modal-title").textContent =
      card.querySelector("h3").textContent;
    modal.querySelector(".modal-cat").textContent =
      categoryNames[card.dataset.category] || "";
    modal.showModal();
  }
  cards.forEach((card) => {
    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(card);
      }
    });
  });
  modal
    .querySelector(".modal-close")
    .addEventListener("click", () => modal.close());
  // clicking the dark backdrop (outside the box) closes it too
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

/* ---- Contact form: validates, then opens the visitor's email app.
        There is no backend, so nothing is "sent" by this page itself. ---- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const message = form.querySelector("#message");
  const count = form.querySelector(".char-count");
  const TO = "omunenfarouk@gmail.com";

  message.addEventListener("input", () => {
    count.textContent = message.value.length + " / 600";
  });

  const rules = {
    name: (v) =>
      v.trim().length >= 2 || "Enter your name (at least 2 characters).",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
      "Enter a valid email address, like you@example.com.",
    subject: (v) =>
      v.trim().length >= 3 || "Add a short subject (at least 3 characters).",
    message: (v) =>
      v.trim().length >= 15 ||
      "Write at least 15 characters so I know what you need.",
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach((id) => {
      const field = form.querySelector("#" + id);
      const group = field.closest(".form-group");
      const result = rules[id](field.value);
      group.classList.toggle("invalid", result !== true);
      group.querySelector(".form-error").textContent =
        result === true ? "" : result;
      field.setAttribute("aria-invalid", String(result !== true));
      if (result !== true) valid = false;
    });

    status.className = "form-status show";
    if (!valid) {
      status.classList.add("error");
      status.textContent =
        "Some fields need attention. Fix the highlighted fields and try again.";
      return;
    }
    const body = `${message.value}\n\nFrom: ${form.name.value} <${form.email.value}>`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(form.subject.value)}&body=${encodeURIComponent(body)}`;
    status.classList.add("success");
    status.textContent =
      "Your email app should open with this message ready to send. Nothing is sent until you press Send there.";
  });
}
