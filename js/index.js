const $miBarrio = window.miBarrio;
let columnas = 0,
  filas = 0,
  callejero = [];

document.addEventListener("touchstart", (e) => {
  pulsa(e.target);
});
document.addEventListener("click", (e) => {
  console.log("click:", e, e.target);
  pulsa(e.target);
});
document.addEventListener("DOMContentLoaded", (e) => {
  ObtenVariablesIniciales();
  pintaPantalla();
  const aqui = localStorage.getItem("marcat"),
    fechaStr = localStorage.getItem("marcatData");
  if (aqui) {
    let $aqui = document.getElementById(aqui);
    if ($aqui) $aqui.classList.add("aqui");
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

function ObtenVariablesIniciales() {
  columnas = localStorage.getItem("mapaColumnas") | 3;
  filas = localStorage.getItem("mapFilas") | 4;
  callejero =
    localStorage.getItem("mapa") !== null
      ? localStorage
          .getItem("mapa")
          .split("|")
          .map((e) => e.split(","))
      : [
          ["h0", "v", "h"],
          ["h#Dia 13 (8 a 12)#Hosp", "v", "h#Parque"],
          ["h", "v", "h"],
          ["h", "v1", "h0"],
        ];
}

function pintaPantalla() {
  // let str = "",
  //   i = 1,
  //   col = 3;
  // col = 0;
  // str += pintaCalle("calle-h", col, "", i);
  // col = 3;
  // i += col;
  // str += pintaCalle("calle-v", col, "", i);
  // i += col;
  // str += pintaCalle("calle-h", col, "", i);
  // i += col;

  // str += pintaCalle("calle-h", col, "Dia 13 (8 a 12)", i);
  // i += col;
  // str += pintaCalle("calle-v", col, "", i);
  // i += col;
  // str += pintaCalle("calle-h", col, "", i);
  // i += col;

  // str += pintaCalle("calle-h", col, "", i);
  // i += col;
  // str += pintaCalle("calle-v", col, "", i);
  // i += col;
  // str += pintaCalle("calle-h", col, "", i);
  // i += col;

  // str += pintaCalle("calle-h", col, "", i);
  // i += col;
  // col = 1;
  // str += pintaCalle("calle-v", col, "", i);
  // i += col;

  let str = "",
    calle = "",
    colstr = "",
    col = columnas,
    descDia = "",
    desc = "",
    id = 1;

  for (let x = 0; x < filas; x++) {
    //console.log(callejero[x]);
    for (let y = 0; y < columnas; y++) {
      console.log(callejero[x][y]);
      const item = callejero[x][y].split("#");
      switch (item[0].substring(0, 1)) {
        case "v":
          calle = "calle-v";
          break;

        case "h":
          calle = "calle-h";
          break;

        default:
          alert(`el callejero está mal definido ${callejero[x][y]}`);
          break;
      }
      if (item[0].length >= 2) {
        colstr = item[0].substring(1, 2);
        if (colstr.trim().length === 0) {
          col = 3;
        } else {
          col = parseInt(colstr);
          calle += " item-" + col.toString();
        }
      } else {
        col = 3;
      }
      descDia = "";
      desc = "";
      if (item.length > 1) {
        if (item[1].length > 3 && item[1].substring(0, 3) === "Dia") {
          descDia = item[1];
        } else {
          desc = item[1];
        }
      }
      if (item.length > 2) {
        desc = item[2];
      }
      str += pintaCalle(calle, col, descDia, desc, id);
      id += col;
    }
  }

  $miBarrio.innerHTML = str;
}

function pintaCalle(calle, col, descDia, desc, id) {
  if (col === 0) {
    return `
      <article class="${calle} ">
      </article>
    `;
  }
  let str = `
      <article class="${calle} ">
        <div class="desc">${desc} ${descDia}</div>
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
