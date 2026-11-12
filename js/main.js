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
let toastTimer;
function notify(message) {
  const toast = $(".toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}
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
  $("[data-count]").textContent = entries.reduce(
    (sum, [, qty]) => sum + qty,
    0,
  );
  const target = $("#cart-items");
  target.replaceChildren();
  let total = 0;
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent =
      "Tu próxima pausa está por elegir. Explora la carta y agrega lo que te provoque.";
    target.append(empty);
  }
  for (const [id, quantity] of entries) {
    const p = products.find((p) => String(p.id) === id);
    total += p.price * quantity;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `<img src="${new URL(p.image, imageBase)}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)} cada uno</p></div><div class="quantity-controls"><button type="button" data-change="-1" data-id="${id}" aria-label="Quitar uno: ${p.name}">−</button><span aria-label="Cantidad">${quantity}</span><button type="button" data-change="1" data-id="${id}" aria-label="Agregar uno: ${p.name}" ${quantity >= 99 ? "disabled" : ""}>+</button></div>`;
    target.append(row);
  }
  $("#cart-total").textContent = money(total);
}
$$("[data-add]").forEach((button) =>
  button.addEventListener("click", () => {
    const id = button.dataset.add;
    if ((cart[id] || 0) >= 99)
      return notify("Puedes seleccionar hasta 99 unidades por producto.");
    cart[id] = (cart[id] || 0) + 1;
    persist();
    notify(`${products[Number(id)].name} agregado a tu selección`);
  }),
);
const dialog = $(".cart-dialog");
$("[data-cart-open]").addEventListener("click", () => {
  renderCart();
  dialog.showModal();
});
$$("[data-cart-close]").forEach((button) =>
  button.addEventListener("click", () => dialog.close()),
);
dialog.addEventListener("click", (event) => {
  if (
    event.target === dialog &&
    event.clientX < dialog.getBoundingClientRect().left
  )
    dialog.close();
});
$("#cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const id = button.dataset.id;
  const quantity = (cart[id] || 0) + Number(button.dataset.change);
  if (quantity <= 0) delete cart[id];
  else cart[id] = Math.min(quantity, 99);
  persist();
  const controls = [...$("#cart-items").querySelectorAll("[data-change]")];
  (
    controls.find(
      (b) => b.dataset.id === id && b.dataset.change === button.dataset.change,
    ) || $("[data-cart-close]")
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
matchMedia("(min-width:761px)").addEventListener("change", closeMenu);
const contact = $('[data-local-form="contact"]');
contact?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contact);
  const result = $(".form-result", contact);
  $("textarea", result).value =
    `Nombre: ${data.get("name")}\nCorreo: ${data.get("email")}\nTeléfono: ${data.get("phone") || "No indicado"}\nAsunto: ${data.get("subject")}\n\n${data.get("message")}`;
  result.hidden = false;
  result.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
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
