const $miBarrio = window.miBarrio,
  $mapaCalles = document.get,
  $mapa = window.mapa,
  $datos = window.datos;
let mapaCols = localStorage.getItem("mapaCols")
    ? localStorage.getItem("mapaCols")
    : 4,
  mapFilas = localStorage.getItem("mapFilas")
    ? localStorage.getItem("mapFilas")
    : 4,
  callejero =
    localStorage.getItem("mapa") !== null
      ? localStorage
          .getItem("mapa")
          .split("|")
          .map((e) => e.split(","))
      : [
          ["h0", "v", "h", "v"],
          ["h#Dia 13 (8 a 12)#Hosp", "v", "h#Parque", "v"],
          ["h", "v", "h", "v1"],
          ["h", "v1", "h0", "v0"],
        ];

document.addEventListener("touchstart", (e) => {
  pulsa(e.target);
});

document.addEventListener("click", (e) => {
  console.log("click:", e, e.target);
  if (e.target.classList.contains("configurar")) {
    mapaCalles.classList.toggle("none");
    mapaConfig.classList.toggle("none");
    if (mapaConfig.classList.contains("none")) {
      pintaPantallaMapa();
    }
    return;
  }
  if (e.target.classList.contains("item-calle")) {
    clickItemCalle(e);
    return;
  }
  if (e.target.classList.contains("confirColFil")) {
    clickConfirColFil(e);
    return;
  }
  if (e.target.classList.contains("confirGuardar")) {
    clickConfirGuardar(e);
    return;
  }
  pulsa(e.target);
});
document.addEventListener("DOMContentLoaded", (e) => {
  //ObtenVariablesIniciales();
  document.documentElement.style.setProperty("--mapaCols", mapaCols);
  document.documentElement.style.setProperty("--mapaFilas", mapFilas);
  pintaPantallaMapa();
  const aqui = localStorage.getItem("marcat"),
    fechaStr = localStorage.getItem("marcatData");
  if (aqui) {
    let $aqui = document.getElementById(aqui);
    if ($aqui) $aqui.classList.add("aqui");
    window.ultimaFichada.innerHTML = fechaStr;
  }
  pintaPantalla();
  LimpiaModif();
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

// function ObtenVariablesIniciales() {
//   mapaCols = localStorage.getItem("mapaCols")
//     ? localStorage.getItem("mapaCols")
//     : 4;
//   mapFilas = localStorage.getItem("mapFilas")
//     ? localStorage.getItem("mapFilas")
//     : 4;

//   document.documentElement.style.setProperty("--mapaCols", mapaCols);
//   document.documentElement.style.setProperty("--mapaFilas", mapFilas);

//   callejero =
//     localStorage.getItem("mapa") !== null
//       ? localStorage
//           .getItem("mapa")
//           .split("|")
//           .map((e) => e.split(","))
//       : [
//           ["h0", "v", "h", "v"],
//           ["h#Dia 13 (8 a 12)#Hosp", "v", "h#Parque", "v"],
//           ["h", "v", "h", "v1"],
//           ["h", "v1", "h0", "v0"],
//         ];
// }

function pintaPantallaMapa() {
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
    col = mapaCols,
    descDia = "",
    desc = "",
    id = 1;

  for (let x = 0; x < mapFilas; x++) {
    //console.log(callejero[x]);
    for (let y = 0; y < mapaCols; y++) {
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
      str += pintaCalleMapa(calle, col, descDia, desc, id);
      id += col;
    }
  }

  $miBarrio.innerHTML = str;
}

function pintaCalleMapa(calle, col, descDia, desc, id) {
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

//Config

function clickConfirColFil(e) {
  if (cols.value <= 0) {
    alert("tiene que especificar las columnas que tiene la calle");
    return;
  }
  if (mapFilas.value <= 0) {
    alert("tiene que especificar las filas que tiene la calle");
    return;
  }
  mapaCols = cols.value;
  mapFilas = mapFilas.value;
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
    str += "#Dia ";
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
  if (desc.value.trim().length > 0) str += "#" + desc.value.trim();

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
  desc.value = "";
}
function clickItemCalle(e) {
  //console.log(e.target);
  const $el = e.target,
    id = $el.dataset.id,
    idxy = id.split("_"),
    x = parseInt(idxy[1]),
    y = parseInt(idxy[2]),
    descDia = $el.dataset.descdia,
    descDiaAtt = descDia.split(" "),
    dia = parseInt(descDiaAtt[1]) | 0,
    ini = parseInt(descDiaAtt[2]?.split("(")[1]) | 0,
    fin = parseInt(descDiaAtt[4]?.split(")")[0]) | 0,
    col = $el.dataset.col,
    orienta = $el.dataset.orienta,
    desc = $el.dataset.desc;
  window.id.value = id;
  window.orientacion.value = orienta;
  window.dividir.value = col;
  window.desc.value = desc;
  window.diaLimpia.value = dia;
  window.horaIniLimpieza.value = ini;
  window.horaFinLimpieza.value = fin;
  $datos.classList.remove("none");
}

function pintaPantalla() {
  window.cols.value = parseInt(mapaCols);
  window.filas.value = mapFilas;
  document.documentElement.style.setProperty("--mapaCols", mapaCols);
  document.documentElement.style.setProperty("--mapaFilas", mapFilas);

  $mapa.innerHTML = "";

  let str = "",
    calle = "",
    orienta = "",
    clase = "",
    colstr = "",
    col = " ",
    descDia = "",
    desc = "",
    id = 1;

  for (let x = 0; x < mapFilas; x++) {
    //console.log(callejero[x]);
    for (let y = 0; y < mapaCols; y++) {
      if (!callejero[x] || !callejero[x][y]) {
        if (y === 1 || (y === 3) | (y === 5) | (y === 7)) {
          calle = "v";
          clase = "item-v";
        } else {
          calle = "h";
          clase = "item-h";
        }
        orienta = "";
        col = " ";
        descDia = "";
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
          if (y === 1 || (y === 3) | (y === 5) | (y === 7)) {
            calle = "v";
            clase = "item-v";
          } else {
            calle = "h";
            clase = "item-h";
          }
          orienta = "";
          col = " ";
          descDia = "";
          desc = "";
        }
        orienta = calle.substring(0, 1);
        const item = callejero[x][y].split("#");

        if (item[0].length >= 2) {
          colstr = callejero[x][y].substring(1, 2);
          if (colstr.trim().length === 0) {
            col = 3;
          } else {
            col = parseInt(colstr);
            calle += col.toString();
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
      }
      id = `id_${x}_${y}`;
      str += pintaCalle(calle, clase, descDia, col, id, orienta, desc);
    }
  }
  $mapa.innerHTML = str;
}
function pintaCalle(calle, clase, descDia, col, id, orienta, desc) {
  return `
      <article class="item-calle ${clase}" data-id=${id} data-descDia="${descDia}" data-col="${col}" data-orienta="${orienta}" data-desc="${desc}">
        ${calle}
      </article>
    `;
}
