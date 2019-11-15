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
  for (let c in Gb.globalState.classes) {
    console.log("c es:")
    console.log(c);
    html.push('<option>', Gb.globalState.classes[c].cid, '</option>');
  }
  return $(html.join(''));
}

//Crea el inicio de sesión
function createLogin() {
  let idGrupo;
  let html = [
    '<div class="container">',
            '<div class="row d-flex justify-content-center mt-5 pt-5">',
                '<div class="col-0 col-lg-1"></div>',
                '<div class="col-lg-6">',
                    '<h1 class="display-1 text-center w-100 big-title">Garabato</h1>',
                '</div>',
            '</div>',
            '<form action="" method="post">',
                '<div class="row d-flex justify-content-center mt-4">',
                    '<div class="col-lg-1">Usuario:</div>',
                    '<div class="col-lg-6">',
                        '<input type="text" name="" id="" class="w-100">',
                    '</div>',
                '</div>',
                '<div class="row mt-3 d-flex justify-content-center">',
                    '<div class="col-lg-1">Contraseña:</div>',
                    '<div class="col-lg-6">',
                        '<input type="text" name="" id="" class="w-100">',
                    '</div>',
                '</div>',
                '<div class="row mt-3 d-flex justify-content-center">',
                    '<div class="col-0 col-lg-1"></div>',
                    '<div class="col-lg-6">',
                        '<button class="w-100 btn btn-success">Iniciar Sesión</button>',
                    '</div>',
                '</div>',
                '<div class="row d-flex justify-content-center">',
                    '<div class="col-0 col-lg-1"></div>',
                    '<div class="col-lg-6">',
                        '<button class="text-left w-100 btn btn-link">Recuperar contraseña</button>',
                    '</div>',
                '</div>',
            '</form>',
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

window.loadLogin = function loadMessage() {
  try {
    // vaciamos un contenedor
    $("#contenido").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#contenido").append(createLogin());
  } catch (e) {
    console.log('Error cargando los mensajes', e);
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

window.loadClass = function loadClass() {
  try {
    // vaciamos un contenedor
    $("#inputClaseMensaje").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#inputClaseMensaje").append(inputClass());
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error actualizando', e);
  }
}

window.crearClase = function crearClase() {
  try {
    debugger;
    Gb.addClass({
      cid: "1A Grupo6"
    })
    debugger;
    window.loadClass();
  } catch (e) {
    console.log('Error actualizando', e);
  }
}

// Servidor a utilizar. También puedes lanzar tú el tuyo en local (instrucciones en Github)
Gb.connect("http://gin.fdi.ucm.es:8080/api/");

if(Gb.serverToken == "no-has-hecho-login") {
  window.loadLogin();
}

// ejemplo de login
Gb.login("1Cx5DQ", "SNhXAw").then(d => console.log("login ok!", d));

// ejemplo de crear una clase, una vez logeados
window.crearClase();

// ejemplo de crear un usuario, una vez logueados como admin (los no-admin no pueden hacer eso)
Gb.addUser({
  "uid": "18950946G",
  "first_name": "Elena",
  "last_name": "Enseña Enséñez",
  "type": "teacher",
  "tels": ["141-456-781"],
  "password": "axarW!3",
  "classes": [
    "1A"
  ]
});

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
    $("#inputClaseAlumno").val()
  );
  window.Gb.addStudent(alumno);
  let aviso = "Alumno añadido\n" +
    "Id: " + alumno.sid + "\n" +
    "Nombre: " + alumno.first_name + "\n" +
    "Apellido: " + alumno.last_name + "\n" +
    "Id clase: " + alumno.cid;
  alert(aviso);
}

// Logica de crear un nuevo responsable
window.crearResponsable = function crearResponsable() {
  var telefonos = [];

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
    $("#inputApellidos").val() != "") {
    let responsable = new Gb.User(
      $("#inputID").val(),
      'guardian',
      $("#inputNombre").val(),
      $("#inputApellidos").val(),
      telefonos,
      [],
      []
    );

    //Pushes user to globalstate.
    Gb.addUser(responsable);
    console.log(responsable);


    var string_tlfs = "";
    for (let i = 0; i < telefonos.length; i++) {
      string_tlfs += telefonos[i] + " ";
    }
    //Notifies succesful push.
    let aviso = "Perfil actualizado correctamente:\n" +
      "ID: " + responsable.uid + "\n" +
      "Nombre completo: " + responsable.first_name + " " + responsable.last_name + "\n" +
      "Teléfonos: " + string_tlfs + "\n";
    alert(aviso);
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