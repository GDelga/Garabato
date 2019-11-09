"use strict"

// uses ES6 module notation (export statement is at the very end)
// see https://medium.freecodecamp.org/anatomy-of-js-module-systems-and-building-libraries-fadcd8dbd0e

/**
 * El estado global de la aplicación.
 */
class GlobalState {
  constructor(classes, students, users, messages) {
    this.classes = classes || [];
    this.students = students || [];
    this.users = users || [];
    this.messages = messages || [];
  }
}

/**
* Agrupa estudiantes y profesores
*/
class EClass {
    constructor(cid, students, teachers) {
    this.cid = cid;     // id de la clase
    this.students = students || []; // students; por SIDs (dnis o similar de estudiente)
    this.teachers = teachers || []; // profes; por UIDs (dnis o similar de "User")
  }
}

/**
* Un estudiante
*/
class Student {
    constructor(sid, first_name, last_name, cid, guardians) {
      this.sid = sid;
      this.first_name = first_name;
      this.last_name = last_name;
      this.cid = cid;
      this.guardians = guardians || []; // profes; por UIDs (dnis o similar de "User")
    }
}

/**
* Tipos de usuario
*/
const UserRoles = {
    ADMIN: 'admin',
    GUARDIAN: 'guardian',
    TEACHER: 'teacher',
}

/**
 * Un usuario no-estudiante
 */
class User {
    constructor(uid, type, first_name, last_name, tels, classes, students) {
        this.uid = uid;
        Util.checkEnum(type, UserRoles);
        this.type = type;
        this.first_name = first_name;
        this.last_name = last_name;
        this.tels = tels || [];
        this.classes = classes || [];   // cids de clases en las que tiene alumnos (admin: todas)
        this.students = students || []; // students; por SIDs; sólo para guardian
    }    
}

/**
* Tipos de mensaje
*/
const MessageLabels = {
    SENT: 'sent',
    RECVD: 'received',
    FAV: 'fav',
    READ: 'read',
    ARCH: 'arch'
}

/**
 * Un mensaje
 */
class Message {
    constructor(msgid, from, date, order, to, labels, title, body) {
        this.msgid = msgid;
        this.from = from;
        this.date = date || new Date();
        this.order = order;
        this.to = to;               // if array, contains UIDs. Otherwise, either a MSGID (=reply) or CID (=class)
        this.labels = labels || []; // of MessageLabels
        labels.forEach(label => Util.checkEnum(label, MessageLabels));
        this.title = title;   
        this.body = body;     
    }    
}


/**
 * Utilidades
 */
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '01234567890';

class Util {

    /**
     * throws an error if value is not in an enum
     */
    static checkEnum(a, enumeration) {
        const valid = Object.values(enumeration);
        if (a === undefined) {
            return;
        }
        if (valid.indexOf(a) === -1) {
        throw Error(
            "Invalid enum value " + a + 
            ", expected one of " + valid.join(", "));
        }
    }

    /**
    * Genera un entero aleatorio entre min y max, ambos inclusive
    * @param {Number} min 
    * @param {Number} max 
    */
    static randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    static randomChar(alphabet) {
      return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    
    static randomString(count, alphabet) {
      const n = count || 5;
      const valid = alphabet || UPPER + LOWER + DIGITS;
      return new Array(n).fill('').map(() => this.randomChar(valid)).join('');
    }

    /**
     * Genera un identificador "unico" de 5 caracteres
     */
    static randomWord(count, capitalized) {
        return capitalized ? 
             this.randomChar(UPPER) + this.randomString(count -1, LOWER) :
             this.randomString(count, LOWER);
    }
    
    /**
     * Genera palabras al azar, de forma configurable
     */
    static randomText(wordCount, allCapitalized, delimiter) {        
        let words = [ this.randomWord(5, true)];
        for (let i=1; i<(wordCount || 1); i++) words.push(this.randomWord(5, allCapitalized));
        return words.join(delimiter || ' ');
    }

    /**
     * Devuelve algo al azar de un array
     */
    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Devuelve n elementos no-duplicados de un array
     * de https://stackoverflow.com/a/11935263/15472
     */
    static randomSample(array, size) {
        var shuffled = array.slice(0), i = array.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    }

    /**
     * Genera un alumno al azar; con clase pero sin padres
     */
    static randomStudent(cid) {
        return new Student(
            Util.randomString(), 
            Util.randomText(1), Util.randomText(2, true), 
            cid, []);
    }

   /**
     * Genera un usuario del tipo indicado al azar, con una clase
     */
    static randomUser(type, classes, students) {
        let u = new User(
            Util.randomString(), 
            type,
            Util.randomText(1), Util.randomText(2, true), 
            Util.fill(Util.randomInRange(0, 2), () => {
                return Util.fill(3, ()=>""+Util.randomInRange(100, 999))
                    .join('-')
            }),
            classes,
            students
        );
        return u;        
    }    

    /**
     * Llena un array con el resultado de llamar a una funcion
     */
    static fill(count, callback) {
        let f = callback;
        let results = [];
        for (let i=0; i<count; i++) results.push(f());
        return results;
    }

   /**
     * Genera un mensaje
     */
    static randomMessage(users) {
        let date = Util.randomDate(new Date(2018, 0, 1), new Date());
        return new Message(
            Util.randomString(),
            Util.randomChoice(users),
            date,
            Util.transformDate(date),
            Util.fill(Util.randomInRange(1,5), () => Util.randomChoice(users)),
            Util.randomSample(Object.values(MessageLabels), Util.randomInRange(1,5)),
            Util.randomText(Util.randomInRange(3,7)),        
            Util.randomText(Util.randomInRange(10,20)));
    }
    
    static randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    /**
     * Este codigo ha sido copiado de StackOverflow:
     * 
     */
    static transformDate(date) {
        let actual = new Date();
        //Año actual
        if(date.getFullYear() == actual.getFullYear()) {
            // Miramos el mes
            if(date.getMonth() == actual.getMonth()) {
                // Miramos el dia
                if(date.getDate() == actual.getDate()) {
                    return "Hoy";
                }
                // Hace mas de un dia
                else {
                    // Mensajes de hace un dia (Ayer)
                    if(actual.getDate() - date.getDate() == 1) {
                        return "Ayer";
                    }
                    // Mensajes de hace 7 dias
                    else if(actual.getDate() - date.getDate() <= 7) {
                        return "Hace una semana"
                    }
                    // Si ha pasado menos de un mes
                    else return "Este mes"
                }
            }
            // Si ha pasado mas de un mes
            else {
                if(actual.getMonth() - date.getMonth() == 1) {
                    return "Hace un mes";
                }
                else if(actual.getMonth() - date.getMonth() <= 3) {
                    return "Hace tres meses";
                }
                else if(actual.getMonth() - date.getMonth() <= 8) {
                    return "Hace ocho meses";
                }
                else return "Menos de un año"
            }
        }
        //Mensajes de otro año
        else {
            if(actual.getFullYear() - date.getFullYear() == 1) {
                return "Hace un año";
            }
            //Muy antiguos
            else return "Hace mucho tiempo";
        }   
    }

    // Funcion que ordena los mensajes en funcion de su atributo DATE
    static groupByKeys(mensajes) {
        let groupByKey = {};
        /*console.log("MENSAJES PASADOS");
        console.log(mensajes);*/
        for(let m in mensajes) {
            // No existe
            if(groupByKey[mensajes[m].order] == undefined){
                groupByKey[mensajes[m].order] = [mensajes[m]];
            }
            // Ya existe
            else groupByKey[mensajes[m].order].push(mensajes[m]);
        }
        return groupByKey;
    }

    // Funcion que manda todos los mensajes a la funcion "send()"
    static sendAllMessages(mensajes) {
        for(let k in mensajes) {
           for(let m in mensajes[k]) {
               send(mensajes[k][m]);
           }
        }
    }

    // Para ordenar las fechas de menor a mayor
    static sortByDate(m1, m2) {
        let date1 = m1.date;
        let date2 = m2.date;
        //Miramos anyo
        if(date1.getFullYear() == date2.getFullYear()) {
            //Miramos mes
            if(date1.getMonth() == date2.getMonth()) {
                //Miramos dia
                if(date1.getDate() == date2.getDate()) return 0;
                else if(date1.getDate() < date2.getDate()) return 1;
                else return -1;
            }
            else if(date1.getMonth() < date2.getMonth()) return 1;
            else return -1;
        }
        else if(date1.getFullYear() < date2.getFullYear()) return 1;
        else return -1;
    }
 }


// cache de IDs; esto no se exporta
let cache = {};

// acceso y refresco de la cache de IDs; privado
function getId(id, object) {
    const found = cache[id] !== undefined;
    if (object) {
        if (found) throw Error("duplicate ID: " + id);
        cache[id] = object;
    } else {
        if (!found) throw Error("ID not found: " + id);
        return cache[id];
    }
}

// el estado global
let globalState = new GlobalState();   

// acceso externo a la cache
function resolve(id) {
    return cache[id];
}

function login(uid, pass) {
    // NOP por ahora
}

function addClass(eclass) {
    getId(eclass.cid, eclass);
    globalState.classes.push(eclass);
}

function addStudent(student) {
    getId(student.sid, student);
    globalState.students.push(student);
}

function addUser(user) {
    getId(user.uid, user);
    globalState.users.push(user);
}

function rm(id) {
    let o = getId(id);
    o.remove();     // FIXME: implementar en cada clase
    delete cache[id];
}

function set(id, value) {
    let o = getId(id);
    o.set(value);   // FIXME: implementar en cada clase
}

function send(message) {
    //console.log(message);
    getId(message.msgid, message);
    globalState.messages.push(message);
    //console.log(globalState.messages);
}

// lists symbols that will be available outside this module
export {
  
  // Classes
  EClass,        // a class; uses cid as id
  Student,       // a student; uses sid as id
  UserRoles,     // possible user roles
  User,          // a user: admin, teacher or guardian; uses uid
  MessageLabels, // possible message labels
  Message,       // a message; uses msgid
  GlobalState,   // the whole state of the application
  
  // State
  globalState,   // state of the application. What you should display 
  resolve,       // consulta un id en la cache

  // Methods. All use the token returned by login, and update globalState
  login,       // (uid, pass)
  addClass,    // (eclass)
  addStudent,  // (student)
  addUser,     // (user)
  rm,          // (cid || sid || uid || msgid) 
  set,         // (cid || sid || uid || msgid, eclass || student || user || message)
  send,        // (message)

  // Static utilities
  Util,
};
