const $miBarrio = window.miBarrio;

document.addEventListener("touchstart", (e) => {
  pulsa(e.target);
});
document.addEventListener("click", (e) => {
  console.log("click:", e, e.target);
  pulsa(e.target);
});
document.addEventListener("DOMContentLoaded", (e) => {
  pintaPantalla();
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

function pintaPantalla() {
  let str = "",
    i = 1,
    col = 3;
  col = 0;
  str += pintaCalle("calle-h", col, "", i);
  col = 3;
  i += col;
  str += pintaCalle("calle-v", col, "", i);
  i += col;
  str += pintaCalle("calle-h", col, "", i);
  i += col;

  str += pintaCalle("calle-h", col, "Dia 13 (8 a 12)", i);
  i += col;
  str += pintaCalle("calle-v", col, "", i);
  i += col;
  str += pintaCalle("calle-h", col, "", i);
  i += col;

  str += pintaCalle("calle-h", col, "", i);
  i += col;
  str += pintaCalle("calle-v", col, "", i);
  i += col;
  str += pintaCalle("calle-h", col, "", i);
  i += col;

  str += pintaCalle("calle-h", col, "", i);
  i += col;
  col = 1;
  str += pintaCalle("calle-v", col, "", i);
  i += col;
  $miBarrio.innerHTML = str;
}

function pintaCalle(calle, col, desc, id) {
  if (col === 0) {
    return `
      <article class="${calle} ">
      </article>
    `;
  }
  let str = `
      <article class="${calle} ">
        <div class="desc">${desc}</div>
        <div class="callePos">
        `;
  if (col >= 1) {
    str += `
        <div class="posicion" id="${id}a"></div>
        <div class="posicion" id="${id}b"></div>
      `;
  }
  if (col >= 2) {
    str += `
        <div class="posicion" id="${id + 1}b"></div>
        <div class="posicion" id="${id + 1}a"></div>
        `;
  }
  if (col > 2) {
    str += `
        <div class="posicion" id="${id + 2}a"></div>
        <div class="posicion" id="${id + 2}b"></div>        
        `;
  }
  str += `
        </div>
      </article>
    `;
  return str;
}
