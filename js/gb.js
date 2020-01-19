"use strict"

import * as Gb from './gbapi.js'

// cosas que exponemos para usarlas desde la consola
window.populate = populate
window.Gb = Gb;
const U = Gb.Util;

// Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
Gb.connect("http://gin.fdi.ucm.es:8080/api/");

/**
 * Librería de cliente para interaccionar con el servidor de Garabatos.
 * Prácticas de IU 2019-20
 *
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas. Recomiendo separar el fichero en 2 partes:
 * - funciones que pueden generar cachos de contenido a partir del modelo, pero que no
 *   tienen referencias directas a la página
 * - un bloque rodeado de $(() => { y } donde está el código de pegamento que asocia comportamientos
 *   de la parte anterior con elementos de la página.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él, que es esencialmente
 * lo que quieras siempre y cuando no digas que lo escribiste tú o me persigas por haberlo escrito mal.
 */

// Variables globales
let listaEstudiantes = [];
let listaClases = [];
let listaProfesores = [];
let listaResponsables = [];

//FUNCIONES DE CREACION DE MENUS

window.loadAdminMenu = function adminMenu(tipo, mensaje) {
  try {
    if (tipo == null) {
      // Para salvar datos que se han quedado sin guardar
      saveDatas();
    }
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAdminMenu());
    if (mensaje != undefined) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert(tipo, mensaje));
    }
  } catch (e) {
    console.log('Error cargando el menu de administradores', e);
  }
}

window.loadProfessorMenu = function professorMenu() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createProfessorMenu());
  } catch (e) {
    console.log('Error cargando el menu de profesores', e);
  }
}

//Crea menu de administrador
function createAdminMenu() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu()">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores()">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos()">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div class="col-0 col-lg-1"></div>',
    '<div id="aviso" class="col-lg-6"></div>',
    '</div>',
    '<!-- Imagenes -->',
    '<div class="lineas2 mt-5">',
    '<div class=" row d-flex justify-content-center align-content-center">',
    '<div class="col-lg-6 ">',
    '<div class="row  d-flex justify-content-center align-content-center">',
    '<div class="d-none d-lg-block col-lg-1"></div>',
    '<div class="col-md-12 col-lg-4" onclick="window.loadProfesores()">',
    '<a role="button" class="enlacesMenu">',
    '<img src="imagenes/profesor.png" alt="" class="img-fluid">',
    '<h1 class="text-center">Profesores</h1>',
    '</a>',
    '</div>',
    '<div class="d-none d-lg-block col-lg-1"></div>',
    '<div class="col-md-12 col-lg-4" onclick="window.loadAlumnos()">',
    '<a role="button" class="enlacesMenu">',
    '<img src="imagenes/alumnos.png" alt="" class="img-fluid">',
    '<h1 class="text-center">Alumnos</h1>',
    '</a>',
    '</div>',
    '</div>',
    '<div class="row d-flex justify-content-center align-content-center">',
    '<div class="col-lg-1 d-none d-lg-block"></div>',
    '<div class="col-md-12 col-lg-4" onclick="window.loadResponsables()">',
    '<a role="button" class="enlacesMenu">',
    '<img src="imagenes/padres.png" alt="" class="img-fluid">',
    '<h1 class="text-center">Responsables</h1>',
    '</a>',
    '</div>',
    '<div class="col-lg-1 d-none d-lg-block"></div>',
    '<div class="col-md-12 col-lg-4" onclick="window.loadClases()">',
    '<a role="button" class="enlacesMenu">',
    '<img src="imagenes/aula.png" alt="" class="img-fluid">',
    '<h1 class="text-center">Clases</h1>',
    '</a>',
    '</div>',
    '</div>',
    '</div>',
    '<div class="col-lg-6 d-flex justify-content-center align-items-center" onclick="window.loadMenuMensajes()">',
    '<a role="button" class="enlacesMenu">',
    '<img src="imagenes/unread.png" alt="" class="img-fluid" width="350px">',
    '<h1 class="text-center">Mensajes</h1>',
    '</a>',
    '</div>',
    '</div>',
    '</div>',
  ];
  return $(html.join(''));
}

//Crea menu de profesores
function createProfessorMenu() {
  let html = [
    '<!--Barra de navegacion-->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Profesor</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos()">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!--Este grid-->',
    '<div class=" lineas row d-flex justify-content-center align-items-center mt-5">',
    '<!--Alumnos-->',
    '<div class="col-lg-3 col-md-4 col-12">',
    '<a role="button" onclick="window.loadAlumnos()" class="enlacesMenu">',
    '<img src="imagenes/alumnos.png" alt="" class="img-fluid">',
    '<h1 class="text-center">Alumnos</h1>',
    '</a>',
    '</div>',
    '<!--Padres-->',
    '<div class="d-none d-lg-block col-lg-1"></div>',
    '<div class="col-lg-3 col-md-4 col-12">',
    '<a role="button" onclick="window.loadResponsables()" class="enlacesMenu">',
    '<img src="imagenes/padres.png" alt="" class="img-fluid">',
    '<h1 class="text-center">Responsables</h1>',
    '</a>',
    '</div>',
    '<!--Mensajes-->',
    '<div class="d-none d-lg-block col-lg-1"></div>',
    '<div class="col-lg-3 col-md-4 col-12">',
    '<a role="button" onclick="window.loadMenuMensajes()" class="enlacesMenu">',
    '<img src="imagenes/unread.png" alt="" class=" img-fluid">',
    '<h1 class="text-center">Mensajes</h1>',
    '</a>',
    '</div>',
    '</div>'
  ];
  return $(html.join(''));
}

//FIN FUNCIONES DE CREACION DE MENUS

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES DEL INICIO DE SESION

window.loadLogin = function loadLogin() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createLogin());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

var usuarioIniciado = "noIniciado";

window.login = function login() {
  let usuario = $("#idUsuario").val();
  let contras = $("#contrasena").val();
  Gb.login(usuario, contras).then(d => {
    let u = Gb.resolve(usuario);
    if (u !== undefined && usuarioIniciado == "noIniciado") {
      // la operación ha funcionado (u es el usuario que ha conseguido hacer login)
      usuarioIniciado = u;
      if (usuarioIniciado.type == Gb.UserRoles.ADMIN) {
        window.loadAdminMenu();
      } else if (usuarioIniciado.type == Gb.UserRoles.TEACHER) {
        window.loadProfessorMenu();
      }
    } else {
      // ha habido un error (u ha vuelto como undefined; en la consola se verá qué ha pasado)
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "Usuario o contraseña incorrectos"));
      $("#contrasena").val("")
    }
  });

}

window.cerrarSesion = function cerrarSesion() {
  try {
    // y lo volvemos a rellenar con su nuevo contenido
    Gb.logout(usuarioIniciado.uid).then(d => {
      if (d !== undefined) {
        usuarioIniciado = "noIniciado";
        $("#contenido").empty();
        $("#contenido").append(createLogin());
      } else { }

    });
  } catch (e) {
    console.log('Error cargando el login', e);
  }
}

function createLogin() {
  let html = [
    '<div class="container">',
    '<div class="row d-flex justify-content-center mt-5 pt-5">',
    '<div class="col-0 col-lg-1"></div>',
    '<div class="col-lg-6">',
    '<h1 class="display-1 text-center w-100 big-title">Garabato</h1>',
    '</div>',
    '</div>',
    '<div>',
    '<div class="row d-flex justify-content-center mt-4">',
    '<div class="col-lg-1">Usuario:</div>',
    '<div class="col-lg-6">',
    '<input type="text" name="" id="idUsuario" class="w-100">',
    '</div>',
    '</div>',
    '<div class="row mt-3 d-flex justify-content-center">',
    '<div class="col-lg-1">Contraseña:</div>',
    '<div class="col-lg-6">',
    '<input type="password" name="" id="contrasena" class="w-100">',
    '</div>',
    '</div>',
    '<div class="row mt-3 d-flex justify-content-center">',
    '<div class="col-0 col-lg-1"></div>',
    '<div class="col-lg-6">',
    '<button class="w-100 btn btn-success" onclick="window.login()">Iniciar Sesión</button>',
    '</div>',
    '</div>',
    '<div class="row d-flex justify-content-center">',
    '<div class="col-0 col-lg-1"></div>',
    '<div class="col-lg-6">',
    '<button class="text-left w-100 btn btn-link">Recuperar contraseña</button>',
    '</div>',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div class="col-0 col-lg-1"></div>',
    '<div id="aviso" class="col-lg-6"></div>',
    '</div>',
    '</div>'
  ];
  return (html.join(''));
}

//FIN DE FUNCIONES DE INICIO DE SESIÓN

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONALIDADES DE CLASE

//Funcion para crear una nueva clase
window.crearClase = function crearClase() {
  if (/^(.+( .+)*)$/.test($("#inputNombre").val())) {
    let clase = new Gb.EClass(
      $("#inputNombre").val()
    );
    Gb.addClass(clase).then(d => {
      if (d !== undefined) {
        // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
        Gb.set(clase).then(d1 => {
          if (d1 !== undefined) {
            $("#aviso").empty();
            $("#aviso").append(sendAlert("OK", "La clase se ha añadido correctamente"));
            $("#inputNombre").val("");
          } else {
            // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
            $("#aviso").empty();
            $("#aviso").append(sendAlert("KO", "La clase no se ha podido añadir, inténtalo de nuevo"));
          }
        });
      } else {
        // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
        $("#aviso").empty();
        $("#aviso").append(sendAlert("KO", "La clase no se ha podido añadir, inténtalo de nuevo"));
      }
    });
  } else {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El nombre de la clase no es válido"));
  }
}

window.loadClases = function loadClases(tipo, mensaje) {

  try {
    // Para distinguir si hemos llegado por click en la barra de navegacion o por otra funcion
    if (tipo == null) {
      //debugger;
      // Para salvar datos que se han quedado sin guardar
      saveDatas();
    }
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createClases());
    if (mensaje != undefined) {
      $("#aviso2").empty();
      $("#aviso2").append(sendAlert(tipo, mensaje));
    }
  } catch (e) {
    console.log('Error cargando las clases', e);
  }
}

//Funcion que crea la ventana de crear clase
function createClases() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu()">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso2" class="col-md-8"></div>',
    '</div>',
    '<div class="container">',
    '<h1 class="text-center font-weight-bold pt-1 mb-0 display-3 pb-0">Clases</h1>',
    '<div class="card-body pt-0">',
    '<div class="row d-flex justify-content-end">',
    '<button id="boton-add" class="btn" onclick="window.loadAddClases()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/add.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="input-group mb-2">',
    '<input id="miBuscador" type="text" class="form-control" onkeyup="myTableFilter()" placeholder="Search">',
    '<div class="input-group-append">',
    '<select id="filtro" class="bg-info text-white text-center" name="OS">',
    '<option value="0">Nombre</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="table-wrapper-scroll-y my-custom-scrollbar">',
    '<div id="table" class="table-editable">',
    '<table class="table table-bordered table-responsive-md table-striped table-dark text-center" id="miTabla">',
    '<thead>',
    '<tr class="headerTabla">',
    '<th class="text-center">Nombre</th>',
    '<th class="text-center">Eliminar</th>',
    '</tr>',
    '</thead>',
    '<tbody>',
  ]
  //FUNCION CARGAR CLASES
  html.push(cargarClases());

  html.push(
    '</tbody>',
    '</table>',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso2" class="col-md-8"></div>',
    '</div>',
    '<!--Botonerade cancelar y guardar-->',
    '<div class="row mt-3 d-flex justify-content-end">',
    '<div>',
    '<button id="boton-cancelar" class="btn" onclick="window.cancelarClase()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.guardarClases()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  );

  return $(html.join(''));
}

function cargarClases() {
  let html = [];
  for (let i in Gb.globalState.classes) {
    //console.log("Que es la i: " + Gb.globalState.classes[i].cid);
    html.push(
      '<tr>',
      '<td class="pt-3-half">', Gb.globalState.classes[i].cid, '</td>',
      '<td>',
      '<div class="table-remove card text-white bg-danger">',
      '<div class="card-header">',
      '<a id="boton-remove" class="tituloSeccion" role="button" onclick="(window.eliminarClase(', "'" + Gb.globalState.classes[i].cid + "'", '))">',
      'Remove',
      '</a>',
      '</div>',
      '</div>',
      '</td>',
      '</tr>',
    )
  }
  return (html.join(''));
}

//Funcion que carga la ventana de crear clase
window.loadAddClases = function loadAddClases() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAddClases());
    window.loadInputClases();
  } catch (e) {
    console.log('Error cargando añadir clases', e);
  }
}

function createAddClases() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu()">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!--Empieza el formulario de la pagina-->',
    '<div class="container justify-content-center align-items-center mt-5">',
    '<div class="row justify-content-center align-items-center">',
    '<div class="col-md-8">',
    '<h2 class="display-4 text-center mt-3">Añadir Clase</h2>',
    '</div>',
    '</div>',
    '<div class="justify-content-center">',
    '<div class="pl-5 pr-4 pt-3">',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputNombre">Nombre:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputNombre">',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-4 text-left">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadClases()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/arrow.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="col-md-4 text-right">',
    '<button id="boton-guardar" class="btn" onclick="window.crearClase()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'
  ]
  return $(html.join(''));
}

function groupInputClass() {
  let html = [];
  for (let c in Gb.globalState.classes) {
    html.push('<option>', Gb.globalState.classes[c].cid, '</option>');
  }
  return (html.join(''));
}

// Refrescar las clases existentes
window.loadInputClases = function loadInputClases() {
  try {
    // vaciamos un contenedor
    $("#inputClase").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#inputClase").append(inputClass());
  } catch (e) {
    console.log('Error actualizando', e);
  }
}

function inputClass() {
  let html = [];
  console.log("Todas las clases");
  console.log(Gb.globalState.classes);
  for (let c in Gb.globalState.classes) {
    console.log("Clase " + c);
    html.push('<option>', Gb.globalState.classes[c].cid, '</option>');
  }
  return $(html.join(''));
}

//FIN DE FUNCIONALIDADES DE CLASE

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES DE ALUMNOS

//Funcion para crear un nuevo alumno
window.crearAlumno = function crearAlumno() {
  let responsables = [];
  let res1 = null,
    res2 = null,
    res3 = null;
  if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test($("#inputIDAlumno").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID no es válido"));
    return;
  }
  if (!/^[a-zA-Zñáéíóú]+( [a-zA-Zñáéíóú]+)*$/.test($("#inputNombreAlumno").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El nombre no es válido"));
    return;
  }
  if (!/^[a-zA-Zñáéíóú]+( [a-zA-Zñáéíóú]+)*$/.test($("#inputApellidosAlumno").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El apellido no es válido"));
    return;
  }
  if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test($("#res1").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID  del responsable 1 no es válido"));
    return;
  } else res1 = $("#res1").val();
  if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test($("#res2").val()) && !/^\s*$/.test($("#res2").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID  del responsable 2 no es válido"));
    return;
  } else res2 = $("#res2").val();
  if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test($("#res3").val()) && !/^\s*$/.test($("#res3").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID  del responsable 3 no es válido"));
    return;
  } else res3 = $("#res3").val();
  if (Gb.resolve($("#inputIDAlumno").val()) != undefined) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID ya existe"));
    return;
  }
  if (res1 != null) {
    if (Gb.resolve(res1) != undefined) {
      responsables.push(res1);
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No existe el responsable 1"));
      return;
    }
  }
  if (res2 != null && !/^\s*$/.test(res2)) {
    if (Gb.resolve(res2) != undefined) {
      responsables.push(res2);
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No existe el responsable 2"));
      return;
    }
  }
  if (res3 != null && !/^\s*$/.test(res3)) {
    if (Gb.resolve(res3) != undefined) {
      responsables.push(res3);
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No existe el responsable 3"));
      return;
    }
  }
  let alumno = new Gb.Student(
    $("#inputIDAlumno").val(),
    $("#inputNombreAlumno").val(),
    $("#inputApellidosAlumno").val(),
    $("#inputClase").val(),
    responsables
  );

  Gb.addStudent(alumno).then(d => {
    if (d !== undefined) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("OK", "Se ha creado correctamente"));
      // Limpio los datos
      $("#inputIDAlumno").val("");
      $("#inputNombreAlumno").val("");
      $("#inputContra").val("");
      $("#inputApellidosAlumno").val("");
      $("#inputClase").val("");
      $("#res1").val("");
      $("#res2").val("");
      $("#res3").val("");
      // Para confirmar que se ha guardado bien
      Gb.set(alumno).then(d1 => {
        if (d1 !== undefined) {
          // Guardo el nuevo alumno en los responsables correspondientes
          for (let res of responsables) {
            let responsable = Gb.resolve(res);
            responsable.students.push(alumno.sid);
            Gb.set(responsable);
          }
          window.loadAlumnos("OK", "Se ha creado correctamente el alumno con ID: " + $("#inputIDAlumno").val());
        } else {
          $("#aviso").empty();
          $("#aviso").append(sendAlert("KO", "No se ha podido crear el alumno"));
        }
      });
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No se ha podido crear el alumno"));
    }
  });
}

window.loadAddAlumnos = function loadAddAlumnos() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAddAlumnos());
    window.loadInputClases();
  } catch (e) {
    console.log('Error cargando añadir alumnos', e);
  }
}

function createAddAlumnos() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu()">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<div class="container justify-content-center align-items-center">',
    '<div class="row justify-content-center align-items-center">',
    '<div class="col-md-6">',
    '<h2 class="display-4 text-center mt-3">Añadir Alumno</h2>',
    '</div>',
    '</div>',
    '<div class="justify-content-center">',
    '<div class="pl-5 pr-4 pt-3">',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputIDAlumno">ID:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputIDAlumno">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputNombreAlumno">Nombre:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputNombreAlumno">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputApellidosAlumno">Apellidos:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputApellidosAlumno">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputClase">Clase:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<select id="inputClase" class="form-control">',
    '</select>',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputRes">Responsables:</label>',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="res1" placeholder="Res 1">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="res2" placeholder="Res 2 (Opcional)">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="res3" placeholder="Res 3 (Opcional)">',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-4 text-left">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadAlumnos()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/arrow.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="col-md-4 text-right">',
    '<button id="boton-guardar" class="btn" onclick="window.crearAlumno()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  ];
  return $(html.join(''));
}

window.loadAlumnos = function loadAlumnos(tipo, mensaje) {
  try {
    // Para distinguir si hemos llegado por click en la barra de navegacion o por otra funcion
    if (tipo == null) {
      // Para salvar datos que se han quedado sin guardar
      saveDatas();
    }
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAlumnos());

    // Para mostrar un mensaje informativo
    if (mensaje != undefined) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert(tipo, mensaje));
    }
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

function createAlumnos() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu()">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores()">Profesores</a>',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadAlumnos()">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<div class="container">',
    '<h1 class="text-center font-weight-bold pt-1 mb-0 display-3 pb-0">Alumnos</h1>',
    '<div class="card-body pt-0">',
    '<div class="row d-flex justify-content-end">',
    '<button id="boton-add" class="btn" onclick="window.loadAddAlumnos()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/add.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="input-group mb-2">',
    '<input id="miBuscador" type="text" class="form-control" onkeyup="myTableFilter()" placeholder="Search">',
    '<div class="input-group-append">',
    '<select id="filtro" class="bg-info text-white text-center" name="OS">',
    '<option value="0">ID</option>',
    '<option value="1">Nombre</option>',
    '<option value="2">Apellidos</option>',
    '<option value="3">Clase</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="table-wrapper-scroll-y my-custom-scrollbar">',
    '<div id="miTabla" class="table-editable">',
    '<table class="table table-bordered table-responsive-md table-striped table-dark text-center" id="miTabla">',
    '<thead>',
    '<tr class="headerTabla">',
    '<th class="text-center">ID</th>',
    '<th class="text-center">Nombre</th>',
    '<th class="text-center">Apellidos</th>',
    '<th class="text-center">Clase</th>',
    '<th class="text-center">Responsables</th>',
    '<th class="text-center">Eliminar</th>',
    '</tr>',
    '</thead>',
    '<tbody>'
  ]
  html.push(createGroupAlumnos());
  html.push(
    '</tbody>',
    '</table>',
    '</div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row mt-3 d-flex justify-content-end">',
    '<div>',
    '<button id="boton-cancelar" class="btn" onclick="window.cancelarAlumno()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.guardarAlumnos()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  )
  return $(html.join(''));
}

function createGroupAlumnos() {
  let html = [];
  let idGrupo;
  for (let i in Gb.globalState.students) {
    idGrupo = 'r_' + Math.floor(Math.random() * 10000000);
    html.push('<tr >',
      '<td class="pt-3-half" contenteditable="false">', Gb.globalState.students[i].sid, '</td>',
      '<td class="pt-3-half" contenteditable="true">', Gb.globalState.students[i].firstName, '</td>',
      '<td class="pt-3-half" contenteditable="true">', Gb.globalState.students[i].lastName, '</td>',
      '<td class="pt-3-half" contenteditable="true">', Gb.globalState.students[i].cid, '</td>',
      '<td>',
      '<div class="row">',
      '<div class="col-xl-8">',
      '<div class="card text-white bg-dark">',
      '<div class="card-header">',
      '<a class="tituloSeccion" data-toggle="collapse"',
      'href="#', idGrupo, '" role="button"',
      'aria-controls="', idGrupo, '">',
      'Ver Responsables',
      '</a>',
      '</div>',
      '<div class="collapse" id="', idGrupo, '">',
      '<ul class="list-group list-group-flush">');
    // Lista de responsables
    html.push(createDesplegableResponsables(Gb.globalState.students[i].guardians));
    html.push(
      '</ul>',
      '</div>',
      '</div>',
      '</div>',
      '<div class="col-xl-4">',
      '<div class="card text-white bg-info">',
      '<div class="card-header">',
      '<a class="tituloSeccion" role="button">',
      'Editar',
      '</a>',
      '</div>',
      '</div>',
      '</div>',
      '</td>',
      '<td>',
      '<div class="table-remove card text-white bg-danger">',
      '<div class="card-header">',
      '<a id="boton-remove" class="tituloSeccion" role="button" onclick="(window.eliminarAlumno(', "'" + Gb.globalState.students[i].sid + "'", '))">',
      'Remove',
      '</a>',
      '</div>',
      '</div>',
      '</td>',
      '</tr>'
    );
  }
  return (html.join(''));
}

// Funcion que hace el desplegable de los responsables
function createDesplegableResponsables(responsables) {
  let html = [];
  for (let i in responsables) {
    html.push(
      '<li class="list-group-item bg-dark">',
      '<div class="row" id="',
      responsables[i],
      '">');
    html.push(Gb.resolve(responsables[i]).first_name);
    html.push(
      '</div>',
      '</li>'
    );
  }
  return (html.join(''));
}

//FIN FUNCIONES DE ALUMNOS

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES DE RESPONSABLES

// Logica de crear un nuevo responsable
window.crearResponsable = function crearResponsable() {
  let listaTelefonos = [];
  if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test($("#inputID").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID no es válido"));
    return;
  }
  if (!/^(.+( .+)*)$/.test($("#inputContra").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "La contraseña no es válida"));
    return;
  }
  if (!/^[a-zA-Zñáéíóú]+( [a-zA-Zñáéíóú]+)*$/.test($("#inputNombre").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El nombre no es válido"));
    return;
  }
  if (!/^[a-zA-Zñáéíóú]+( [a-zA-Zñáéíóú]+)*$/.test($("#inputApellidos").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El apellido no es válido"));
    return;
  }
  let telefonos = $('input[name="telefonos"]').map(function () {
    return $(this).val();
  }).get();
  for (let telefono in telefonos) {
    if (!/^(\s*\w+.*)/.test(telefonos[telefono])) {

    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/.test(telefonos[telefono])) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "El teléfono " + telefonos[telefono] + " no es válido"));
      return;
    } else listaTelefonos.push(telefonos[telefono]);
  }
  if (listaTelefonos.length < 1) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "Al menos un telefono debe de ser válido"));
    return;
  }
  if (Gb.resolve($("#inputID").val()) != undefined) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID ya existe"));
    return;
  }
  let responsable = new Gb.User(
    $("#inputID").val(),
    Gb.UserRoles.GUARDIAN,
    $("#inputNombre").val(),
    $("#inputApellidos").val(),
    listaTelefonos,
    [],
    [],
    $("#inputContra").val()
  );

  //Pushes user to globalstate.
  Gb.addUser(responsable).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      $("#aviso").empty();
      $("#aviso").append(sendAlert("OK", "Se ha creado correctamente"));
      // Limpio los datos
      $("#inputID").val("");
      $("#inputNombre").val("");
      $("#inputContra").val("");
      $("#inputApellidos").val("");
      $("#telf1").val("");
      $("#telf2").val("");
      $("#telf3").val("");
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No se ha podido crear el responsable"));
    }
  });
}

window.loadAddResponsable = function loadAddResponsable() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAddResponsable());
  } catch (e) {
    console.log('Error cargando añadir responsable', e);
  }
}

function createAddResponsable() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu(' + "null" + ')">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link  active" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<div class="container justify-content-center align-items-center">',
    '<div class="row justify-content-center align-items-center">',
    '<div class="col-md-8">',
    '<h2 class="display-4 text-center mt-3">Añadir Responsable</h2>',
    '</div>',
    '</div>',
    '<div class="justify-content-center">',
    '<div class="pl-5 pr-4 pt-3">',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputID">ID:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputID">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputContra">Contraseña:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="password" class="form-control" id="inputContra">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputNombre">Nombre:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputNombre">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputApellidos">Apellidos:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputApellidos">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputDNI">Teléfonos:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" name="telefonos" placeholder="Teléfono">',
    '</div>',
    '<div class="col-md-8">',
    '<div class="row">',
    '<div class="col-md-3 pt-2">',
    '<button type="button" class="btn btn-secondary" onclick="window.addCuadroTelefono()">Añadir Teléfono</button>',
    '</div>',
    '<div class="col-md-9" id="contenedorTelefonos"></div>',
    '</div>',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-4 text-left">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadResponsables()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/arrow.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="col-md-4 text-right">',
    '<button id="boton-guardar" class="btn" onclick="window.crearResponsable()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  ];
  return $(html.join(''));
}

window.loadEditarTelefonosResponsable = function loadEditarTelefonosResponsable(id) {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let elemento = window.buscarEntidad(id);
    $("#contenido").append(createEditarTelefonos(elemento, "responsable"));
  } catch (e) {
    console.log('Error cargando editar teléfonos de un responsable', e);
  }
}

window.editarTelefonos = function editarTelefonos(tipo, id) {
  debugger;
  let listaTelefonos = [];
  let telefonos = $('input[name="telefonos"]').map(function () {
    return $(this).val();
  }).get();
  for (let telefono in telefonos) {
    if (!/^(\s*\w+.*)/.test(telefonos[telefono])) {

    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/.test(telefonos[telefono])) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "El teléfono " + telefonos[telefono] + " no es válido"));
      return;
    } else listaTelefonos.push(telefonos[telefono]);
  }
  if (listaTelefonos.length < 1) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "Al menos un telefono debe de ser válido"));
    return;
  }
  let elemento = window.buscarEntidad(id);
  elemento.tels = listaTelefonos;
  Gb.set(elemento).then(d => {
    if (d !== undefined) {
      if (tipo == "responsable") {
        window.loadResponsables("OK", "Se han actualizado los teléfonos del responsable:" + elemento.uid)
      } else if (tipo == "profesor") {
        window.loadResponsables("OK", "Se han actualizado los teléfonos del profesor:" + elemento.uid)
      }
    } else {
      if (tipo == "responsable") {
        window.loadResponsables("KO", "No se han actualizado los teléfonos del responsable:" + elemento.uid)
      } else if (tipo == "profesor") {
        window.loadResponsables("KO", "No se han actualizado los teléfonos del profesor:" + elemento.uid)
      }
    }
  });

}

function createEditarTelefonos(elemento, tipo) {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu(' + "null" + ')">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link  active" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<div class="container justify-content-center align-items-center">',
    '<div class="row justify-content-center align-items-center">',
    '<div class="col-md-8">',
    '<h2 class="display-4 text-center mt-3">Editar Teléfonos del ', tipo, ": ", elemento.uid, '</h2>',
    '</div>',
    '</div>',
    '<div class="justify-content-center">',
    '<div class="pl-5 pr-4 pt-3">',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputDNI">Teléfonos:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" name="telefonos" placeholder="Teléfono" value="', elemento.tels[0], '">',
    '</div>',
    '<div class="col-md-8">',
    '<div class="row">',
    '<div class="col-md-3 pt-2">',
    '<button type="button" class="btn btn-secondary" onclick="window.addCuadroTelefono()">Añadir Teléfono</button>',
    '</div>',
    '<div class="col-md-9" id="contenedorTelefonos">'
  ]
  for (let i = 1; i < elemento.tels.length; ++i) {
    html.push(
      '<div class="pt-2">',
      '<input type="text" class="form-control" name="telefonos" placeholder="Teléfono" value="', elemento.tels[i], '">',
      '</div>')
  }
  html.push(
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-4 text-left">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadResponsables()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/arrow.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="col-md-4 text-right">',
    '<button id="boton-guardar" class="btn" onclick="window.editarTelefonos(\'' + tipo + '\',\'' + elemento.uid, '\')">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  );
  return $(html.join(''));
}

window.loadEditarAlumnos = function loadEditarAlumnos(id) {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let elemento = window.buscarEntidad(id);
    $("#contenido").append(createEditarAlumnos(elemento));
  } catch (e) {
    console.log('Error cargando editar alumnos de un responsable', e);
  }
}

window.editarAlumnos = function editarAlumnos(id) {
  debugger;
  let listaAlumnos = [];
  let listaDefinitiva = [];
  let listaBorrar = [];
  let alumnos = $('input[name="alumnos"]').map(function () {
    return $(this).val();
  }).get();
  for (let alumno in alumnos) {
    if (!/^(\s*\w+.*)/.test(alumnos[alumno])) {

    } else if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test(alumnos[alumno])) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "El alumno " + alumnos[alumno] + " no es válido"));
      return;
    } else listaAlumnos.push(alumnos[alumno]);
  }
  let elemento = window.buscarEntidad(id);
  let aux;
  for (let alumno in elemento.students) {
    if (listaAlumnos.includes(elemento.students[alumno])) listaDefinitiva.push(elemento.students[alumno]);
    else {
      aux = window.buscarEntidad(elemento.students[alumno]);
      if (aux.guardians.length > 1) listaBorrar.push(elemento.students[alumno]);
      else {
        $("#aviso").empty();
        $("#aviso").append(sendAlert("KO", "El alumno " + elemento.students[alumno] + " no se puede borrar, eres su único responsable"));
        return;
      }
    }
  }
  for (let alumno in listaAlumnos) {
    if (!elemento.students.includes(listaAlumnos[alumno])) {
      aux = window.buscarEntidad(listaAlumnos[alumno]);
      if (aux != undefined) listaDefinitiva.push(listaAlumnos[alumno]);
      else {
        $("#aviso").empty();
        $("#aviso").append(sendAlert("KO", "El alumno " + listaAlumnos[alumno] + " no existe"));
        return;
      }
    }
  }
  for (let alumno in listaDefinitiva) {
    aux = window.buscarEntidad(listaDefinitiva[alumno]);
    if (!aux.guardians.includes(elemento.uid)) {
      aux.guardians.push(elemento.uid);
      Gb.set(aux);
    }
  }
  for (let alumno in listaBorrar) {
    aux = window.buscarEntidad(listaBorrar[alumno]);
    if (aux.guardians.includes(elemento.uid)) {
      var i = aux.guardians.indexOf(elemento.uid);
      aux.guardians.splice(i, 1);
      Gb.set(aux);
    }
  }
  elemento.students = listaDefinitiva;
  Gb.set(elemento).then(d => {
    if (d !== undefined) {
      window.loadResponsables("OK", "Se han actualizado los alumnos del responsable:" + elemento.uid)
    } else {
      window.loadResponsables("KO", "No se han actualizado los alumnos del responsable:" + elemento.uid)
    }
  });

}

function createEditarAlumnos(elemento) {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu(' + "null" + ')">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link  active" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<div class="container justify-content-center align-items-center">',
    '<div class="row justify-content-center align-items-center">',
    '<div class="col-md-8">',
    '<h2 class="display-4 text-center mt-3">Editar Alumnos del responsable: "', elemento.uid, '</h2>',
    '</div>',
    '</div>',
    '<div class="justify-content-center">',
    '<div class="pl-5 pr-4 pt-3">',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputDNI">Teléfonos:</label>',
    '</div>',
    '<div class="col-md-6">'
  ]
  if (elemento.students.length > 0) {
    html.push('<input type="text" class="form-control" name="alumnos" placeholder="Alumno" value="', elemento.students[0], '">')
  } else {
    html.push('<input type="text" class="form-control" name="alumnos" placeholder="Alumno">')
  }
  html.push('</div>',
    '<div class="col-md-8">',
    '<div class="row">',
    '<div class="col-md-3 pt-2">',
    '<button type="button" class="btn btn-secondary" onclick="window.addCuadroAlumno()">Añadir Alumno</button>',
    '</div>',
    '<div class="col-md-9" id="contenedorAlumnos">')
  for (let i = 1; i < elemento.students.length; ++i) {
    html.push(
      '<div class="pt-2">',
      '<input type="text" class="form-control" name="alumnos" placeholder="Alumno" value="', elemento.students[i], '">',
      '</div>')
  }
  html.push(
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-4 text-left">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadResponsables()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/arrow.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="col-md-4 text-right">',
    '<button id="boton-guardar" class="btn" onclick="window.editarAlumnos(\'' + elemento.uid, '\')">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  );
  return $(html.join(''));
}

window.loadResponsables = function loadResponsables(tipo, mensaje) {
  try {
    if (tipo == null) {
      // Para salvar datos que se han quedado sin guardar
      saveDatas();
    }
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createResponsables());
    if (mensaje != undefined) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert(tipo, mensaje));
    }
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

// Crea un nuevo responsable
function createResponsables() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu(' + "null" + ')">',
    '<h1 class="d-inline align-self-start text-white text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div class="col-0 col-lg-1"></div>',
    '<div id="aviso" class="col-lg-6"></div>',
    '</div>',
    '<div class="container">',
    '<h1 class="text-center font-weight-bold pt-1 mb-0 display-3 pb-0">Responsables</h1>',
    '<div class="card-body pt-0">',
    '<div class="row d-flex justify-content-end">',
    '<button id="boton-add" class="btn" onclick="window.loadAddResponsable()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/add.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="input-group mb-2">',
    '<input id="miBuscador" type="text" class="form-control" onkeyup="myTableFilter()" placeholder="Search">',
    '<div class="input-group-append">',
    '<select id="filtro" class="bg-info text-white text-center" name="OS">',
    '<option value="0">ID</option>',
    '<option value="1">Nombre</option>',
    '<option value="2">Apellidos</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="table-wrapper-scroll-y my-custom-scrollbar">',
    '<div id="miTabla" class="table-editable ">',
    '<table class="table table-bordered table-responsive-md table-striped table-dark text-center" id="miTabla">',
    '<thead>',
    '<tr class="headerTabla">',
    '<th class="text-center">ID</th>',
    '<th class="text-center">Nombre</th>',
    '<th class="text-center">Apellidos</th>',
    '<th class="text-center">Teléfonos</th>',
    '<th class="text-center">Alumnos</th>',
    '<th class="text-center">Eliminar</th>',
    '</tr>',
    '</thead>',
    '<tbody>'
  ];
  //FUNCION QUE LLAMA A CADA FILA
  html.push(createGroupResponsables());
  html.push(
    '</tbody>',
    '</table>',
    '</div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row mt-3 d-flex justify-content-end">',
    '<div>',
    '<button id="boton-cancelar" class="btn" onclick="window.cancelarResponsable()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.guardarResponsables()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  );
  return $(html.join(''));
}

function createGroupResponsables() {
  let html = [];
  let idGrupoTelefonos;
  let idGrupoAlumnos;
  for (let i in Gb.globalState.users) {
    if (Gb.globalState.users[i].type != undefined && Gb.globalState.users[i].type == Gb.UserRoles.GUARDIAN) {
      idGrupoTelefonos = 't_' + Math.floor(Math.random() * 10000000);
      idGrupoAlumnos = 'a_' + Math.floor(Math.random() * 10000000);
      html.push(
        '<tr>',
        '<td class="pt-3-half" contenteditable="false">', Gb.globalState.users[i].uid, '</td>',
        '<td class="pt-3-half" contenteditable="true">', Gb.globalState.users[i].first_name, '</td>',
        '<td class="pt-3-half" contenteditable="true">', Gb.globalState.users[i].last_name, '</td>',
        '<td>',
        '<div class="row">',
        '<div class="col-xl-7">',
        '<div class="card text-white bg-dark">',
        '<div class="card-header">',
        '<a class="tituloSeccion" data-toggle="collapse"',
        'href="#', idGrupoTelefonos, '" role="button"',
        'aria-controls="', idGrupoTelefonos, '">',
        'Ver Teléfonos',
        '</a>',
        '</div>',
        '<div class="collapse" id="', idGrupoTelefonos, '">',
        '<ul class="list-group list-group-flush">',
      );
      //FUNCION LISTA TELEFONOS
      html.push(createDesplegableTelefonos(Gb.globalState.users[i].tels));
      html.push(
        '</ul>',
        '</div>',
        '</div>',
        '</div>',
        '<div class="col-xl-5">',
        '<div class="card text-white bg-info">',
        '<div class="card-header">',
        '<a class="tituloSeccion" role="button" onclick="window.loadEditarTelefonosResponsable(\'' + Gb.globalState.users[i].uid + '\')">',
        'Editar',
        '</a>',
        '</div>',
        '</div>',
        '</div>',
        '</td>',
        '<td>',
        '<div class="row">',
        '<div class="col-xl-7">',
        '<div class="card text-white bg-dark">',
        '<div class="card-header">',
        '<a class="tituloSeccion" data-toggle="collapse"',
        'href="#', idGrupoAlumnos, '" role="button"',
        'aria-controls="', idGrupoAlumnos, '">',
        'Ver Alumnos',
        '</a>',
        '</div>',
        '<div class="collapse" id="', idGrupoAlumnos, '">',
        '<ul class="list-group list-group-flush">',
      );
      //FUNCION DE LISTA DE ALUMNOS
      html.push(createDesplegableAlumnos(Gb.globalState.users[i].students));
      html.push(
        '</ul>',
        '</div>',
        '</div>',
        '</div>',
        '<div class="col-xl-5">',
        '<div class="card text-white bg-info">',
        '<div class="card-header">',
        '<a class="tituloSeccion" role="button" onclick="window.loadEditarAlumnos(\'' + Gb.globalState.users[i].uid + '\')">',
        'Editar',
        '</a>',
        '</div>',
        '</div>',
        '</div>',
        '</td>',
        '<td>',
        '<div class="table-remove card text-white bg-danger">',
        '<div class="card-header">',
        '<a id="boton-remove" class="tituloSeccion" role="button" onclick="(window.eliminarResponsable(', "'" + Gb.globalState.users[i].uid + "'", '))">',
        'Remove',
        '</a>',
        '</div>',
        '</div>',
        '</td>',
        '</tr>',
      );
    }
  }
  return (html.join(''));
}

// Funcion que hace el desplegable de los responsables
function createDesplegableTelefonos(telefonos) {
  let html = [];
  for (let i in telefonos) {
    html.push(
      '<li class="list-group-item bg-dark">',
      '<div class="row">');
    html.push(telefonos[i]);
    html.push(
      '</div>',
      '</li>'
    );
  }
  return (html.join(''));
}

// Funcion que hace el desplegable de los alumnos
function createDesplegableAlumnos(alumnos) {
  let html = [];
  for (let i in alumnos) {
    html.push(
      '<li class="list-group-item bg-dark">',
      '<div class="row" id="',
      alumnos[i],
      '">');
    html.push(Gb.resolve(alumnos[i]).firstName);
    html.push(
      '</div>',
      '</li>'
    );
  }
  return (html.join(''));
}

//FIN DE FUNCIONES DE RESPONSABLE

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES DE PROFESOR

// Logica de crear un nuevo profesor
window.crearProfesor = function crearProfesor() {
  let listaTelefonos = [];
  var clases = [];
  if (!/^[a-zA-Z0-9_-ñáéíóú]+$/.test($("#inputID").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID no es válido"));
    return;
  }
  if (!/^(.+( .+)*)$/.test($("#inputContra").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "La contraseña no es válida"));
    return;
  }
  if (!/^[a-zA-Zñáéíóú]+( [a-zA-Zñáéíóú]+)*$/.test($("#inputNombre").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El nombre no es válido"));
    return;
  }
  if (!/^[a-zA-Zñáéíóú]+( [a-zA-Zñáéíóú]+)*$/.test($("#inputApellidos").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El apellido no es válido"));
    return;
  }
  let telefonos = $('input[name="telefonos"]').map(function () {
    return $(this).val();
  }).get();
  for (let telefono in telefonos) {
    if (!/^(\s*\w+.*)/.test(telefonos[telefono])) {

    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/.test(telefonos[telefono])) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "El teléfono " + telefonos[telefono] + " no es válido"));
      return;
    } else listaTelefonos.push(telefonos[telefono]);
  }
  if (listaTelefonos.length < 1) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "Al menos un telefono debe de ser válido"));
    return;
  }
  if (Gb.resolve($("#inputID").val()) != undefined) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El ID ya existe"));
    return;
  }
  if ($("#class1").val() != "") {
    clases.push($("#class1").val());
    if ($("#class2").val() != "") {
      clases.push($("#class2").val());
    }
    if ($("#class3").val() != "") {
      clases.push($("#class3").val());
    }
  }
  let profesor = new Gb.User(
    $("#inputID").val(),
    Gb.UserRoles.TEACHER,
    $("#inputNombre").val(),
    $("#inputApellidos").val(),
    listaTelefonos,
    clases,
    [],
    $("#inputContra").val()
  );

  //Pushes user to globalstate.
  Gb.addUser(profesor).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      $("#aviso").empty();
      $("#aviso").append(sendAlert("OK", "Se ha creado correctamente"));
      // Limpio los datos
      $("#inputID").val("");
      $("#inputNombre").val("");
      $("#inputContra").val("");
      $("#inputApellidos").val("");
      $("#class1").val("");
      $("#class2").val("");
      $("#class3").val("");
      $("#telf1").val("");
      $("#telf2").val("");
      $("#telf3").val("");
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No se ha podido crear el profesor"));
    }
  });
}

window.loadProfesores = function loadProfesores(tipo, mensaje) {
  try {
    if (tipo == null) {
      // Para salvar datos que se han quedado sin guardar
      saveDatas();
    }
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createProfesores());
    if (mensaje != undefined) {
      $("#aviso").empty();
      $("#aviso").append(sendAlert(tipo, mensaje));
    }

  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

function createProfesores() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu(' + "null" + ')">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<div class="container">',
    '<h1 class="text-center font-weight-bold pt-1 mb-0 display-3 pb-0">Profesores</h1>',
    '<div class="card-body pt-0">',
    '<div class="row d-flex justify-content-end">',
    '<button id="boton-add" class="btn" onclick="window.loadAddProfesor()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/add.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="input-group mb-2">',
    '<input id="miBuscador" type="text" class="form-control" onkeyup="myTableFilter()" placeholder="Search">',
    '<div class="input-group-append">',
    '<select id="filtro" class="bg-info text-white text-center" name="OS">',
    '<option value="0">Id</option>',
    '<option value="1">Nombre</option>',
    '<option value="2">Apellidos</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="table-wrapper-scroll-y my-custom-scrollbar">',
    '<div id="miTabla" class="table-editable ">',
    '<table class="table table-bordered table-responsive-md table-striped table-dark text-center" id="miTabla">',
    '<thead>',
    '<tr class="headerTabla">',
    '<th class="text-center">Id</th>',
    '<th class="text-center">Nombre</th>',
    '<th class="text-center">Apellidos</th>',
    '<th class="text-center">Clases</th>',
    '<th class="text-center">Eliminar</th>',
    '</tr>',
    '</thead>',
    '<tbody>',
  ]
  //FUNCION LISTA DE PROFESORES
  html.push(createGroupProfesores());
  html.push(
    '</tbody>',
    '</table>',
    '</div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row mt-3 d-flex justify-content-end">',
    '<div>',
    '<button id="boton-cancelar" class="btn" onclick="window.cancelarProfesor()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.guardarProfesores()">', //"estudiante"
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'
  )
  return $(html.join(''));

}

function createGroupProfesores() {
  let html = [];
  let idGrupo;
  for (let i in Gb.globalState.users) {
    if (Gb.globalState.users[i].type == Gb.UserRoles.TEACHER) {
      idGrupo = 'p_' + Math.floor(Math.random() * 10000000);
      html.push(
        '<tr>',
        '<td class="pt-3-half">', Gb.globalState.users[i].uid, '</td>',
        '<td class="pt-3-half" contenteditable="true">', Gb.globalState.users[i].first_name, '</td>',
        '<td class="pt-3-half" contenteditable="true">', Gb.globalState.users[i].last_name, '</td>',
        '<td>',
        '<div class="row">',
        '<div class="col-xl-7">',
        '<div class="card text-white bg-dark">',
        '<div class="card-header">',
        '<a class="tituloSeccion" data-toggle="collapse"',
        'href="#', idGrupo, '" role="button"',
        'aria-controls="', idGrupo, '">',
        'Ver Clases',
        '</a>',
        '</div>',
        '<div class="collapse" id="', idGrupo, '">',
        '<ul class="list-group list-group-flush">'
      );
      //FUNCION QUE LISTA CLASES
      html.push(createGroupClases(Gb.globalState.users[i].classes));
      html.push(
        '</ul>',
        '</div>',
        '</div>',
        '</div>',
        '<div class="col-xl-5">',
        '<div class="card text-white bg-info">',
        '<div class="card-header">',
        '<a class="tituloSeccion" role="button">',
        'Editar',
        '</a>',
        '</div>',
        '</div>',
        '</div>',
        '</td>',
        '<td>',
        '<div class="table-remove card text-white bg-danger">',
        '<div class="card-header">',
        '<a id="boton-remove" class="tituloSeccion" role="button" onclick="(window.eliminarProfesor(', "'" + Gb.globalState.users[i].uid + "'", '))">',
        'Remove',
        '</a>',
        '</div>',
        '</div>',
        '</td>',
        '</tr>'
      )
    }
  }
  return (html.join(''));
}

function createGroupClases(clases) {
  let html = [];
  for (let i in clases) {
    html.push(
      '<li class="list-group-item bg-dark">',
      '<div class="row">',
      clases[i],
      '</div>',
      '</li>',
    )
  }
  return (html.join(''));
}

window.loadAddProfesor = function loadAddProfesor() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAddProfesor());
  } catch (e) {
    console.log('Error cargando añadir profesor', e);
  }
}

function createAddProfesor() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu(' + "null" + ')">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadProfesores(' + "null" + ')">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos(' + "null" + ')">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables(' + "null" + ')">Responsables</a>',
    '<a class="nav-item nav-link " role="button" onclick="window.loadClases(' + "null" + ')">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes(' + "null" + ')">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<!--Empieza el formulario de la pagina-->',
    '<div class="container justify-content-center align-items-center">',
    '<div class="row justify-content-center align-items-center">',
    '<div class="col-md-8">',
    '<h2 class="display-4 text-center mt-3">Añadir Profesor</h2>',
    '</div>',
    '</div>',
    '<div class="justify-content-center">',
    '<div class="pl-5 pr-4 pt-3">',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputID">Id:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputID">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputContra">Contraseña:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="password" class="form-control" id="inputContra">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputNombre">Nombre:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputNombre">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputApellidos">Apellidos:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" id="inputApellidos">',
    '</div>',
    '</div>',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputClase">Clases:</label>',
    '</div>',
    '<!--Enlace: https://stackoverflow.com/a/30525521-->',
    '<div class="col-md-2">',
    '<!--Campo para escribir el destinatario-->',
    '<select id="class1" class="form-control">'
  ]
  html.push(groupInputClass());
  html.push(
    '</select>',
    '</div>',
    '<div class="col-md-2">',
    '<select id="class2" class="form-control">',
    '<option></option>')
  html.push(groupInputClass());
  html.push(
    '</select>',
    '</div>',
    '<div class="col-md-2">',
    '<select id="class3" class="form-control">',
    '<option></option>')
  html.push(groupInputClass());
  html.push(
    '</select>',
    '</div>',
    '</div>',
    '<!--Botonera de telefonos-->',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputDNI">Teléfonos:</label>',
    '</div>',
    '<div class="col-md-6">',
    '<input type="text" class="form-control" name="telefonos" placeholder="Teléfono">',
    '</div>',
    '<div class="col-md-8">',
    '<div class="row">',
    '<div class="col-md-3 pt-2">',
    '<button type="button" class="btn btn-secondary" onclick="window.addCuadroTelefono()">Añadir Teléfono</button>',
    '</div>',
    '<div class="col-md-9" id="contenedorTelefonos"></div>',
    '</div>',
    '</div>',
    '</div>',
    '<!-- avisos -->',
    '<div class="row mt-3 justify-content-center">',
    '<div id="aviso" class="col-md-8"></div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-4 text-left">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadProfesores()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/arrow.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '<div class="col-md-4 text-right">',
    '<button id="boton-guardar" class="btn" onclick="window.crearProfesor()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/guardar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
    '</div>',
  );
  return $(html.join(''));
}

//FIN DE FUNCIONES DE PROFESOR

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES DE MENSAJES

function transformDate(date) {
  let actual = new Date();
  //Año actual
  if (date.getFullYear() == actual.getFullYear()) {
    // Miramos el mes
    if (date.getMonth() == actual.getMonth()) {
      // Miramos el dia
      if (date.getDate() == actual.getDate()) {
        return "Hoy";
      }
      // Hace mas de un dia
      else {
        // Mensajes de hace un dia (Ayer)
        if (actual.getDate() - date.getDate() == 1) {
          return "Ayer";
        }
        // Mensajes de hace 7 dias
        else if (actual.getDate() - date.getDate() <= 7) {
          return "Hace una semana"
        }
        // Si ha pasado menos de un mes
        else return "Este mes"
      }
    }
    // Si ha pasado mas de un mes
    else {
      if (actual.getMonth() - date.getMonth() == 1) {
        return "Hace un mes";
      } else if (actual.getMonth() - date.getMonth() <= 3) {
        return "Hace tres meses";
      } else if (actual.getMonth() - date.getMonth() <= 8) {
        return "Hace ocho meses";
      } else return "Menos de un año"
    }
  }
  //Mensajes de otro año
  else {
    if (actual.getFullYear() - date.getFullYear() == 1) {
      return "Hace un año";
    }
    //Muy antiguos
    else return "Hace mucho tiempo";
  }
}

// Funcion que ordena los mensajes en funcion de su atributo DATE
function groupByKeys(mensajes) {
  let groupByKey = {};
  /*console.log("MENSAJES PASADOS");
  console.log(mensajes);*/
  for (let m in mensajes) {
    // No existe
    if (groupByKey[mensajes[m].order] == undefined) {
      groupByKey[mensajes[m].order] = [mensajes[m]];
    }
    // Ya existe
    else groupByKey[mensajes[m].order].push(mensajes[m]);
  }
  return groupByKey;
}

// Para ordenar las fechas de menor a mayor
function sortByDate(m1, m2) {
  let date1 = m1.date;
  let date2 = m2.date;
  //Miramos anyo
  if (date1.getFullYear() == date2.getFullYear()) {
    //Miramos mes
    if (date1.getMonth() == date2.getMonth()) {
      //Miramos dia
      if (date1.getDate() == date2.getDate()) return 0;
      else if (date1.getDate() < date2.getDate()) return 1;
      else return -1;
    } else if (date1.getMonth() < date2.getMonth()) return 1;
    else return -1;
  } else if (date1.getFullYear() < date2.getFullYear()) return 1;
  else return -1;
}

window.escribirMensaje = function escribirMensaje() {
  //debugger;
  let texto;
  if (!/^(.+( .+)*)$/.test($("#inputTo").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El mensaje debe tener un destinatario"));
    return;
  }
  if (Gb.resolve($("#inputTo").val()) == undefined) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El destinatario no existe"));
    return;
  }
  if (!/^(.+( .+)*)$/.test($("#inputAsunto").val())) {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El mensaje debe tener un asunto"));
    return;
  }
  if (/^(.+( .+)*)$/.test($("#summernote").val())) {
    texto = $("#summernote").val().replace(/<+[^>]*>+/g, "");
  } else {
    $("#aviso").empty();
    $("#aviso").append(sendAlert("KO", "El mensaje debe tener un contenido"));
    return;
  }

  let message = new Gb.Message(
    U.randomString(),
    new Date(),
    usuarioIniciado.uid,
    [$("#inputTo").val()],
    [Gb.MessageLabels.SENT],
    $("#inputAsunto").val(),
    texto
  )
  Gb.send(message).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      $("#aviso").empty();
      $("#aviso").append(sendAlert("OK", "El mensaje se ha enviado"));
      $("#inputTo").val("");
      $("#inputAsunto").val("");
      $("#summernote").val("");
    } else {
      $("#aviso").empty();
      $("#aviso").append(sendAlert("KO", "No se ha podido mandar el mensaje"));
    } //Enviar el mensaje
  });
}

window.responderMensaje = function responderMensaje() {
  let message = new Gb.Message(
    U.randomString(),
    U.randomString(),
    undefined,
    $("#inputTo").val(),
    [Gb.MessageLabels.SENT],
    $("#inputAsunto").val(),
    $("#summernote").val()
  )
  Gb.send(message); //Enviar el mensaje
  let aviso = "Se ha enviado un mensaje con los siguientes datos:\n" +
    "Destinatario: " + message.to + "\n" +
    "Asunto: " + message.title + "\n" +
    "Contenido: " + message.body;
  alert(aviso);
}

//Funcion para enviar un mensaje a una clase
window.enviarMensajeAClase = function enviarMensajeAClase() {
  let message = new Gb.Message(
    U.randomString(),
    U.randomString(),
    undefined,
    $("#inputClaseMensaje").val(),
    [Gb.MessageLabels.SENT],
    $("#inputAsunto").val(),
    $("#summernote").val()
  )
  Gb.send(message); //Enviar el mensaje
  let aviso = "Se ha enviado un mensaje con los siguientes datos:\n" +
    "Destinatario: " + message.to + "\n" +
    "Asunto: " + message.title + "\n" +
    "Contenido: " + message.body;
  alert(aviso);
}

window.loadMenuMensajes = function loadMenuMensajes() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createMenuMensajes());
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    let recibidos = [];
    for (let mes in Gb.globalState.messages) {
      let usuarioCorrecto = false;
      // Miro si entre los receptores esta el id del usuario que inicio la sesion
      for (let ids in mes.to) {
        if (usuarioIniciado.uid == ids) {
          usuarioCorrecto = true;
          break;
        }
      }
      // Compruebo que el mensaje sea del usuario correcto
      if (usuarioCorrecto) {
        for (let label in mes.MessageLabels) {
          if (label == Gb.MessageLabels.RECVD) {
            recibidos.push(mes);
            break;
          }
        }
      }
    }
    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    // Para ver si hay mensjaes que mostrar
    //debugger;
    let mensajesConDate = recibidos.apply(x => x + (x['order'] = transformDate(x.date)));
    mensajesConDate.sort(sortByDate);
    let mensajesAgrupados = U.groupByKeys(mensajesConDate);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // Parte de la derecha
    $("#derecha").empty();
    $("#derecha").append(createZonaMensajesDerechaNoLeidos());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

function createMenuMensajes() {
  let html = [];
  html = ['<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" onclick="window.loadAdminMenu()">',
    '<h1 class="d-inline align-self-start text-white">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1 text-white"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" role="button" onclick="window.loadProfesores()">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos()">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size" onclick="window.cerrarSesion()">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
    '<div class="quitarScroll">',
    '<!-- Zona de la izquierda-->',
    '<div class="w-50 float-left bd-links" id="izquierda">',
    '</div>',
    '<!--Pantalla de la DERECHA-->',
    '<div class="bd-links" id="derecha">',
    '</div>',
    '</div>'
  ]
  return $(html.join(''));
}

function createZonaMensajesDerechaNoLeidos() {
  let html = [
    '<!--Muestro el mensaje de aviso-->',
    '<div class="m-5 p-5 text-center">',
    'Selecciona algún mensaje para leerlo',
    '</div>'
  ];
  return $(html.join(''));
}

//Crear agrupamiento de mensajes
function createZonaMensajesIzquierda(tipo) {

  let html = ['<nav class="navbar navbar-expand-xl navbar-light bg-light sticky-top">'];

  if (tipo == Gb.MessageLabels.ARCH) {
    html.push('<a class="navbar-brand rem1 pr-1" onclick="window.loadMessageArchivados()">Archivados</a>');
  } else if (tipo == Gb.MessageLabels.FAV) {
    html.push('<a class="navbar-brand rem1 pr-1" onclick="window.loadMessageFavoritos()">Favoritos</a>');
  } else if (tipo == Gb.MessageLabels.RECVD) {
    html.push('<a class="navbar-brand rem1 pr-1" onclick="window.loadMessageRecibidos()">Bandeja de entrada</a>');
  } else if (tipo == Gb.MessageLabels.SENT) {
    html.push('<a class="navbar-brand rem1 pr-1" onclick="window.loadMessageEnviados()">Enviados</a>');
  }
  html.push(
    '<button class="navbar-toggler" type="button" data-toggle="collapse"',
    'data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"',
    'aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<div class="collapse navbar-collapse text-center" id="navbarSupportedContent">',
    '<ul class="navbar-nav mr-auto">',
    '<li class="nav-item">',
    '<a class="nav-link" role="button" onclick="window.loadEscribirMensaje()">',
    '<img class="iconos" src="imagenes/enviar.png" alt="">',
    '</a>',
    '</li>',
    '<li class="nav-item">',
    '<a class="nav-link" onclick="loadEscribirMensajeClase()">',
    '<img class="iconos" src="imagenes/aula.png" alt="">',
    '</a>',
    '</li>',
    '<li class="nav-item">',
    '<a class="nav-link" id="bandeja" onclick="window.loadMessage()">',
    '<img class="iconos" src="imagenes/bandeja entrada.png" alt="">',
    '</a>',
    '</li>',
    '<li class="nav-item">',
    '<a class="nav-link" onclick="window.loadMessageEnviados()">',
    '<img class="iconos" src="imagenes/enviados.png" alt="">',
    '</a>',
    '</li>',
    '<li class="nav-item">',
    '<a class="nav-link" onclick="window.loadMessageArchivados()">',
    '<img class="iconos" src="imagenes/archivados.png" alt="">',
    '</a>',
    '</li>',
    '<li class="nav-item dropdown">',
    '<a class="nav-link dropdown-toggle text-primary" href="#" id="navbarDropdownMenuLink"',
    'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
    'Filtros',
    '</a>',
    '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">',
    '<a class="dropdown-item" onclick="window.loadMessageNoLeidos()">No leidos</a>',
    '<a class="dropdown-item" onclick="window.loadMessageFavoritos()" >Favoritos</a>',
    '</div>',
    '</li>',
    '</ul>',
    '<form class="form-inline justify-content-center my-2 my-lg-0">',
    '<div class="input-group">',
    '<input type="text" class="form-control" placeholder="Search">',
    '<div class="input-group-append">',
    '<button class="btn btn-secondary" type="button">',
    '<img class="buscadorIcon" src="imagenes/buscar.png" alt="">',
    '</button>',
    '</div>',
    '</div>',
    '</form>',
    '</div>',
    '</nav>',
    '<!-- Mensajes -->',
    '<div id="mensajes">',
    '</div>'
  );
  return $(html.join(''));
}
/**
 * Arramplao de  //https://stackoverflow.com/a/14626707
 * 
 */
function createMensajesPorFecha(date) {
  let idGrupo;
  let html = [];
  if (Object.keys(date).length != 0) {
    for (let d in date) {
      idGrupo = 'x_' + Math.floor(Math.random() * 10000000);
      html.push(
        '<div class="card text-white bg-dark">',
        '<div class="card-header">',
        '<a class="tituloSeccion" data-toggle="collapse" href="#', idGrupo, '" role="button"',
        'aria-controls=', idGrupo, '>',
        d,
        '</a>',
        '</div>',
        '<div class="collapse show" id=', idGrupo, '>',
        '<ul class="list-group list-group-flush mensajes bg-light">');
      html.push(createGroupMessages(date[d]));
      html.push(
        '</ul>',
        '</div>',
        '</div>'
      );
    }
  } else {
    html.push(
      '<!--Muestro el mensaje de aviso-->',
      '<div class="m-5 p-5 text-center">',
      '¡No tienes mensajes, parguela!',
      '</div>');
  }
  return $(html.join(''));
}

function createGroupMessages(mensaje) {
  let html = [];
  for (let m in mensaje) {
    html.push(
      '<li class="list-group-item bg-light">',
      '<div class="row">',
      '<div class="col-6">',
      '<a onclick="window.loadLeerMensaje(', "'" + mensaje[m].msgid + "'", ')" class="tituloMensaje">',
      mensaje[m].title,
      '</a>',
      '</div>',
      '<div class="col-6 d-flex flex-row justify-content-end flex-wrap">',
      '<a class="mr-2" href="#">')
    // Para distinguir entre mensajes leidos y no leidos                          
    if (mensaje[m].labels.includes(Gb.MessageLabels.READ)) {
      html.push(
        '<img class="iconos" src="imagenes/read.png" alt="">'
      );
    } else {
      html.push(
        '<img class="iconos" src="imagenes/unread.png" alt="">'
      );
    }
    html.push(
      '</a>',
      '<a class="mr-2" onclick="window.loadResponderMensaje(', "'" + mensaje[m].msgid + "'", ')">',
      '<img class="iconos" src="imagenes/reply.png" alt="">',
      '</a>',
      '<a class="mr-2" href="#">')
    // Para disntinguir entre archivados y no archivados
    if (mensaje[m].labels.includes(Gb.MessageLabels.ARCH)) {
      html.push(
        '<img class="iconos" src="imagenes/archivados.png" alt="">'
      );
    } else {
      html.push(
        '<img class="iconos" src="imagenes/no-archivados.png" alt="">'
      );
    }
    html.push(
      '</a>',
      '<a class="mr-2" href="#">');
    // Para disntinguir entre favoritos y no favoritos
    if (mensaje[m].labels.includes(Gb.MessageLabels.FAV)) {
      html.push(
        '<img class="iconos" src="imagenes/favorito-activado.png" alt="">'
      );
    } else {
      html.push(
        '<img class="iconos" src="imagenes/favorito-desactivado.png" alt="">'
      );
    }
    html.push(
      '</a>',
      '<a class="" href="#">',
      '<img class="iconos" src="imagenes/eliminar.png" alt="">',
      '</a>',
      '</div>',
      '</div>',
      '</li>',
    );
  }
  return (html.join(''));
}

// Funcion que carga los mensajes archivados
window.loadMessageArchivados = function loadMessageArchivos() {
  try {
    // vaciamos un contenedor
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    // busco los mensajes archivados y los guardo
    let archivados = [];
    // Recorro los mensajes
    for (let mensaje in Gb.globalState.messages) {
      let usuarioCorrecto = false;
      // Miro si entre los receptores esta el id del usuario que inicio la sesion
      for (let ids in mes.to) {
        if (usuarioIniciado.uid == ids) {
          usuarioCorrecto = true;
          break;
        }
      }
      // Compruebo que el mensaje sea del usuario correcto
      if (usuarioCorrecto) {
        // Miro los labels, en busca del label "arch"
        for (let pos in mensaje.labels) {

          if (pos == Gb.MessageLabels.ARCH) {
            archivados.push(mensaje);
            break;
          }
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    archivados.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(archivados);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)*/
  } catch (e) {
    console.log('Error al cargar los mensajes archivados', e);
  }
}

// Funcion que carga los mensajes favoritos
window.loadMessageFavoritos = function loadMessageFavoritos() {
  try {
    // vaciamos un contenedor
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let favoritos = [];
    for (let mes in Gb.globalState.messages) {
      let usuarioCorrecto = false;
      // Miro si entre los receptores esta el id del usuario que inicio la sesion
      for (let ids in mes.to) {
        if (usuarioIniciado.uid == ids) {
          usuarioCorrecto = true;
          break;
        }
      }
      // Compruebo que el mensaje sea del usuario correcto
      if (usuarioCorrecto) {
        for (let label in mes.MessageLabels) {

          if (label == Gb.MessageLabels.FAV) {
            favoritos.push(mes);
            break;
          }
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    favoritos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(favoritos);
    // Nos recorremos los mensajes agrupados
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes favoritos', e);
  }
}

// Funcion que carga los mensajes recibidos
window.loadMessageRecibidos = function loadMessageRecibidos() {
  try {
    // vaciamos un contenedor
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let recibidos = [];
    for (let mes in Gb.globalState.messages) {
      let usuarioCorrecto = false;
      // Miro si entre los receptores esta el id del usuario que inicio la sesion
      for (let ids in mes.to) {
        if (usuarioIniciado.uid == ids) {
          usuarioCorrecto = true;
          break;
        }
      }
      // Compruebo que el mensaje sea del usuario correcto
      if (usuarioCorrecto) {
        for (let label in mes.MessageLabels) {
          if (label == Gb.MessageLabels.RECVD) {
            recibidos.push(mes);
            break;
          }
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    recibidos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(recibidos);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes recibidos', e);
  }
}

// Funcion que carga los mensajes leidos
window.loadMessageLeidos = function loadMessageLeidos() {
  try {
    // vaciamos un contenedor
    // vaciamos un contenedor
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let leidos = [];

    for (let mes in Gb.globalState.messages) {
      let usuarioCorrecto = false;
      // Miro si entre los receptores esta el id del usuario que inicio la sesion
      for (let ids in mes.to) {
        if (usuarioIniciado.uid == ids) {
          usuarioCorrecto = true;
          break;
        }
      }
      // Compruebo que el mensaje sea del usuario correcto
      if (usuarioCorrecto) {
        let read = false; //si has leido el mensaje
        let reci = false; //si es un mensaje recibido
        for (let label in mes.MessageLabels) {
          if (label == Gb.MessageLabels.RECVD) {
            reci = true;
          } else if (label == Gb.MessageLabels.READ) {
            read = true;
          }
          if (reci && read) {
            leidos.push(mes);
            break;
          }
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    leidos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(leidos);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes leidos', e);
  }
}

// Funcion que carga los mensajes enviados
window.loadMessageEnviados = function loadMessageEnviados() {
  try {
    // vaciamos un contenedor
    // vaciamos un contenedor
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    // busco los mensajes archivados y los guardo
    let enviados = [];
    // Recorro los mensajes
    for (let mensaje in Gb.globalState.messages) {
      if (mensaje.from == usuarioIniciado.uid) {
        // Miro los labels, en busca del label "sent"
        for (let etiq in mensaje.labels) {
          //Comprobamos que el mensaje es "Enviado" por el usuario logueado
          if (etiq == Gb.MessageLabels.SENT) {
            enviados.push(mensaje);
            break;
          }
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    enviados.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(enviados);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)*/
  } catch (e) {
    console.log('Error al cargar los mensajes enviados', e);
  }
}

// Funcion que carga los mensajes no leidos
window.loadMessageNoLeidos = function loadMessageNoLeidos() {
  try {
    // vaciamos un contenedor
    $("#izquierda").empty();
    $("#izquierda").append(createZonaMensajesIzquierda(Gb.MessageLabels.RECVD));
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let noLeidos = [];
    for (let mes in Gb.globalState.messages) {
      let recibido = false,
        leido = false,
        usuarioCorrecto = false;
      // Miro si entre los receptores esta el id del usuario que inicio la sesion
      for (let ids in mes.to) {
        if (usuarioIniciado.uid == ids) {
          usuarioCorrecto = true;
          break;
        }
      }
      // Compruebo que el mensaje sea del usuario correcto
      if (usuarioCorrecto) {
        for (let label in mes.MessageLabels) {
          // Miro si esta recibido
          if (label == Gb.MessageLabels.RECVD) {
            recibido = true;
          }
          // Miro que no este leido
          else if (label == Gb.MessageLabels.READ) {
            leido = true;
          }
        }
        if (recibido && !leido) {
          noLeidos.push(mes);
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    noLeidos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(noLeidos);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createMensajesPorFecha(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes no leidos', e);
  }
}

window.loadLeerMensaje = function loadLeerMensaje(id) {
  try {
    // vaciamos un contenedor
    $("#derecha").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#derecha").append(createZonaMensajesDerechaLeer(Gb.resolve(id)));
    window.loadInputClases();
  } catch (e) {
    console.log('Error cargando añadir alumnos', e);
  }
}

//Crea la zona derecha de la interfaz, con su mensaje y sus distintos casos.
function createZonaMensajesDerechaLeer(mensaje) {
  let html = [
    '<div method="post" class="formulario pl-5 pr-4 pt-3 ">',
    '<!--Campo para escribir el destinatario-->',
    '<div class="row pt-2 align-items-center">',
    '<div class=" col-12 col-xl-2">De:</div>',
    '<div class="col-12 col-xl-10">',
    '<input type="text" id="inputTo" class="form-control" value="', mensaje.from, '" readonly>',
    '</div>',
    '</div>',
    '<!--Campo para escribir el asunto-->',
    '<div class="row pt-2 pb-2 align-items-center">',
    '<div class="col-12 col-xl-2">Asunto:</div>',
    '<div class="col-12 col-xl-10">',
    '<input type="text" class="form-control" value="', mensaje.title, '" id="inputAsunto" readonly>',
    '</div>',
    '</div>',
    '<!--Campo para escribir el mensaje-->',
    'Mensaje:',
    '<div class="row pt-1">',
    '<div class="col-12 col-xl-12">',
    '<textarea class="campoTexto" id="summernote" value="', mensaje.body, '" name="editordata" readonly></textarea>',
    '<script>',
    '$("#summernote").summernote({',
    'placeholder: "Hola caracola",',
    'tabsize: 2,',
    'readonly: true,',
    'maxHeight: null,',
    'minHeight: "calc(100vh - 25rem)"',
    '});',
    '// Esto hace que el mensaje sea no editable',
    '// Enlace: https://stackoverflow.com/a/49665694',
    '$("#summernote").summernote("disable");',
    '</script>',
    '</div>',
    '</div>',
    '<div class="row pt-1">',
    '<!--Botonera con los botones de responder, archivar, favorito y eliminar-->',
    '<div class="col-12 d-flex flex-row justify-content-end flex-wrap">',
    '<a class="mr-2" href="#">',
    '<img class="iconos" src="imagenes/reply.png" alt="">',
    '</a>',
    '<a class="mr-2" href="#">',
    '<img class="iconos" src="imagenes/no-archivados.png" alt="">',
    '</a>',
    '<a class="mr-2" href="#">',
    '<img class="iconos" src="imagenes/favorito-desactivado.png" alt="">',
    '</a>',
    '<a class="" href="#">',
    '<img class="iconos" src="imagenes/eliminar.png" alt="">',
    '</a>',
    '</div>',
    '</div>',
    '</div>'
  ];

  return $(html.join(''));
}

window.loadResponderMensaje = function loadResponderMensaje(id) {
  try {
    // vaciamos un contenedor
    $("#derecha").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#derecha").append(createZonaMensajesDerechaResponder(Gb.resolve(id)));
    window.loadInputClases();
  } catch (e) {
    console.log('Error cargando añadir alumnos', e);
  }
}

//Crea la zona derecha de la interfaz, con su mensaje y sus distintos casos. (Responder)
function createZonaMensajesDerechaResponder(mensaje) {
  let html = [
    '<div method="post" class="formulario pl-5 pr-4 pt-3 ">',
    '<!--Campo para escribir el destinatario-->',
    '<div class="row pt-2 align-items-center">',
    '<div class=" col-12 col-xl-2">Para:</div>',
    '<div class="col-12 col-xl-10">',
    '<label id="idPadre"></label>',
    '<input type="text" id="inputTo" class="form-control" value="', mensaje.from, '" placeholder="Profesor" readonly>',
    '</div>',
    '</div>',
    '<!--Campo para escribir el asunto-->',
    '<div class="row pt-2 pb-2 align-items-center">',
    '<div class="col-12 col-xl-2">Asunto:</div>',
    '<div class="col-12 col-xl-10">',
    '<input type="text" id="inputAsunto" class="form-control" value="Re: ', mensaje.title, '" placeholder="Re: Falta de asistencia"',
    'readonly>',
    '</div>',
    '</div>',
    '<!--Campo para escribir el mensaje-->',
    'Mensaje:',
    '<div class="row pt-1">',
    '<div class="col-12 col-xl-12">',
    '<textarea class="campoTexto" id="summernote" name="editordata"></textarea>',
    '<script>',
    '$("#summernote").summernote({',
    'placeholder: "Hola",',
    'tabsize: 2,',
    'maxHeight: null,',
    'minHeight: "calc(100vh - 25rem)"',
    '});',
    '</script>',
    '</div>',
    '<!-- botón para enviar el formulario; justify-content-end no ha funcionado-->',
    '<div class="ml-auto pt-2 pb-2 pr-3">',
    '<button type="submit" id="boton-enviar" class="btn btn-primary" onclick="window.responderMensaje()">Enviar</button>',
    '</div>',
    '</div>'
  ];
  return $(html.join(''));
}

window.loadEscribirMensaje = function loadEscribirMensaje() {
  try {
    // vaciamos un contenedor
    $("#derecha").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#derecha").append(createZonaMensajesDerechaEscribirMensaje());
    window.loadInputClases();
  } catch (e) {
    console.log('Error cargando añadir alumnos', e);
  }
}

function createZonaMensajesDerechaEscribirMensaje() {
  let html = [
    '<div method="post" class="formulario pl-5 pr-4 pt-3 ">',
    '<!--Campo para escribir el destinatario-->',
    '<div class="row pt-2 align-items-center">',
    '<div class=" col-12 col-xl-2">Para:</div>',
    '<div class="col-12 col-xl-10">',
    '<input type="text" id="inputTo" class="form-control" placeholder="">',
    '</div>',
    '</div>',
    '<!--Campo para escribir el asunto-->',
    '<div class="row pt-2 pb-2 align-items-center">',
    '<div class="col-12 col-xl-2">Asunto:</div>',
    '<div class="col-12 col-xl-10">',
    '<input type="text" id="inputAsunto" class="form-control" placeholder="">',
    '</div>',
    '</div>',
    '<!--Campo para escribir el mensaje-->',
    'Mensaje:',
    '<div class="row pt-1">',
    '<div class="col-12 col-xl-12">',
    '<textarea class="campoTexto" id="summernote" name="editordata"></textarea>',
    '<script>',
    '$("#summernote").summernote({',
    'placeholder: "Hola",',
    'tabsize: 2,',
    'maxHeight: null,',
    'minHeight: "calc(100vh - 25rem)"',
    '});',
    '</script>',
    '</div>',
    '<!-- aviso -->',
    '<div class="col-12 col-xl-12" id="aviso">',
    '</div>',
    '<!-- botón para enviar el formulario; justify-content-end no ha funcionado-->',
    '<div class="ml-auto pt-2 pb-2 pr-3">',
    '<button type="submit" id="boton-enviar" class="btn btn-primary" onclick="window.escribirMensaje()">Enviar</button>',
    '</div>',
    '</div>'
  ];
  return $(html.join(''));
}

window.loadEscribirMensajeClase = function loadEscribirMensajeClase() {
  try {
    // vaciamos un contenedor
    $("#derecha").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#derecha").append(createZonaMensajesDerechaClase());
    window.loadInputClases();
  } catch (e) {
    console.log('Error cargando añadir alumnos', e);
  }
}

// Crea la zona de escribir un mensaje para toda la clase
function createZonaMensajesDerechaClase() {
  let html = [
    '<div class="formulario pl-5 pr-4 pt-3 ">',
    '<!--Campo para escribir el destinatario-->',
    '<div class="row pt-2 align-items-center">',
    '<div class=" col-12 col-xl-2">Clase:</div>',
    '<div class="col-12 col-xl-10">',
    '<select id="inputClase" class="form-control">',
    '</select>',
    '</div>',
    '</div>',
    '<!--Campo para escribir el asunto-->',
    '<div class="row pt-2 pb-2 align-items-center">',
    '<div class="col-12 col-xl-2">Asunto:</div>',
    '<div class="col-12 col-xl-10">',
    '<input type="text" class="form-control" placeholder="Excursión" id="inputAsunto">',
    '</div>',
    '</div>',
    '<!--Campo para escribir el mensaje-->',
    'Mensaje:',
    '<div class="row pt-1">',
    '<div class="col-12 col-xl-12">',
    '<textarea class="campoTexto" id="summernote" name="editordata"></textarea>',
    '<script>',
    '$("#summernote").summernote({',
    'placeholder: "Hola",',
    'tabsize: 2,',
    'maxHeight: null,',
    'minHeight: "calc(100vh - 25rem)"',
    '});',
    '</script>',
    '</div>',
    '<!-- botón para enviar el formulario; justify-content-end no ha funcionado-->',
    '<div class="ml-auto pt-2 pb-2 pr-3">',
    '<button type="submit" id="boton-enviar" class="btn btn-primary"',
    'onclick="window.enviarMensajeAClase()">Enviar</button>',
    '</div>',
    '</div>',
    '</div>'
  ];
  return $(html.join(''));
}

//FIN DE FUNCIONES DE MENSAJES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funcion para eliminar un alumno de la tabla 
window.eliminarAlumno = function eliminarAlumno(id) {
  let estudiantes = Gb.globalState.students;
  for (let i = 0; i < estudiantes.length; i++) {
    if (estudiantes[i].sid == id) {
      listaEstudiantes.push(estudiantes[i]);
      Gb.globalState.students.splice(i, 1);
    }
  }
  window.loadAlumnos("OK", "Se borró el alumno con ID: " + id);
}

// Funcion para eliminar un profesor de la tabla
window.eliminarProfesor = function eliminarProfesor(id) {
  let profesores = Gb.globalState.users;
  for (let i = 0; i < profesores.length; i++) {
    if (profesores[i].uid == id && profesores[i].type == Gb.UserRoles.TEACHER) {
      listaProfesores.push(profesores[i]);
      Gb.globalState.users.splice(i, 1);
    }
  }
  window.loadProfesores("OK", "Se borró provisionalmente el profesor: " + id + ". Si quiere guardar los cambios pulse 💾");
}

// Funcion para eliminar una clase de la tabla
window.eliminarClase = function eliminarClase(id) {

  // Compruebo que no tenga un profesor asignado
  let usuarios = Gb.globalState.users; // Mezclados los responsables, profesores y administradores
  let contador = 0,
    cierto = true;
  while (cierto && contador < usuarios.length) {
    let profesor = usuarios[contador];
    if (profesor.type == Gb.UserRoles.TEACHER) {
      for (let i = 0; i < profesor.classes.length && cierto; i++) {
        if (profesor.classes[i] == id) {
          cierto = false;
        }
      }
    }
    contador++;
  }
  contador = 0;
  let estudiantes = Gb.globalState.students;
  // Compruebo que no tenga un estudiante asignado
  while (cierto && contador < estudiantes.length) {
    let estudiante = estudiantes[contador];
    if (estudiante.cid == id) {
      cierto = false;
    }
    contador++;
  }
  if (cierto) {
    // Borramos la clase temporalmente, hasta una confirmacion
    let clases = Gb.globalState.classes;
    for (let i = 0; i < clases.length; i++) {
      if (clases[i].cid == id) {
        listaClases.push(clases[i]);
        Gb.globalState.classes.splice(i, 1);
      }
    }
    window.loadClases("OK", "Se borró provisionalmente la clase: " + id + ". Si quiere guardar los cambios pulse 💾");

  } else {
    window.loadClases("KO", "No se pudo borrar la clase: " + id + ", tiene profesores y/o alumnos relacionados");
  }
}

// Funcion para eliminar un Responsable de la tabla
window.eliminarResponsable = function eliminarResponsable(id) {
  let responsables = Gb.globalState.users;
  for (let i = 0; i < responsables.length; i++) {
    if (responsables[i].uid == id && responsables[i].type == Gb.UserRoles.GUARDIAN) {
      listaResponsables.push(responsables[i]);
      Gb.globalState.users.splice(i, 1);
    }
  }
  window.loadResponsables("OK", "Se borró provisionalmente el responsable: " + id + ". Si quiere guardar los cambios pulse 💾");
}

// Funcion para eliminar un mensaje
window.loadEliminarMensaje = function eliminarMensaje() {
  // Sacar el id de el id eliminar
  $("#eliminar");

  // Borro el mensaje
  Gb.rm(idMensaje).then;
}
//

//



// DATOS PARA CREAR UN PROFESOR
//DNI, NOMBRE APELLIDOS, ID CLASE(VARIAS)

// Boton cancelar de la tabla de responsables
window.cancelarResponsable = function cancelarResponsable() {
  for (let i = 0; i < listaResponsables.length; i++) {
    Gb.globalState.users.push(listaResponsables[i]);
  }
  listaResponsables = [];
  window.loadAdminMenu("KO", "No se guardaron los cambios en Responsable");
}

// Boton guardar de la tabla responsables
window.guardarResponsables = function guardarResponsables() {

  // Elimina definitivamente los profesores que fueron borrados
  for (let z = 0; z < listaResponsables.length; z++) {
    let id = listaResponsables[z].uid;
    Gb.rm(id).then(d => {
      if (d !== undefined) {
        window.loadAdminMenu("OK", "Se guardaron los cambios en Responsables");
      }
    });
  }
  listaResponsables = [];
  // Codigo para leer la tabla
  let userDetails = [];
  $("table tbody tr").each(function () {
    var detail = [];
    $(this).find("td").each(function () {
      detail.push($(this).html());
    });
    // Mirarlo
    // Tratamiento de la 3º columna
    let tratar = detail[3];
    tratar = tratar.split('<div class="row">');
    let verResponsables = [];
    for (let i = 1; i < tratar.length; i++) {
      let tratar2 = tratar[i];
      tratar2 = tratar2.split('<');
      verResponsables.push(tratar2[0]);
    }
    verResponsables.splice(0, 1);
    detail[3] = verResponsables;
    // Tratamiento de la cuarta columna
    tratar = detail[4];
    tratar = tratar.split('<div class="row" id="');
    verResponsables = [];
    for (let i = 1; i < tratar.length; i++) {
      let tratar2 = tratar[i];
      tratar2 = tratar2.split('"');
      verResponsables.push(tratar2[0]);
    }
    detail[4] = verResponsables;
    detail.splice(5, 1);
    userDetails.push(detail);
  });
  //console.log(userDetails);
  for (let respon of userDetails) {
    let guardian = Gb.resolve(respon[0]);
    guardian.first_name = respon[1];
    guardian.last_name = respon[2];
    // Guardo 2 veces porque no funciona como deberia la funcion set
    Gb.set(guardian).then(d => {
      if (d !== undefined) {
        Gb.set(guardian).then(d => {
          if (d !== undefined) {
            window.loadAdminMenu("OK", "Se guardaron los cambios en Profesor");
          }
        });
      }
    });
  }
}


// Boton cancelar de la tabla de profesores
window.cancelarProfesor = function cancelarProfesor() {
  for (let i = 0; i < listaProfesores.length; i++) {
    Gb.globalState.users.push(listaProfesores[i]);
  }
  listaProfesores = [];
  window.loadAdminMenu("KO", "No se guardaron los cambios en Profesor");
}

// Boton guardar de la tabla profesores
window.guardarProfesores = function guardarProfesores() {

  // Elimina definitivamente los profesores que fueron borrados
  for (let z = 0; z < listaProfesores.length; z++) {
    let id = listaProfesores[z].uid;
    Gb.rm(id).then(d => {
      if (d !== undefined) {
        window.loadAdminMenu("OK", "Se guardaron los cambios en Profesor");
      }
    });
  }
  listaProfesores = [];
  // Codigo para leer la tabla
  let userDetails = [];
  $("table tbody tr").each(function () {
    var detail = [];
    $(this).find("td").each(function () {
      detail.push($(this).html());
    });
    // Tratamiento de la cuarta columna
    let tratar = detail[3];
    //tratar = tratar.split("<div class=\"row\" id=\"");

    tratar = tratar.split('<div class="row">');
    let verResponsables = [];
    //console.log(tratar);
    for (let i = 1; i < tratar.length; i++) {
      let tratar2 = tratar[i];
      tratar2 = tratar2.split("<");
      verResponsables.push(tratar2[0]);
    }
    // Borro la primera posicion, ya que esta vacia
    verResponsables.splice(0, 1);
    detail[3] = verResponsables;
    detail.splice(4, 1);

    userDetails.push(detail);
  });
  //console.log(userDetails);
  for (let profe of userDetails) {
    let teacher = Gb.resolve(profe[0]);
    teacher.first_name = profe[1];
    teacher.last_name = profe[2];
    teacher.classes = profe[3];
    // Falta actualizar los telefonos

    /*if (Gb.resolve(estu[3]) != undefined) {
      student = new Gb.User(estu[0], estu[1], estu[2], estu[3], estu[4]);
    } else {
      student = new Gb.Student(estu[0], estu[1], estu[2], Gb.resolve(estu[0]).cid, estu[4]);
    }*/

    // Guardo 2 veces porque no funciona como deberia la funcion set
    Gb.set(teacher).then(d => {
      if (d !== undefined) {
        Gb.set(teacher).then(d => {
          if (d !== undefined) {
            window.loadAdminMenu("OK", "Se guardaron los cambios en Profesor");
          }
        });
      }
    });
  }
  window.loadAdminMenu("OK", "Se guardaron los cambios en Profesor");
}


// Boton cancelar de la tabla de alumnos
window.cancelarAlumno = function cancelarAlumno() {
  for (let i = 0; i < listaEstudiantes.length; i++) {
    Gb.globalState.students.push(listaEstudiantes[i]);
  }
  listaEstudiantes = [];
  //window.loadAlumnos();
  window.loadAdminMenu("KO", "No se guardaron los cambios en Alumnos");
}

// Boton guardar de la tabla alumnos
window.guardarAlumnos = function guardarAlumnos() {

  // Elimina definitivamente los alumnos que fueron borrados
  for (let z = 0; z < listaEstudiantes.length; z++) {
    let id = listaEstudiantes[z].sid;
    let estudiante = Gb.resolve(id);
    for (let i = 0; i < estudiante.guardians.length; i++) {
      let responsable = Gb.resolve(estudiante.guardians[i]);
      for (let j = 0; j < responsable.students.length; j++) {
        if (responsable.students[j] == id) {
          // Borro el alumno del responsable
          responsable.students.splice(j, 1);
          // Actualizo el responsable
          Gb.set(responsable);
          break;
        }
      }
    }
    estudiante.guardians = [];
    Gb.set(estudiante).then(d => {
      if (d !== undefined) {
        Gb.rm(id).then(d => {
          if (d !== undefined) {
            //window.loadAlumnos();
            window.loadAdminMenu("OK", "Se guardaron los cambios en Alumnos");
          }
        });
      }
    });
  }
  listaEstudiantes = [];
  // Codigo para leer la tabla
  let userDetails = [];
  $("table tbody tr").each(function () {
    var detail = [];
    $(this).find("td").each(function () {
      detail.push($(this).html());
    });

    // Tratamiento de la cuarta columna
    let tratar = detail[4];
    tratar = tratar.split("<div class=\"row\" id=\"");
    let verResponsables = [];
    for (let i = 1; i < tratar.length; i++) {
      let tratar2 = tratar[i];
      tratar2 = tratar2.split("\"");
      verResponsables.push(tratar2[0]);
    }
    detail[4] = verResponsables;
    detail.splice(5, 1);
    userDetails.push(detail);
  });
  //console.log(userDetails);
  for (let estu of userDetails) {
    let student;
    if (Gb.resolve(estu[3]) != undefined) {
      student = new Gb.Student(estu[0], estu[1], estu[2], estu[3], estu[4]);
    } else {
      student = new Gb.Student(estu[0], estu[1], estu[2], Gb.resolve(estu[0]).cid, estu[4]);
    }

    // Guardo 2 veces porque no funciona como deberia la funcion set
    Gb.set(student).then(d => {
      if (d !== undefined) {
        Gb.set(student).then(d => {
          if (d !== undefined) {
            window.loadAdminMenu("OK", "Se guardaron los cambios en Alumnos");
          }
        });
      }
    });
  }
}

// Boton cancelar de la tabla de clases
window.cancelarClase = function cancelarClases() {
  for (let i = 0; i < listaClases.length; i++) {
    Gb.globalState.classes.push(listaClases[i]);
  }
  listaClases = [];
  window.loadAdminMenu("KO", "No se guardaron los cambios en Clases");
}

// Boton para guardar los cambios en las clases
window.guardarClases = function guardarClases() {
  if (listaClases.length > 0) {
    eliminarDefinitivamenteClases(0, listaClases.length);
  }
  else{
    window.loadAdminMenu("OK", "Se guardaron los cambios en Clases");
  }
  console.log("Llego");
}

function eliminarDefinitivamenteClases(posicion, fin) {
  Gb.rm(listaClases[posicion].cid).then(d1 => {
    if (d1 !== undefined) {
      if (posicion == fin - 1) {
        listaClases = [];
        window.loadAdminMenu("OK", "Se guardaron los cambios en Clases");
      }
      else {
        eliminarDefinitivamenteClases(posicion + 1, fin);
      }
    }
  });
}



window.guardarDatos = function guardarDatos(tipo) {
  const $tableID = $('#miTabla');
  const $rows = $tableID.find('tr:not(:hidden)');
  const headers = [];
  const data = [];

  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });

  // Turn all existing rows into a loopable array
  $rows.each(function () {
    const $td = $(this).find('td');
    const h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach((header, i) => {

      h[header] = $td.eq(i).text();
    });
    data.push(h);
  });
  if (tipo != "estudiante") {
    let list_tipo = [];
    for (let i in Gb.globalState.users) {
      if (Gb.globalState.users[i].type == tipo) {
        list_tipo.push(Gb.globalState.users[i]);
      }
    }
    let encontrado = false;
    for (let i in list_tipo) {

      encontrado = false;
      for (let j in data) {
        if (data[j].id == list_tipo[i].uid) {
          encontrado = true;
          // Borramos un profesor
          if (tipo == Gb.UserRoles.TEACHER) {
            Gb.set(
              new Gb.User(
                data[j].id,
                tipo,
                data[j].nombre,
                data[j].apellidos,
                list_tipo[i].tels,
                list_tipo[i].classes,
                [])
            );
          } else if (tipo == Gb.UserRoles.GUARDIAN) {
            Gb.set(
              new Gb.User(
                data[j].id,
                tipo,
                data[j].nombre,
                data[j].apellidos,
                list_tipo[i].tels,
                list_tipo[i].classes,
                [])
            );
          }
          break;
        }
      }
      if (!encontrado) Gb.rm(list_tipo[i].uid);
    }
  } else {
    let encontrado = false;
    for (let i in Gb.globalState.students) {
      encontrado = false;
      for (let j in data) {
        if (data[j].id == Gb.globalState.students[i].sid) {
          encontrado = true;
          Gb.set(
            new Gb.Student(
              data[j].id,
              data[j].nombre,
              data[j].apellidos,
              data[j].clase,
              Gb.globalState.students[i].guardians
            )
          );
          break;
        }
      }
      if (!encontrado) Gb.rm(list_tipo[i].uid);
    }
  }
}

// Buscador de entidades mediante su ID, para poder depurar mejor
window.buscarEntidad = function buscarEntidad(id) {
  return Gb.resolve(id);
}

// PELIGRO, cuidado que toca cosas estrañas
window.borrarForzoso = function borrar(id) {
  console.error(" PELIGRO, cuidado que toca cosas estrañas");

  console.log(id);
  console.log(Gb.resolve(id));
  let pro = Gb.resolve(id);
  pro.guardians = [];
  Gb.set(pro);
  console.log(Gb.resolve(id));
}
window.ejemplo = function ejem() {
  let array = {
    sid: "Hola1",
    firstName: "H",
    lastName: "Hola1",
    guardians: ["Manolo1"],
    cid: "qwe12qwe"
  };

  array.firstName = "PEPE";

  console.log(array);
}

// FUNCION PARA RESETEAR LOS DATOS SI NO SE PULSA LOS BOTONES GUARDAR Y CANCELAR
function saveDatas() {
  //console.log("LLEga");
  for (let i = 0; i < listaClases.length; i++) {
    Gb.globalState.classes.push(listaClases[i]);
  }
  listaClases = [];

  for (let i = 0; i < listaEstudiantes.length; i++) {
    Gb.globalState.students.push(listaEstudiantes[i]);
  }
  listaEstudiantes = [];

  for (let i = 0; i < listaProfesores.length; i++) {
    Gb.globalState.users.push(listaProfesores[i]);
  }
  listaProfesores = [];
  for (let i = 0; i < listaResponsables.length; i++) {
    Gb.globalState.users.push(listaResponsables[i]);
  }
  listaResponsables = [];
  //window.loadAdminMenu();
}

//FUNCIONES DE ALERT

function sendAlert(tipo, texto) {
  let html = [];
  if (tipo == "OK") {
    html.push(
      '<div class="alert alert-success alert-dismissible fade show" role="alert">',
      texto,
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
      '<span aria-hidden="true">&times;</span>',
      '</button>',
      '</div>'
    )
  } else {
    html.push(
      '<div class="alert alert-danger alert-dismissible fade show" role="alert">',
      texto,
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
      '<span aria-hidden="true">&times;</span>',
      '</button>',
      '</div>'
    )
  }
  return $(html.join(''));
}

//FIN DE FUNCIONES DE ALERT
window.addCuadroTelefono = function addCuadroTelefono() {
  let nuevo = [
    '<div class="pt-2">',
    '<input type="text" class="form-control" name="telefonos" placeholder="Telefono">',
    '</div>',
  ]
  $("#contenedorTelefonos").append($(nuevo.join('')));
}

window.addCuadroAlumno = function addCuadroAlumno() {
  let nuevo = [
    '<div class="pt-2">',
    '<input type="text" class="form-control" name="alumnos" placeholder="Alumno">',
    '</div>',
  ]
  $("#contenedorAlumnos").append($(nuevo.join('')));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES DEL PROFESOR


// funcion para generar datos de ejemplo: clases, mensajes entre usuarios, ...
// se puede no-usar, o modificar libremente
async function populate(classes, minStudents, maxStudents, minParents, maxParents, msgCount) {
  const U = Gb.Util;

  // genera datos de ejemplo
  let classIds = classes || ["1A", "1B", "2A", "2B", "3A", "3B"];
  let minStudentsInClass = minStudents || 10;
  let maxStudentsInClass = maxStudents || 20;
  let minParentsPerStudent = minParents || 1;
  let maxParentsPerStudent = maxParents || 3;
  let userIds = [];
  let tasks = [];

  classIds.forEach(cid => {
    tasks.push(() => Gb.addClass(new Gb.EClass(cid)));
    let teacher = U.randomUser(Gb.UserRoles.TEACHER, [cid]);
    userIds.push(teacher.uid);
    tasks.push(() => Gb.addUser(teacher));

    let students = U.fill(U.randomInRange(minStudentsInClass, maxStudentsInClass), () => U.randomStudent(cid));
    students.forEach(s => {
      tasks.push(() => Gb.addStudent(s));
      let parents = U.fill(U.randomInRange(minParentsPerStudent, maxParentsPerStudent),
        () => U.randomUser(Gb.UserRoles.GUARDIAN, [], [s.sid]));
      parents.forEach(p => {
        userIds.push(p.uid);
        tasks.push(() => Gb.addUser(p));
      });
    });
  });
  tasks.push(() => Gb.addUser(U.randomUser(Gb.UserRoles.ADMIN)));
  U.fill(msgCount, () => U.randomMessage(userIds)).forEach(m => tasks.push(() => Gb.send(m)));

  // los procesa en secuencia contra un servidor
  for (let t of tasks) {
    try {
      console.log("Starting a task ...");
      await t().then(console.log("task finished!"));
    } catch (e) {
      console.log("ABORTED DUE TO ", e);
    }
  }
}