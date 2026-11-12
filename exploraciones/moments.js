const moments = {
  solo: {
    title: "Tu café.\nEl resto puede esperar.",
    description:
      "Ponte esa canción. Mira por la ventana. No hace falta llenar cada minuto.",
    image: "ventana.jpg",
    alt: "Una persona con audífonos trabaja en su laptop junto a la ventana de un café",
  },
  ideas: {
    title: "Dale una vuelta.\nSin darle tantas vueltas.",
    description:
      "Abre tu cuaderno, retoma ese pendiente o deja que las ideas se acomoden. Una cosa a la vez.",
    image: "interior.jpg",
    alt: "Mesas de madera y personas en un café con luz natural",
  },
  gente: {
    title: "Qué bueno\ncoincidir aquí.",
    description:
      "Con esa persona, con tus amigos, con algo que contar. Lo demás puede esperar un café.",
    image: "amigas.jpg",
    alt: "Dos amigas comparten un café y una conversación junto a la ventana",
  },
};
for (const button of document.querySelectorAll("[data-moment]"))
  button.addEventListener("click", () => {
    const moment = moments[button.dataset.moment];
    for (const other of document.querySelectorAll("[data-moment]"))
      other.setAttribute("aria-pressed", String(other === button));
    document.querySelector("#moment-title").textContent = moment.title;
    document.querySelector("#moment-description").textContent =
      moment.description;
    const image = document.querySelector("#moment-photo");
    image.src = "assets/" + moment.image;
    image.alt = moment.alt;
  });
