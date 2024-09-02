const $miBarrio = window.miBarrio,
  $mapaCalles = document.get,
  $mapa = window.mapa,
  $datos = window.datos;
let llistaMapa = localStorage.getItem("llistaMapa")
    ? localStorage.getItem("llistaMapa")
    : "casa",
  nomMapa = llistaMapa.split(",")[0],
  nomCols = "",
  nomFilas = "",
  mapaCols = 0,
  mapaFilas = 0,
  callejero = "";

document.addEventListener("touchstart", (e) => {
  pulsa(e.target);
});

function CargarMapa() {
  nomCols = nomMapa + "Cols";
  nomFilas = nomMapa + "Filas";
  mapaCols = localStorage.getItem(nomCols) ? localStorage.getItem(nomCols) : 4;
  mapaFilas = localStorage.getItem(nomFilas)
    ? localStorage.getItem(nomFilas)
    : 4;
  callejero =
    localStorage.getItem(nomMapa) !== null
      ? localStorage
          .getItem(nomMapa)
          .split("|")
          .map((e) => e.split(","))
      : [
          ["h0", "v", "h", "v"],
          ["h#Dia 13 (8 a 12)#Hosp", "v", "h#Parque", "v"],
          ["h", "v", "h", "v1"],
          ["h", "v1", "h0", "v0"],
        ];
}

function PintaInicial() {
  document.documentElement.style.setProperty("--mapaCols", mapaCols);
  document.documentElement.style.setProperty("--mapaFilas", mapaFilas);
  pintaPantallaMapa();
  const aqui = localStorage.getItem("marcat"),
    fechaStr = localStorage.getItem("marcatData");
  if (aqui) {
    let $aqui = document.getElementById(aqui);
    if ($aqui) $aqui.classList.add("aqui");
    window.ultimaFichada.innerHTML = fechaStr;
    if (nomMapa) window.nomMapaActual.innerHTML = nomMapa + " - ";
  }
  pintaPantalla();
  LimpiaModif();
  llenaListaMapas();
}

document.addEventListener("click", (e) => {
  //console.log("click:", e, e.target);
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
  if (e.target.classList.contains("confirNouMapa")) {
    clickNuevoNomMapa(e);
    return;
  }

  pulsa(e.target);
});
document.addEventListener("DOMContentLoaded", (e) => {
  //ObtenVariablesIniciales();
  CargarMapa();
  PintaInicial();
  ControlFecha();
});

llistaMapas.addEventListener("change", (e) => {
  console.log("change", e.target.value);
  nomMapa = e.target.value;
  CargarMapa();
  PintaInicial();
  ControlFecha();
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
    ControlFecha();
  }
}

function pintaPantallaMapa() {
  let str = "",
    calle = "",
    colstr = "",
    col = mapaCols,
    descDia = "",
    desc = "",
    id = 1,
    diaLimpieza = "";

  for (let x = 0; x < mapaFilas; x++) {
    //console.log(callejero[x]);
    for (let y = 0; y < mapaCols; y++) {
      // if (!callejero[x][y]) break;
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
      diaLimpieza = "";
      if (item.length > 1) {
        if (item[1].length > 3 && item[1].substring(0, 3) === "Dia") {
          descDia = item[1];
          diaLimpieza = item[1].split(" ")[1];
        } else {
          desc = item[1];
          console.log("dia (desc)", desc);
        }
      }
      if (item.length > 2) {
        desc = item[2];
      }
      str += pintaCalleMapa(calle, col, descDia, desc, id, diaLimpieza);
      id += col;
    }
  }

  $miBarrio.innerHTML = str;
}

function pintaCalleMapa(calle, col, descDia, desc, id, diaLimpieza) {
  if (col === 0) {
    return `
      <article class="${calle} ">
      </article>
    `;
  }
  let str = `
      <article class="calle ${calle}" data-dialimpieza="${diaLimpieza}">
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

function ControlFecha() {
  const root = document.documentElement,
    fechaActual = new Date(),
    $aqui = document.querySelector(".aqui"),
    $calle = $aqui.closest(".calle");
  fechaActual.setHours(0, 0, 0, 0); // Establecer la hora, minutos, segundos y milisegundos a 0

  if (!$calle) return;

  let diaLimpia = $calle.dataset.dialimpieza;

  if (!diaLimpia) return;

  let diaLimpiaNum = parseInt(diaLimpia);
  let diaActual = fechaActual.getDate();
  let mesActual = fechaActual.getMonth(); // Los meses en JavaScript van de 0 (Enero) a 11 (Diciembre)
  let añoActual = fechaActual.getFullYear();
  let mesLimpia = mesActual;
  let añoLimpia = añoActual;

  if (diaLimpiaNum < diaActual) {
    // Si el día de limpieza es superior al día actual, usa el mes anterior
    mesLimpia += 1;
    if (mesLimpia > 11) {
      // Si el mes se convierte en negativo (es decir, pasamos de Enero al año anterior)
      mesLimpia = 0;
      añoLimpia += 1;
    }
  }

  let fechaLimpia = new Date(añoLimpia, mesLimpia, diaLimpiaNum);

  // Calcular la diferencia en días
  let diferenciaEnMilisegundos = fechaLimpia - fechaActual;
  let diferenciaEnDias = Math.floor(
    diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)
  );
  //let fecParquing = new Date(`${fec.getPropertyValue}`)

  console.log($calle, diaLimpia, diferenciaEnDias);
  //if ((fec = fechaStr)) {
  //  element.style.setProperty(
  //    "--colorFondo",
  //    element.style.getPropertyValue("--colorPeligor")
  //  );
  //}
  let color = getComputedStyle(root).getPropertyValue("--colorNormal");

  switch (true) {
    case diferenciaEnDias >= 0 && diferenciaEnDias <= 1:
      color = getComputedStyle(root).getPropertyValue("--colorPeligor");
      break;

    case diferenciaEnDias >= 2 && diferenciaEnDias <= 3:
      color = getComputedStyle(root).getPropertyValue("--colorAlerta");
      break;

    case diferenciaEnDias >= 4 && diferenciaEnDias <= 6:
      color = getComputedStyle(root).getPropertyValue("--colorPrecaucion");
      break;

    default:
      break;
  }
  root.style.setProperty("--colorFondo", color);
}

// ************************************
// ************** Config **************
// ************************************

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
  mapaFilas = filas.value;
  localStorage.setItem(nomCols, mapaCols);
  localStorage.setItem(nomFilas, mapaFilas);
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
    for (let i = 0; i < mapaCols; i++) {
      if (i === y) {
        if (i === 0) {
          callejero.push([str]);
        } else {
          callejero[x].push([str]);
        }
      } else {
        if (i === 1 || (i === 3) | (i === 5) | (i === 7)) {
          callejero[x].push(["v"]);
        } else {
          if (i === 0) {
            callejero.push(["h"]);
          } else {
            callejero[x].push(["h"]);
          }
        }
      }
    }
  } else {
    if (!callejero[x][y]) {
      callejero[x].push(str);
    } else {
      callejero[x][y] = str;
    }
  }

  localStorage.setItem(nomMapa, callejero.join("|"));
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
  window.filas.value = mapaFilas;
  document.documentElement.style.setProperty("--mapaCols", mapaCols);
  document.documentElement.style.setProperty("--mapaFilas", mapaFilas);

  $mapa.innerHTML = "a";

  let str = "",
    calle = "",
    orienta = "",
    clase = "",
    colstr = "",
    col = " ",
    descDia = "",
    desc = "",
    id = 1;

  for (let x = 0; x < mapaFilas; x++) {
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
        callejero[x][y] = calle;
        orienta = "";
        col = 3;
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
          callejero[x][y] = calle;
          orienta = "";
          col = 3;
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
      if (orienta === "") orienta = calle;
      id = `id_${x}_${y}`;
      str += pintaCalle(calle, clase, descDia, col, id, orienta, desc);
    }
  }
  localStorage.setItem(nomMapa, callejero.join("|"));
  $mapa.innerHTML = str;
}
function pintaCalle(calle, clase, descDia, col, id, orienta, desc) {
  return `
      <article class="item-calle ${clase}" data-id=${id} data-descDia="${descDia}" data-col="${col}" data-orienta="${orienta}" data-desc="${desc}">
        ${calle}
      </article>
    `;
}
function llenaListaMapas() {
  const $llistaMapas = window.llistaMapas;

  while ($llistaMapas.firstElementChild) {
    $llistaMapas.firstElementChild.remove();
  }

  llistaMapa.split(",").forEach((mapa) => {
    const map = document.createElement("option");
    map.setAttribute("value", mapa);
    if (nomMapa === mapa) {
      map.setAttribute("selected", true);
    }
    map.innerHTML = mapa;
    $llistaMapas.append(map);
  });
}
function clickNuevoNomMapa() {
  const valor = window.nomMapa.value.trim();
  if (valor.length === 0) {
    alert("Falta especificar el nombre del mapa");
    return;
  }
  if (llistaMapa.indexOf(valor) > -1) {
    alert("Ya existe el nombre del mapa");
    return;
  }
  llistaMapa += "," + valor;
  localStorage.setItem("llistaMapa", llistaMapa);
  nomMapa = valor;
  CargarMapa();
  PintaInicial();
}
