document.addEventListener("touchstart", (e) => {
  pulsa(e.target);
});
document.addEventListener("click", (e) => {
  console.log("click:", e, e.target);
  pulsa(e.target);
});
document.addEventListener("DOMContentLoaded", (e) => {
  const aqui = localStorage.getItem("marcat"),
    fechaStr = localStorage.getItem("marcatData");
  if (aqui) {
    document.getElementById(aqui).classList.add("aqui");
    window.ultimaFichada.innerHTML = fechaStr;
  }
});
function pulsa(el) {
  if (el.classList.contains("posicion")) {
    document.querySelectorAll(".aqui").forEach((element) => {
      element.classList.remove("aqui");
    });
    el.classList.add("aqui");
    const fecha = new Date(),
      fechaStr = fecha.toLocaleString();
    window.ultimaFichada.innerHTML = fechaStr;

    //Guardar a la memoria del usuari
    localStorage.setItem("marcat", el.getAttribute("id"));
    localStorage.setItem("marcatData", fechaStr);
    //$input.value = localStorage.getItem("wpSearch");
    //localStorage.removeItem("wpSearch");
  }
}
