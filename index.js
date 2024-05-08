document.addEventListener("touchstart", (e) => {
  pulsa(e.target);
});
document.addEventListener("click", (e) => {
  console.log("click:", e, e.target);
  pulsa(e.target);
});

function pulsa(el) {
  if (el.classList.contains("posicion")) {
    document.querySelectorAll(".aqui").forEach((element) => {
      element.classList.remove("aqui");
    });
    el.classList.add("aqui");
    const fecha = new Date();
    window.ultimaFichada.innerHTML = fecha.toLocaleString();
  }
}
