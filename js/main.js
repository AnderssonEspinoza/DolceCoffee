import { products } from "./products.js";
const $ = (q, parent = document) => parent.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const money = (cents) => "$" + (cents / 100).toFixed(2);
const imageBase = new URL("../assets/images/", import.meta.url);
let cart = {};
try {
  const stored = JSON.parse(localStorage.getItem("dolce-selection") || "{}");
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    for (const [id, quantity] of Object.entries(stored)) {
      if (
        products.some((p) => String(p.id) === id) &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= 99
      )
        cart[id] = quantity;
    }
  }
} catch {
  /* Selection remains usable when storage is unavailable. */
}
// Keep keyboard interactions immediate; pointer feedback can use short transitions.
const root = document.documentElement;
document.addEventListener(
  "pointerdown",
  () => {
    root.dataset.input = "pointer";
  },
  { capture: true, passive: true },
);
document.addEventListener(
  "keydown",
  () => {
    root.dataset.input = "keyboard";
  },
  { capture: true },
);
const toast = $(".toast");
let toastTimer;
let toastRunning = false;
let toastRemaining = 0;
let toastDeadline = 0;
let toastHovered = false;
function pauseToast() {
  if (!toastRunning) return;
  toastRunning = false;
  clearTimeout(toastTimer);
  toastRemaining = Math.max(0, toastDeadline - performance.now());
}
function dismissToast() {
  toastRunning = false;
  clearTimeout(toastTimer);
  toast.classList.remove("visible");
  toastRemaining = 0;
  if (toast.contains(document.activeElement)) $("[data-cart-open]").focus();
}
function resumeToast() {
  clearTimeout(toastTimer);
  if (
    !toast.classList.contains("visible") ||
    document.hidden ||
    toastHovered ||
    toast.contains(document.activeElement)
  )
    return;
  toastDeadline = performance.now() + toastRemaining;
  toastRunning = true;
  toastTimer = setTimeout(dismissToast, toastRemaining);
}
function notify(message) {
  toastRunning = false;
  clearTimeout(toastTimer);
  $("[data-toast-message]").textContent = message;
  toast.classList.add("visible");
  toastRemaining = 4000;
  toastDeadline = performance.now() + toastRemaining;
  resumeToast();
}
toast.addEventListener("mouseenter", () => {
  toastHovered = true;
  pauseToast();
});
toast.addEventListener("mouseleave", () => {
  toastHovered = false;
  resumeToast();
});
toast.addEventListener("focusin", pauseToast);
toast.addEventListener("focusout", () => queueMicrotask(resumeToast));
$(".toast-dismiss").addEventListener("click", dismissToast);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (
      toast.classList.contains("visible") &&
      !toastHovered &&
      !toast.contains(document.activeElement)
    )
      pauseToast();
  } else resumeToast();
});
function persist() {
  try {
    localStorage.setItem("dolce-selection", JSON.stringify(cart));
  } catch {
    /* Keep the in-memory selection. */
  }
  renderCart();
}
function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  $("[data-count]").textContent = count;
  $("[data-cart-open]").setAttribute(
    "aria-label",
    `Ver mi selección${count ? `, ${count} ${count === 1 ? "producto" : "productos"}` : ""}`,
  );
  $("[data-selection-subtitle]").textContent = count
    ? `${count} ${count === 1 ? "producto seleccionado" : "productos seleccionados"}`
    : "Tu próxima pausa, a tu manera.";
  const target = $("#cart-items");
  // Reuse rows so adjusting quantities never replaces the focused button.
  for (const row of target.querySelectorAll("[data-cart-row]")) {
    if (!cart[row.dataset.cartRow]) row.remove();
  }
  if (entries.length) $(".cart-empty", target)?.remove();
  else if (!$(".cart-empty", target)) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    const menuUrl = new URL("../pages/productos.html", import.meta.url);
    empty.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Zm12 1h2a3 3 0 1 1 0 6h-2M8 3v2m4-2v2m4-2v2"/></svg><h3>Todo empieza con un antojo.</h3><p>Elige algo de la carta y prepara tu próxima pausa.</p><a class="text-link" href="${menuUrl}">Explorar la carta</a>`;
    target.append(empty);
  }
  let total = 0;
  for (const [id, quantity] of entries) {
    const p = products.find((p) => String(p.id) === id);
    total += p.price * quantity;
    let row = target.querySelector(`[data-cart-row="${id}"]`);
    if (!row) {
      row = document.createElement("div");
      row.className = "cart-row";
      row.dataset.cartRow = id;
      row.innerHTML = `<img src="${new URL(p.image, imageBase)}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)} cada uno</p></div><div class="quantity-controls"><button type="button" data-change="-1" data-id="${id}" aria-label="Quitar uno: ${p.name}">−</button><span data-quantity aria-label="Cantidad"></span><button type="button" data-change="1" data-id="${id}" aria-label="Agregar uno: ${p.name}">+</button></div>`;
      target.append(row);
    }
    $("[data-quantity]", row).textContent = quantity;
    $('[data-change="1"]', row).disabled = quantity >= 99;
  }
  $("#cart-total").textContent = money(total);
}
const feedbackTimers = new WeakMap();
$$("[data-add]").forEach((button) =>
  button.addEventListener("click", () => {
    const id = button.dataset.add;
    if ((cart[id] || 0) >= 99)
      return notify("Puedes seleccionar hasta 99 unidades por producto.");
    cart[id] = (cart[id] || 0) + 1;
    persist();
    notify(`${products[Number(id)].name} agregado a tu selección`);
    clearTimeout(feedbackTimers.get(button));
    button.classList.add("is-added");
    $(".add-label", button).textContent = "Agregado";
    feedbackTimers.set(
      button,
      setTimeout(() => {
        button.classList.remove("is-added");
        $(".add-label", button).textContent = "Agregar a mi selección";
      }, 1600),
    );
  }),
);
const dialog = $(".cart-dialog");
$("[data-cart-open]").addEventListener("click", () => {
  dismissToast();
  renderCart();
  dialog.showModal();
});
$$("[data-cart-close]").forEach((button) =>
  button.addEventListener("click", () => dialog.close()),
);
let pressedOutside = false;
function outsideDialog(event) {
  const bounds = dialog.getBoundingClientRect();
  return (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  );
}
dialog.addEventListener("pointerdown", (event) => {
  pressedOutside = event.target === dialog && outsideDialog(event);
});
dialog.addEventListener("click", (event) => {
  if (pressedOutside && event.target === dialog && outsideDialog(event))
    dialog.close();
  pressedOutside = false;
});
$("#cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const id = button.dataset.id;
  const quantity = (cart[id] || 0) + Number(button.dataset.change);
  if (quantity <= 0) delete cart[id];
  else cart[id] = Math.min(quantity, 99);
  const wasFocused = document.activeElement === button;
  persist();
  if (!wasFocused || (button.isConnected && !button.disabled)) return;
  const controls = [...$("#cart-items").querySelectorAll("[data-change]")];
  (
    controls.find(
      (b) =>
        !b.disabled &&
        b.dataset.id === id &&
        b.dataset.change === button.dataset.change,
    ) ||
    controls.find((b) => !b.disabled) ||
    $("[data-cart-close]")
  ).focus();
});
$$("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    $$("[data-filter]").forEach((other) =>
      other.setAttribute("aria-pressed", String(other === button)),
    );
    const filter = button.dataset.filter;
    let count = 0;
    $$(".product").forEach((product) => {
      product.hidden = filter !== "all" && product.dataset.category !== filter;
      if (!product.hidden) count++;
    });
    $("#filter-status").textContent = `${count} productos disponibles`;
  }),
);
const toggle = $(".menu-toggle");
const nav = $("#navigation");
function closeMenu() {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
}
toggle.addEventListener("click", () => {
  nav.setAttribute("data-animated", "");
  const open = !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width:761px)").addEventListener("change", () => {
  nav.removeAttribute("data-animated");
  closeMenu();
});
const contact = $('[data-local-form="contact"]');
contact?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contact);
  const result = $(".form-result", contact);
  $("textarea", result).value =
    `Nombre: ${data.get("name")}\nCorreo: ${data.get("email")}\nTeléfono: ${data.get("phone") || "No indicado"}\nAsunto: ${data.get("subject")}\n\n${data.get("message")}`;
  result.hidden = false;
  result.scrollIntoView({
    behavior:
      root.dataset.input === "keyboard" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    block: "nearest",
  });
});
$("[data-copy]")?.addEventListener("click", async () => {
  const field = $(".form-result textarea");
  try {
    await navigator.clipboard.writeText(field.value);
    notify("Mensaje copiado. No se ha enviado.");
  } catch {
    field.focus();
    field.select();
    notify("Selecciona y copia el mensaje con el menú de tu dispositivo.");
  }
});
renderCart();
