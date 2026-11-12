const directions = {
  mesa: {
    title: "La mesa de siempre",
    description:
      "Blanco y azul tinta. Letras de lectura tranquila y una fotografía que te deja entrar al lugar.",
  },
  encuentro: {
    title: "Un café y me cuentas",
    description:
      "Borgoña y blanco. Letras estrechas con voz propia; las personas y la conversación llevan la portada.",
  },
  ritmo: {
    title: "A tu ritmo",
    description:
      "Grafito y blanco. Tipografía de libro y una portada que cambia según cómo vienes hoy.",
  },
};
const frame = document.querySelector("#direction-frame");
function chooseDirection(id) {
  if (!directions[id]) id = "mesa";
  for (const button of document.querySelectorAll("[data-direction]"))
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.direction === id),
    );
  const direction = directions[id];
  if (frame.getAttribute("src") !== id + ".html") frame.src = id + ".html";
  frame.title = "Propuesta " + direction.title;
  document.querySelector("#open-direction").href = id + ".html";
  document.querySelector("#direction-description").textContent =
    direction.description;
}
for (const button of document.querySelectorAll("[data-direction]"))
  button.addEventListener("click", () => {
    location.hash = button.dataset.direction;
  });
window.addEventListener("hashchange", () =>
  chooseDirection(location.hash.slice(1)),
);
chooseDirection(location.hash.slice(1));
for (const button of document.querySelectorAll("[data-viewport]"))
  button.addEventListener("click", () => {
    document.body.dataset.preview = button.dataset.viewport;
    for (const other of document.querySelectorAll("[data-viewport]"))
      other.setAttribute("aria-pressed", String(other === button));
  });
