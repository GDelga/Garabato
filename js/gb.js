import * as Gb from './gbapi.js'

// expone Gb para que esté accesible desde la consola
window.Gb = Gb;
const U = Gb.Util;
var classIds = ["1ºA", "1ºB", "2ºA", "2ºB", "3ºA", "3ºB"];

function inputClass() {
  let html = [];
  for (let c in classIds) {
    html.push('<option>', classIds[c], '</option>');
  }
  return $(html.join(''));
}

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

//
//
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").comportamiento(...)
//
//
// funcion de actualización de ejemplo. Llámala para refrescar interfaz
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

window.loadClass = function loadClass(id) {
  try {
    // vaciamos un contenedor
    $("#" + id).empty();
    // y lo volvemos a rellenar con su nuevo contenido
    $("#" + id).append(inputClass());
    // y asi para cada cosa que pueda haber cambiado $("#grupos").append(createGroupDate(date)
  } catch (e) {
    console.log('Error actualizando', e);
  }
}

window.loadData = function loadData() {
  /*
   * Genera datos de ejemplo
   */
  let userIds = [];
  classIds.forEach(cid => {
    let teacher = U.randomUser(Gb.UserRoles.TEACHER, [cid]);
    Gb.addUser(teacher);
    userIds.push(teacher.uid);

    let students = U.fill(U.randomInRange(15, 20), () => U.randomStudent(cid));

    students.forEach(s => {
      Gb.addStudent(s);

      let parents = U.fill(U.randomInRange(1, 2),
        () => U.randomUser(Gb.UserRoles.GUARDIAN, [cid], [s.sid]));
      parents.forEach(p => {
        s.guardians.push(p.uid);
        userIds.push(p.uid);
        Gb.addUser(p);
      });
    });

    Gb.addClass(new Gb.EClass(cid, [teacher], students));
  });
  Gb.addUser(U.randomUser(Gb.UserRoles.ADMIN));
  U.fill(30, () => U.randomMessage(userIds)).forEach(
    m => Gb.send(m)
  );

  // muestra un mensaje de bienvenida
  //console.log("online!", JSON.stringify(Gb.globalState, null, 2));
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