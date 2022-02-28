// Login

$("#btnLogin").click(() => {
  sessionStorage.setItem("usuarioLog", $("#usuario").val());
  sessionStorage.setItem("passwordLog", $("#password").val());
  $("#usuarioIngresado")
    .html(`${sessionStorage.getItem("usuarioLog")}`)
    .fadeIn(500);
  $("#login").delay(500).fadeOut(500);
});

// AJAX - API

const GETURL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false";

$.get(GETURL, function (respuesta, estado) {
  if (estado === "success") {
    let datos = respuesta;
    for (const dato of datos) {
      $("#contenedor").append(`
                <div class="tarjeta">
                <h1>${dato.name}</h1>
                <h2>Precio: ${dato.current_price} US$</h2>
                <h3>Capitalizacion de mercado: ${dato.market_cap} US$</h3>
                </div>`);
    }
    datos.forEach((data) => {
      $("select").append(
        `
          <option value= ${parseInt(
            data.current_price
          )} class="optionIntercambio">${data.symbol.toUpperCase()}</option>
          `
      );
    });
  }
});

// Main functions

function confirmacionOperacion() {
  $("#confirmacion").slideDown();
  $("#confirmacion").css("display", "flex");
  $("#confirmacion").html(`
    <p class = "mensajeConfirmacion">¿Desea confirmar la operacion?</p>
    <button id="btnCancelar" class="btn btn-danger">Cancelar</button>
    <button id="btnConfirmar" class="btn btn-dark">Confirmar</button>`);
  $("#btnConfirmar").click(function cerrarVentana() {
    registroOperacion();
    almacenamientoOperaciones();
    $("#confirmacion").css("display", "none");
  });
  $("#btnCancelar").click(function cerrarVentanaCancelar() {
    $("#confirmacion").css("display", "none");
  });

  borrarAuto();
}

function conversionGeneral() {
  return ($("#divisa1").val() * $("#cantDivisa1").val()) / $("#divisa2").val();
}

function conversion() {
  confirmacionOperacion();

  return `${sessionStorage.getItem(
    "usuarioLog"
  )}, usted ha obtenido ${conversionGeneral().toFixed(4)} ${$(
    "#divisa2 option:selected"
  ).text()}`;
}

function registroOperacion() {
  $("#registro").append(`<p class="operaciones">${conversion()}</p>`);
}

// Ejecucion de conversion

$("#convertir").click(function (e) {
  e.preventDefault();
  conversion();
});

$("#convertir").keyup(function (e) {
  if (e.code === "Enter") {
    e.preventDefault();
    conversion();
  }
});

// Limpieza de registro

function borrarRegistro() {
  $(".operaciones").fadeOut("slow");
}

$("#limpiar").click(borrarRegistro);

function borrarAuto() {
  for (let i = $(".operaciones").length; i > 15; i--) {
    $(".operaciones").remove();
  }
}

// Registro almacenado

function almacenamientoOperaciones() {
  let registroAlmacenado = JSON.stringify(conversion());
  $("#registroExtendido").append(
    `<span class="operacionesAlmacenadas">${registroAlmacenado}</span>`
  );
}

$("#mostrarRegistroCompleto").click(function () {
  $("#registroExtendido").slideDown("slow");

  $("#btnCerrar").show();

  $("#btnCerrar").click(function cerrarVentana() {
    $("#registroExtendido").slideUp("slow");
  });
});

$("#verPrecios").click(function () {
  $(".tarjeta").slideDown("slow");
  $("#verPrecios").hide();
});
