import * as Gb from './gbapi.js'

function createGroupDate(date) {
  let idGrupo;
  let html = [];
  for (let d in date) {
    idGrupo = 'x_' + Math.floor(Math.random()*10000000);
    html.push(
      '<div class="card text-white bg-dark">',
                '<div class="card-header">',
                    '<a class="tituloSeccion" data-toggle="collapse" href="#',idGrupo, '" role="button"',
                        'aria-controls=', idGrupo,'>',
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
  for(let m in mensaje) {
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
    if(mensaje[m].labels.includes(Gb.MessageLabels.READ)) {
      html.push(
        '<img class="iconos" src="imagenes/read.png" alt="">'
      );
    }
    else {
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
    if(mensaje[m].labels.includes(Gb.MessageLabels.ARCH)) {
      html.push(
        '<img class="iconos" src="imagenes/archivados.png" alt="">'
      );
    }
    else {
      html.push(
        '<img class="iconos" src="imagenes/no-archivados.png" alt="">'
      );
    }
    html.push(
                              '</a>',
                              '<a class="mr-2" href="#">');
    // Para disntinguir entre favoritos y no favoritos
    if(mensaje[m].labels.includes(Gb.MessageLabels.FAV)) {
      html.push(
        '<img class="iconos" src="imagenes/favorito-activado.png" alt="">'
      );
    }
    else {
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
  return  (html.join(''));
}

function createVmItem(params) {
  const stateToBadge = {
    start: 'success',
    stop: 'danger',
    suspend: 'secondary',
    reset: 'warning'
  }
  const html = [
    '<li id="vm_',
    params.name,
    '" ',
    'class="list-group-item d-flex justify-content-between align-items-center">',
    params.name,
    '<span class="badge badge-',
    stateToBadge[params.state],
    ' badge-pill estado">&nbsp;</span>',
    '</li>'
  ];
  return html.join('');
}

//
//
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").comportamiento(...)
//
//
$(function() { 
  // expone Gb para que esté accesible desde la consola
  window.Gb = Gb;
  const U = Gb.Util;
  // funcion de actualización de ejemplo. Llámala para refrescar interfaz
  window.demo = function update(result) {
    try {
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
      console.log('Error actualizando', e);
    }
  }

  

  // genera datos de ejemplo
  let classIds = ["1A", "1B", "2A", "2B", "3A", "3B"];
  let userIds = [];
  classIds.forEach(cid => {
    let teacher = U.randomUser(Gb.UserRoles.TEACHER, [cid]);
    Gb.addUser(teacher);
    userIds.push(teacher.uid);

    let students = U.fill(U.randomInRange(15,20), () => U.randomStudent(cid));

    students.forEach(s => {
      Gb.addStudent(s);           

      let parents = U.fill(U.randomInRange(1,2), 
        () => U.randomUser(Gb.UserRoles.GUARDIAN, [cid], [s.sid]));
      parents.forEach( p => {
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
  console.log("online!", JSON.stringify(Gb.globalState, null, 2));
  // Para cargar los mensajes generados aleatoriamente
  window.demo();
});
