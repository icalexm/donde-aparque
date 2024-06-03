const $mapa = window.mapa,
  $datos = window.datos;
let mapaCols = localStorage.getItem("mapaCols") | 3,
  mapFilas = localStorage.getItem("mapFilas") | 4,
  callejero =
    localStorage.getItem("mapa") !== null
      ? localStorage
          .getItem("mapa")
          .split("|")
          .map((e) => e.split(","))
      : [
          ["h0", "v", "h"],
          ["h Dia 13 (8 a 12)", "v", "h"],
          ["h", "v", "h"],
          ["h", "v1", "h0"],
        ];

document.addEventListener("DOMContentLoaded", (e) => {
  pintaPantalla();
  LimpiaModif();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-calle")) clickItemCalle(e);
  if (e.target.classList.contains("confirColFil")) clickConfirColFil(e);
  if (e.target.classList.contains("confirGuardar")) clickConfirGuardar(e);
});
function clickConfirColFil(e) {
  if (cols.value <= 0) {
    alert("tiene que especificar las columnas que tiene la calle");
    return;
  }
  if (filas.value <= 0) {
    alert("tiene que especificar las filas que tiene la calle");
    return;
  }
  mapaCols = cols.value;
  mapFilas = filas.value;
  localStorage.setItem("mapaCols", mapaCols);
  localStorage.setItem("mapFilas", mapFilas);
  pintaPantalla();
}
function clickConfirGuardar(e) {
  let str = "";
  // "h Dia 13 (8 a 12)"
  str = orientacion.value;
  if (dividir.value) str += dividir.value;
  if (diaLimpia.value && diaLimpia.value > 0) {
    str += " Dia ";
    str += diaLimpia.value;
  }
  if (
    (horaIniLimpieza.value || horaFinLimpieza.value) &&
    (horaIniLimpieza.value > 0 || horaFinLimpieza.value > 0)
  ) {
    str += " (";
    str += horaIniLimpieza.value;
    str += " a ";
    str += horaFinLimpieza.value;
    str += ")";
  }

  console.log(window.id.value, str, callejero);
  let id = window.id.value,
    idxy = id.split("_"),
    x = parseInt(idxy[1]),
    y = parseInt(idxy[2]);
  //console.log(x, y, callejero[x][y]);
  if (!callejero[x]) {
    callejero.push([str]);
  } else {
    if (!callejero[x][y]) {
      callejero[x].push(str);
    } else {
      callejero[x][y] = str;
    }
  }

  localStorage.setItem("mapa", callejero.join("|"));
  LimpiaModif();
  $datos.classList.add("none");
  pintaPantalla();
}
function LimpiaModif() {
  id.value = "";
  orientacion.value = "";
  dividir.value = "";
  diaLimpia.value = "";
  horaIniLimpieza.value = "";
  horaFinLimpieza.value = "";
}
function clickItemCalle(e) {
  //console.log(e.target);
  const $el = e.target,
    id = $el.dataset.id,
    idxy = id.split("_"),
    x = parseInt(idxy[1]),
    y = parseInt(idxy[2]),
    desc = $el.dataset.desc,
    descAtt = desc.split(" "),
    dia = parseInt(descAtt[1]) | 0,
    ini = parseInt(descAtt[2]?.split("(")[1]) | 0,
    fin = parseInt(descAtt[4]?.split(")")[0]) | 0,
    col = $el.dataset.col,
    orienta = $el.dataset.orienta;
  window.id.value = id;
  window.orientacion.value = orienta;
  window.dividir.value = orienta;
  window.diaLimpia.value = dia;
  window.horaIniLimpieza.value = ini;
  window.horaFinLimpieza.value = fin;
  $datos.classList.remove("none");
}

function pintaPantalla() {
  cols.value = mapaCols;
  filas.value = mapFilas;
  document.documentElement.style.setProperty("--mapaCols", mapaCols);
  document.documentElement.style.setProperty("--mapaFilas", mapFilas);

  $mapa.innerHTML = "";

  let str = "",
    calle = "",
    orienta = "",
    clase = "",
    colstr = "",
    col = " ",
    desc = "",
    id = 1;

  for (let x = 0; x < mapFilas; x++) {
    //console.log(callejero[x]);
    for (let y = 0; y < mapaCols; y++) {
      if (!callejero[x] || !callejero[x][y]) {
        calle = "?";
        orienta = "";
        clase = "";
        col = " ";
        desc = "";
      } else {
        if (callejero[x] && callejero[x][y] && callejero[x][y].length > 0) {
          switch (callejero[x][y].substring(0, 1)) {
            case "v":
              calle = "v";
              clase = "item-v";
              break;

            case "h":
              calle = "h";
              clase = "item-h";
              break;

            default:
              calle = callejero[x][y].substring(0, 1);
              alert(`el callejero está mal definido ${callejero[x][y]}`);
              break;
          }
        } else {
          calle = "?";
          orienta = "";
          clase = "";
          col = " ";
          desc = "";
        }
        orienta = calle.substring(0, 1);
        if (callejero[x][y].length >= 2) {
          colstr = callejero[x][y].substring(1, 2);
          if (colstr.trim().length === 0) {
            // col = 3;
          } else {
            col = parseInt(colstr);
            calle += col.toString();
          }
        } else {
          // col = 3;
        }
        if (callejero[x][y].length > 2) {
          desc += callejero[x][y].substring(2, callejero[x][y].length);
        } else {
          desc = "";
        }
      }
      id = `id_${x}_${y}`;
      str += pintaCalle(calle, clase, desc, col, id, orienta);
    }
  }
  $mapa.innerHTML = str;
}
function pintaCalle(calle, clase, desc, col, id, orienta) {
  return `
      <article class="item-calle ${clase}" data-id=${id} data-desc="${desc}" data-col="${col}" data-orienta="${orienta}">
        ${calle}
      </article>
    `;
}
