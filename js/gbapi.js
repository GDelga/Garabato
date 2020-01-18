"use strict"

/**
 * Librería de cliente para interaccionar con el servidor de Garabatos.
 * Prácticas de IU 2019-20
 *
 * Para las prácticas, por favor - NO TOQUES ESTE CÓDIGO.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él, que es esencialmente
 * lo que quieras siempre y cuando no digas que lo escribiste tú o me persigas por haberlo escrito mal.
 */

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
        this.cid = cid; // id de la clase
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
    constructor(uid, type, first_name, last_name, tels, classes, students, pass) {
        this.uid = uid;
        Util.checkEnum(type, UserRoles);
        this.type = type;
        this.first_name = first_name;
        this.last_name = last_name;
        this.tels = tels || [];
        this.classes = classes || []; // cids de clases en las que tiene alumnos (solo si profe)
        this.students = students || []; // students; por SIDs (solo si padre)
        this.password = pass;
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
    constructor(msgid, date, from, to, labels, title, body, parent) {
        this.msgid = msgid;
        this.date = date || new Date(),
            this.from = from;
        if (parent) {
            this.parent = parent; // msgid of parent, only if reply. If reply, no "to"
        } else {
            this.to = to; // array with UIDs and/or CIDs (to send to aclass)
        }
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

    static randomPass() {
        const n = 7;
        const prefix = this.randomChar(UPPER) + this.randomChar(LOWER) + this.randomChar(DIGITS);
        const valid = UPPER + LOWER + DIGITS;
        return prefix + new Array(n - 3).fill('').map(() => this.randomChar(valid)).join('');
    }

    /**
     * Genera un identificador "unico" de 5 caracteres
     */
    static randomWord(count, capitalized) {
        return capitalized ?
            this.randomChar(UPPER) + this.randomString(count - 1, LOWER) :
            this.randomString(count, LOWER);
    }

    /**
     * Genera palabras al azar, de forma configurable
     */
    static randomText(wordCount, allCapitalized, delimiter) {
        let words = [this.randomWord(5, true)];
        for (let i = 1; i < (wordCount || 1); i++) words.push(this.randomWord(5, allCapitalized));
        return words.join(delimiter || ' ');
    }

    /**
     * Devuelve algo al azar de un array
     */
    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Genera una fecha al azar entre 2 dadas
     * https://stackoverflow.com/a/19691491
     */
    static randomDate(fechaIni, maxDias) {
        let dia = new Date(fechaIni);
        dia.setDate(dia.getDate() - Util.randomInRange(1, maxDias));
        return dia;
    }

    /**
     * Devuelve n elementos no-duplicados de un array
     * de https://stackoverflow.com/a/11935263/15472
     */
    static randomSample(array, size) {
        var shuffled = array.slice(0),
            i = array.length,
            temp, index;
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
            Util.fill(Util.randomInRange(1, 3), () => {
                return Util.fill(3, () => "" + Util.randomInRange(100, 999))
                    .join('-')
            }),
            classes,
            students,
            Util.randomPass()
        );
        return u;
    }

    /**
     * Llena un array con el resultado de llamar a una funcion
     */
    static fill(count, callback) {
        let f = callback;
        let results = [];
        for (let i = 0; i < count; i++) results.push(f());
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
            Util.fill(Util.randomInRange(1, 5), () => Util.randomChoice(users)),
            Util.randomSample(Object.values(MessageLabels), Util.randomInRange(1, 5)),
            Util.randomText(Util.randomInRange(3, 7)),
            Util.randomText(Util.randomInRange(10, 20)));
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

// sube datos en json, espera json de vuelta; lanza error por fallos (status != 200)
function go(url, method, data = {}) {
    let params = {
        method: method, // POST, GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data)
    };
    if (method === "GET") {
        // GET requests cannot have body; I could URL-encode, but it would not be used here
        delete params.body;
    }
    console.log("sending", url, params)
    return fetch(url, params).then(response => {
        if (response.ok) {
            return data = response.json();
        } else {
            response.text().then(t => {
                throw new Error(t + ", at " + url)
            });
        }
    })
}

// actualiza el estado de la aplicación con el resultado de una petición
function updateState(data) {
    if (data === undefined) {
        return; // excepto si la petición no devuelve nada
    }
    cache = {};
    /*let mensajes = [];
    for(let i in data.messages) {
        if (Object.keys(data.messages[i]).length != 0) {
            mensajes.push(data.messages[i]);
        } 
    }*/
    debugger;
    globalState = new GlobalState(data.classes, data.students, data.users, data.messages);
    
    globalState.classes.forEach(o => getId(o.cid, o));
    globalState.students.forEach(o => getId(o.sid, o));
    globalState.users.forEach(o => getId(o.uid, o));
    globalState.messages.forEach(o => getId(o.msgid, o));
    console.log("Updated state", globalState);
    return data;
}

// el estado global
let globalState = new GlobalState();

// la direccion del servidor
let serverApiUrl = "//localhost:8080/api/";

// el token actual (procedente del ultimo login)
let serverToken = "no-has-hecho-login";

// llama a esto con la URL de la api a la que te quieres conectar
function connect(apiUrl) {
    serverApiUrl = apiUrl;
    serverToken = "no-has-hecho-login";
}

// acceso externo a la cache
function resolve(id) {
    return cache[id];
}

// hace login. Todas las futuras operaciones usan el token devuelto
function login(uid, pass) {
    return go(serverApiUrl + "login", 'POST', {
            uid: uid,
            password: pass
        })
        .then(d => {
            if (!d) return;
            serverToken = d.token;
            return updateState(d);
        });
}

// hace logout, destruyendo el token usado
function logout(id) {
    return go(serverApiUrl + serverToken + "/logout", 'POST', id);
}

// añade una nueva clase; alumnos y profes, si se especifican, deben existir
function addClass(eclass) {
    return go(serverApiUrl + serverToken + "/addclass", 'POST', eclass)
        .then(d => updateState(d));
}

// añade un nuevo alumno; clases y padres, si se especifican, deben existir
function addStudent(student) {
    return go(serverApiUrl + serverToken + "/addstudent", 'POST', student)
        .then(d => updateState(d));
}

// añade un usuario; debe incluir tipo, uid, contraseña, y al menos 1 telefono
function addUser(user) {
    return go(serverApiUrl + serverToken + "/adduser", 'POST', user)
        .then(d => updateState(d));
}

// elimina un objeto, por id
function rm(id) {
    return go(serverApiUrl + serverToken + "/rm/" + id, 'POST')
        .then(d => updateState(d));
}

// modifica un objeto. Cualquier referencia debe existir
function set(o) {
    return go(serverApiUrl + serverToken + "/set/", 'POST', o)
        .then(d => updateState(d));
}

// envia un mensaje
function send(message) {
    return go(serverApiUrl + serverToken + "/send", 'POST', message)
        .then(d => updateState(d));
}

// actualiza el estado de la aplicación
function list() {
    return go(serverApiUrl + serverToken + "/list", 'POST')
        .then(d => updateState(d));
}

// inicializa la aplicación del servidor -- pero sólo cuando está 100% vací
function initialize() {
    return go(serverApiUrl + "initialize", 'GET')
        .then(d => console.log(d));
}

// cosas que estarán disponibles desde fuera de este módulo
export {

    // Clases
    EClass, // a class; uses cid as id
    Student, // a student; uses sid as id
    UserRoles, // possible user roles
    User, // a user: admin, teacher or guardian; uses uid
    MessageLabels, // possible message labels
    Message, // a message; uses msgid
    GlobalState, // the whole state of the application

    // Estado
    globalState, // el estado de la aplicación, según la última respuesta
    resolve, // consulta un id en la cache
    connect, // establece URL del servidor. Debe llamarse antes de nada

    // Métodos. Todos (menos login / initialize) usan el token que devuelve login
    login, // (uid, pass) --> returns valid token for user
    logout, // ()          --> deletes a valid token
    addClass, // (eclass)
    addStudent, // (student)
    addUser, // (user)
    rm, // (cid || sid || uid || msgid) 
    set, // (eclass || student || user || message)
    send, // (message)
    list, // ()

    initialize, // ()          --> se puede llamar sólo 1 vez, tras limpiar el servidor

    // Utilidades varias que no forman parte de la API
    Util,
};