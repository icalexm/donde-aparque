document.addEventListener("click", (e) => {
  console.log("e:", e, e.target);
  const $el = e.target;
  if ($el.classList.contains("posicion")) {
    document.querySelectorAll(".aqui").forEach((element) => {
      element.classList.remove("aqui");
    });
    $el.classList.add("aqui");
  }
});
