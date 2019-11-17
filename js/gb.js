"use strict"

import * as Gb from './gbapi.js'

// cosas que exponemos para usarlas desde la consola
window.populate = populate
window.Gb = Gb;
const U = Gb.Util;

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

//
// PARTE 1:
// Código de comportamiento, que sólo se llama desde consola (para probarlo) o desde la parte 2,
// en respuesta a algún evento.
//
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

// Crea un nuevo responsable
function createResponsables() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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
    '<a class="nav-item nav-link active" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
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
    '<option value="0">DNI</option>',
    '<option value="1">NOMBRE</option>',
    '<option value="2">APELLIDOS</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="table-wrapper-scroll-y my-custom-scrollbar">',
    '<div id="miTabla" class="table-editable ">',
    '<table class="table table-bordered table-responsive-md table-striped table-dark text-center" id="miTabla">',
    '<thead>',
    '<tr class="headerTabla">',
    '<th class="text-center">DNI</th>',
    '<th class="text-center">NOMBRE</th>',
    '<th class="text-center">APELLIDOS</th>',
    '<th class="text-center">TELÉFONOS</th>',
    '<th class="text-center">ALUMNOS</th>',
    '<th class="text-center">ELIMINAR</th>',
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
    '<button id="boton-cancelar" class="btn">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.crearResponsable()">',
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
    if (Gb.globalState.users[i].type != undefined && Gb.globalState.users[i].type == Gb.GUARDIAN) {
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
        '<a class="tituloSeccion" role="button">',
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
        '<a id="boton-remove" class="tituloSeccion" role="button" onclick="window.eliminarAlumno()">',
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
    return (html.join(''));
  }
}

// Funcion que hace el desplegable de los alumnos
function createDesplegableAlumnos(alumnos) {
  let html = [];
  for (let i in alumnos) {
    html.push(
      '<li class="list-group-item bg-dark">',
      '<div class="row">');
    html.push(Gb.getStudentById(alumnos[i]).first_name);
    html.push(
      '</div>',
      '</li>'
    );
    return (html.join(''));
  }
}


//Crea menu de administrador
function createAdminMenu() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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

//Crea menu de administrador
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
    '<div class=" lineas row d-flex justify-content-center align-items-center">',
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
    '<img src="imagenes/unread.png" alt="" class=" img-fluid"></img>',
    '<h1 class="text-center">Mensajes</h1>',
    '</a>',
    '</div>',
    '</div>',
  ];
  return $(html.join(''));
}

//Crea menu de administrador
function createAlumnos() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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
    '<option value="0">DNI</option>',
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
    '<th class="text-center">DNI</th>',
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
    '<button id="boton-cancelar" class="btn" onclick="window.loadAdminMenu()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.crearResponsable()">',
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
      '<a id="boton-remove" class="tituloSeccion" role="button" onclick="window.eliminarAlumno()">',
      'Remove',
      '</a>',
      //'<button id="boton-remove" class="btn tituloSeccion d-flex justify-content-center align-items-center" onclick="window.eliminarAlumno()"> Remove',
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
      '<div class="row">');
    html.push(Gb.getResponsableById(responsables[i]).first_name);
    html.push(
      '</div>',
      '</li>'
    );
    return (html.join(''));
  }
}

function createAddAlumnos() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-8 text-right">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadAlumnos()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-guardarAlumno" class="btn" onclick="window.crearAlumno()">',
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

function createAddResponsable() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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
    '<a class="nav-item nav-link  active" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
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
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="tlf1" placeholder="Tlf 1">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="tlf2" placeholder="Tlf 2 (Opcional)">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="tlf3" placeholder="Tlf 3 (Opcional)">',
    '</div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-8 text-right">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadResponsables()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
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

function createClases() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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
    '<a class="nav-item nav-link active" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
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
    '<option value="0">ID</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="table-wrapper-scroll-y my-custom-scrollbar">',
    '<div id="table" class="table-editable">',
    '<table class="table table-bordered table-responsive-md table-striped table-dark text-center" id="miTabla">',
    '<thead>',
    '<tr class="headerTabla">',
    '<th class="text-center">ID</th>',
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
    '</div>',
    '</div>',
  );

  return $(html.join(''));
}

function cargarClases() {
  let html = [];
  for (let i in Gb.globalState.classes) {
    html.push(
      '<tr>',
      '<td class="pt-3-half">', Gb.globalState.classes[i].cid, '</td>',
      '<td>',
      '<div class="table-remove card text-white bg-danger">',
      '<div class="card-header">',
      '<a class="tituloSeccion" role="button">',
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

function createAddClases() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
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
    '<a class="nav-item nav-link active" role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
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
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-8 text-right">',
    '<button id="boton-cancelar" class="btn">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
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

function createProfesores() {
  let html = [
    '<!-- Editable table -->',
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link" href="#">Alumnos</a>',
    '<a class="nav-item nav-link" href="#">Responsables</a>',
    '<a class="nav-item nav-link" href="#">Clases</a>',
    '<a class="nav-item nav-link active" href="#">Profesores</a>',
    '<a class="nav-item nav-link">Mensajes</a>',
    '</div>',
    '<!--Boton para cerrar sesion-->',
    '<div class="navbar-nav">',
    '<button type="button" class="btn btn-danger text-size">Cerrar Sesión</button>',
    '</div>',
    '</div>',
    '</nav>',
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
    '<button id="boton-cancelar" class="btn">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
    '<button id="boton-exportar" class="btn" onclick="window.crearProfesor()">',
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
        '<a class="tituloSeccion" role="button">',
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

function createAddProfesor() {
  let html = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<a class="navbar-brand d-flex" href="#">',
    '<h1 class="d-inline align-self-start">Garabato </h1>',
    '<h3 class="d-inline align-self-end pl-1"> Admin</h2>',
    '</a>',
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"',
    'aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">',
    '<span class="navbar-toggler-icon"></span>',
    '</button>',
    '<!--Las diferentes opciones de la barra de menu-->',
    '<div class="collapse navbar-collapse text-size text-center" id="navbarNavAltMarkup">',
    '<div class="navbar-nav ml-auto mr-auto">',
    '<a class="nav-item nav-link active" role="button" onclick="window.loadProfesores()">Profesores</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadAlumnos()">Alumnos</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadResponsables()">Responsables</a>',
    '<a class="nav-item nav-link " role="button" onclick="window.loadClases()">Clases</a>',
    '<a class="nav-item nav-link" role="button" onclick="window.loadMenuMensajes()">Mensajes</a>',
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
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="class1" placeholder="Clase 1">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="class2" placeholder="Clase 2 (Opcional)">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="class3" placeholder="Clase 3 (Opcional)">',
    '</div>',
    '<!--Botonera de telefonos-->',
    '<div class="row pt-2 align-items-center justify-content-center">',
    '<div class="col-md-2">',
    '<label for="inputTelefonos">Teléfonos:</label>',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="tlf1" placeholder="Tlf 1">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="tlf2" placeholder="Tlf 2 (Opcional)">',
    '</div>',
    '<div class="col-md-2">',
    '<input type="text" class="form-control" id="tlf3" placeholder="Tlf 3 (Opcional)">',
    '</div>',
    '</div>',
    '</div>',
    '<!-- botonera -->',
    '<div class="row text-left mt-3 justify-content-center">',
    '<div class="col-md-8 text-right">',
    '<button id="boton-cancelar" class="btn" onclick="window.loadProfesores()">',
    '<div class="img">',
    '<img class="img-rounded" src="imagenes/cancelar.png" height="50" width="50" alt="">',
    '</div>',
    '</button>',
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
  ];
  return $(html.join(''));
}

//Crear agrupamiento de mensajes
function createGroupDate(date) {
  let idGrupo;
  let html = [];
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
  return $(html.join(''));
}

function createGroupMessages(mensaje) {
  let html = [];
  for (let m in mensaje) {
    html.push(
      '<li class="list-group-item bg-light">',
      '<div class="row">',
      '<div class="col-6">',
      '<a href="" class="tituloMensaje">',
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
      '<a class="mr-2" href="responder.html">',
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

//
//
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").comportamiento(...)
//
//

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
    if (u !== undefined) {
      // la operación ha funcionado (u es el usuario que ha conseguido hacer login)
      console.log(u);
      usuarioIniciado = u;
      if (usuarioIniciado.type == Gb.UserRoles.ADMIN || usuarioIniciado.type == undefined) {
        window.loadAdminMenu();
      } else if (usuarioIniciado == Gb.UserRoles.TEACHER) {
        window.loadProfessorMenu();
      }
    } else {
      // ha habido un error (u ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_login = "Ha habido un problema al validar sus credenciales.\n" +
        "Usuario o contraseña incorrectos.\n"
      alert(aviso_error_login);
    }
  });

}

window.loadAdminMenu = function adminMenu() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAdminMenu());
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

window.loadAlumnos = function loadAlumnos() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createAlumnos());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

window.loadResponsables = function loadResponsables() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createResponsables());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

window.loadClases = function loadClases() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createClases());
  } catch (e) {
    console.log('Error cargando las clases', e);
  }
}

window.loadProfesores = function loadProfesores() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createProfesores());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

window.loadMenuMensajes = function loadProfesores() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createMenuMensajes());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

window.cerrarSesion = function loadProfesores() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createMenuMensajes());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
}

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

// funcion para cargar los mensajes
window.loadMessage = function loadMessage() {
  try {
    if (Gb.globalState.messages.length == 0) {
      window.loadData();
    }
    // vaciamos un contenedor
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    Gb.globalState.messages.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(Gb.globalState.messages);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error cargando los mensajes', e);
  }
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

// Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
Gb.connect("http://gin.fdi.ucm.es:8080/api/");

/*if(Gb.serverToken == "no-has-hecho-login") {
  window.loadLogin();
}*/

// ejemplo de login

// ejemplo de crear una clase, una vez logeados
//window.crearClase();

// ejemplo de crear un usuario, una vez logueados como admin (los no-admin no pueden hacer eso)
/*Gb.addUser({
  "uid": "18950946G",
  "first_name": "Elena",
  "last_name": "Enseña Enséñez",
  "type": "teacher",
  "tels": ["141-456-781"],
  "password": "axarW!3",
  "classes": [
    "1A"
  ]
});*/

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

//Funcion para crear un nuevo alumno
window.crearAlumno = function crearAlumno() {
  let alumno = new Gb.Student(
    $("#inputIDAlumno").val(),
    $("#inputNombreAlumno").val(),
    $("#inputApellidosAlumno").val(),
    $("#inputClase").val()
  );
  window.Gb.addStudent(alumno).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      let aviso = "Alumno añadido\n" +
        "Id: " + alumno.sid + "\n" +
        "Nombre: " + alumno.first_name + "\n" +
        "Apellido: " + alumno.last_name + "\n" +
        "Id clase: " + alumno.cid;
      alert(aviso);
      window.loadAlumnos();
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_add_alumno = "Error al añadir alumno.\n" +
        "Comprueba que los campos introducidos son correctos.\n"
      alert(aviso_error_add_alumno);
    }

  });
}

// Logica de crear un nuevo responsable
window.crearResponsable = function crearResponsable() {
  var telefonos = [];
  debugger;
  //Meter telefonos solo si el primer campo esta relleno.
  if ($("#tlf1").val() != "") {
    telefonos.push($("#tlf1").val());
    if ($("#tlf2").val() != "") {
      telefonos.push($("#tlf2").val());
    }
    if ($("#tlf3").val() != "") {
      telefonos.push($("#tlf3").val());
    }
  }

  //If form correctly filled
  if (telefonos.length > 0 &&
    $("#inputID").val() != "" &&
    $("#inputNombre").val() != "" &&
    $("#inputApellidos").val() != "" &&
    $("#inputContra").val() != "") {
    let responsable = new Gb.User(
      $("#inputID").val(),
      Gb.UserRoles.GUARDIAN,
      $("#inputNombre").val(),
      $("#inputApellidos").val(),
      telefonos,
      [],
      [],
      $("#inputContra").val()
    );

    console.log("Datos responsables: " + responsable);
    //Pushes user to globalstate.
    Gb.addUser(responsable).then(d => {
      if (d !== undefined) {
        // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
        var string_tlfs = "";
        for (let i = 0; i < telefonos.length; i++) {
          string_tlfs += telefonos[i] + " ";
        }
        let aviso = "Usuario añadido\n" +
          "ID: " + responsable.uid + "\n" +
          "Nombre completo: " + responsable.first_name + " " + responsable.last_name + "\n" +
          "Teléfonos: " + string_tlfs + "\n";
        alert(aviso);
        window.loadResponsables();
      } else {
        // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
        let aviso_error_add_alumno = "Error al añadir usuario.\n" +
          "Comprueba que los campos introducidos son correctos.\n"
        alert(aviso_error_add_alumno);
      }

    });
    console.log(responsable);
  } else {
    //Notifies unsuccesful push.
    let aviso_error = "Error: El formulario no se ha rellenado correctamente.\n";
    alert(aviso_error);
  }
}

// Logica de crear un nuevo profesor
window.crearProfesor = function crearProfesor() {
  var clases = [];
  var telefonos = [];
  debugger;

  //Meter telefonos solo si el primer campo esta relleno.
  if ($("#tlf1").val() != "") {
    telefonos.push($("#tlf1").val());
    if ($("#tlf2").val() != "") {
      telefonos.push($("#tlf2").val());
    }
    if ($("#tlf3").val() != "") {
      telefonos.push($("#tlf3").val());
    }
  }

  //Meter clases solo si el primer campo está relleno.
  if ($("#class1").val() != "") {
    clases.push($("#class1").val());
    if ($("#class2").val() != "") {
      clases.push($("#class2").val());
    }
    if ($("#class3").val() != "") {
      clases.push($("#class3").val());
    }
  }

  //If form correctly filled
  if (clases.length > 0 &&
      telefonos.length > 0 &&
    $("#inputID").val() != "" &&
    $("#inputNombre").val() != "" &&
    $("#inputApellidos").val() != "" &&
    $("#inputContra").val() != "") {
    let profesor = new Gb.User(
      $("#inputID").val(),
      Gb.UserRoles.TEACHER,
      $("#inputNombre").val(),
      $("#inputApellidos").val(),
      telefonos,
      clases,
      [],
      $("#inputContra").val()
    );

    console.log("Datos profesores: " + profesor);
    //Pushes user to globalstate.
    Gb.addUser(profesor).then(d => {
      if (d !== undefined) {
        // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
        var string_clases = "", string_tlfs = "";

        for (let i = 0; i < telefonos.length; i++) {
          string_tlfs += telefonos[i] + " ";
        }

        for (let i = 0; i < clases.length; i++) {
          string_clases += clases[i] + " ";
        }
        let aviso = "Usuario añadido\n" +
          "ID: " + profesor.uid + "\n" +
          "Nombre completo: " + profesor.first_name + " " + profesor.last_name + "\n" +
          "Teléfonos: " + string_tlfs + "\n" +
          "Clases: " + string_clases + "\n";
        alert(aviso);
        window.loadProfesores();
      } else {
        // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
        let aviso_error_add_prof = "Error al añadir usuario.\n" +
          "Comprueba que los campos introducidos son correctos.\n"
        alert(aviso_error_add_prof);
      }

    });
    console.log(profesor);
  } else {
    //Notifies unsuccesful push.
    let aviso_error = "Error: El formulario no se ha rellenado correctamente.\n";
    alert(aviso_error);
  }
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
// favoritos, archivados, enviados, recibidos, no leidos
// Funcion que carga los mensajes archivados
window.loadMessageArchivados = function loadMessageArchivos() {
  try {
    // vaciamos un contenedor
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    // busco los mensajes archivados y los guardo
    let archivados = [];
    // Recorro los mensajes
    for (let mensaje in Gb.globalState.messages) {
      // Miro los labels, en busca del label "arch"
      for (let pos in mensaje.labels) {
        if (pos == Gb.MessageLabels.ARCH) {
          archivados.push(mensaje);
          break;
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    archivados.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(archivados);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)*/
  } catch (e) {
    console.log('Error al cargar los mensajes archivados', e);
  }
}

// Funcion que carga los mensajes favoritos
window.loadMessageFavoritos = function loadMessageFavoritos() {
  try {
    // vaciamos un contenedor
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let favoritos = [];
    for (let mes in Gb.globalState.messages) {
      for (let label in mes.MessageLabels) {
        if (label == Gb.MessageLabels.FAV) {
          favoritos.push(mes);
          break;
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    favoritos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(favoritos);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes favoritos', e);
  }
}

// Funcion que carga los mensajes recibidos
window.loadMessageRecibidos = function loadMessageRecibidos() {
  try {
    // vaciamos un contenedor
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let recibidos = [];
    for (let mes in Gb.globalState.messages) {
      for (let label in mes.MessageLabels) {
        if (label == Gb.MessageLabels.RECVD) {
          recibidos.push(mes);
          break;
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    recibidos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(recibidos);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes recibidos', e);
  }
}

// Funcion que carga los mensajes leidos
window.loadMessageLeidos = function loadMessageLeidos() {
  try {
    // vaciamos un contenedor
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    let leidos = [];

    for (let mes in Gb.globalState.messages) {
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

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    leidos.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(leidos);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes leidos', e);
  }
}

// Funcion que carga los mensajes enviados
window.loadMessageEnviados = function loadMessageEnviados() {
  try {
    // vaciamos un contenedor
    $("#mensajes").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    // busco los mensajes archivados y los guardo
    let enviados = [];
    // Recorro los mensajes
    for (let mensaje in Gb.globalState.messages) {
      // Miro los labels, en busca del label "sent"
      for (let etiq in mensaje.labels) {
        //Comprobamos que el mensaje es "Enviado" por el usuario logueado
        if (etiq == Gb.MessageLabels.SENT &&
          mensaje.from == usuarioIniciado.uid) {
          enviados.push(mensaje);
          break;
        }
      }
    }

    // Ordenamos los mensajes, por si se ha añadido uno nuevo
    enviados.sort(U.sortByDate);
    let mensajesAgrupados = U.groupByKeys(enviados);
    // Nos recorremos los mensajes agrupados
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)*/
  } catch (e) {
    console.log('Error al cargar los mensajes enviados', e);
  }
}

// Funcion que carga los mensajes no leidos
window.loadMessageNoLeidos = function loadMessageNoLeidos() {
  try {
    // vaciamos un contenedor
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
    $("#mensajes").append(createGroupDate(mensajesAgrupados));
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error al cargar los mensajes no leidos', e);
  }
}

//Funcion para crear una nueva clase
window.crearClase = function crearClase() {
  let clase = new Gb.EClass(
    $("#inputNombre").val()
  );
  window.Gb.addClass(clase).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      let aviso = "Clase añadida\n" +
        "Id: " + clase.cid + "\n"
      alert(aviso);
      window.loadClases();
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_add_clase = "Error al añadir clase.\n" +
        "Comprueba que los campos introducidos son correctos.\n"
      alert(aviso_error_add_clase);
    }

  });
}

// Funcion para eliminar un alumno de la tabla 
window.eliminarAlumno = function eliminarAlumno() {

  let id_alumno = $("#boton-remove").parents('td').parents('tr')[0].innerText.replace(/ +/g, " ").replace(/	+/g, " ").split(" ")[0];
  $("#boton-remove").parents('tr').detach();
  console.log(id_alumno);
  Gb.rm(id_alumno).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      console.log("Alumno borrado con exito")
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_del_alumno = "Error al eliminar alumno.\n" +
        "Algo ha ido mal.\n"
      alert(aviso_error_del_alumno);
    }
  });
}

// Funcion para eliminar un profesor de la tabla
window.eliminarProfesor = function eliminarProfesor() {

  let id_profe = $("#boton-remove").parents('td').parents('tr')[0].innerText.replace(/ +/g, " ").replace(/	+/g, " ").split(" ")[0];
  $("#boton-remove").parents('tr').detach();
  console.log(id_profe);
  Gb.rm(id_profe).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      console.log("Profesor borrado con exito");
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_eliminar_profe = "Error al eliminar profesor.\n" +
        "Algo ha ido mal.\n"
      alert(aviso_error_eliminar_profe);
    }
  });
}

// Funcion para eliminar una clase de la tabla
window.eliminarClase = function eliminarClase() {

  let id_clase = $("#boton-remove").parents('td').parents('tr')[0].innerText.replace(/ +/g, " ").replace(/	+/g, " ").split(" ")[0];
  $("#boton-remove").parents('tr').detach();
  console.log(id_clase);
  Gb.rm(id_clase).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      console.log("Profesor borrado con exito");
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_eliminar_clase = "Error al eliminar clase.\n" +
        "Algo ha ido mal.\n"
      alert(aviso_error_eliminar_clase);
    }
  });
}

// Funcion para eliminar un Mensaje de la tabla
window.eliminarMensaje = function eliminarMensaje() {

  let id_Mensaje = $("#boton-remove").parents('td').parents('tr')[0].innerText.replace(/ +/g, " ").replace(/	+/g, " ").split(" ")[0];
  $("#boton-remove").parents('tr').detach();
  console.log(id_mensaje);
  Gb.rm(id_mensaje).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      console.log("Profesor borrado con exito");
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_eliminar_mensaje = "Error al eliminar mensaje.\n" +
        "Algo ha ido mal.\n"
      alert(aviso_error_eliminar_mensaje);
    }
  });
}

// Funcion para eliminar un Responsable de la tabla
window.eliminarResponsable = function eliminarResponsable() {

  let id_Responsable = $("#boton-remove").parents('td').parents('tr')[0].innerText.replace(/ +/g, " ").replace(/	+/g, " ").split(" ")[0];
  $("#boton-remove").parents('tr').detach();
  console.log(id_responsable);
  Gb.rm(id_responsable).then(d => {
    if (d !== undefined) {
      // la operación ha funcionado (d ha vuelto como un gameState válido, y ya se ha llamado a updateState): aquí es donde actualizas la interfaz
      console.log("Profesor borrado con exito");
    } else {
      // ha habido un error (d ha vuelto como undefined; en la consola se verá qué ha pasado)
      let aviso_error_eliminar_responsable = "Error al eliminar responsable.\n" +
        "Algo ha ido mal.\n"
      alert(aviso_error_eliminar_responsable);
    }
  });
}





// DATOS PARA CREAR UN PROFESOR
//DNI, NOMBRE APELLIDOS, ID CLASE(VARIAS)