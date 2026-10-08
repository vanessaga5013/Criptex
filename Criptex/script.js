
/* =====================================
   VARIABLES
===================================== */

const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let palabraSecreta = "";

let posiciones = [];

let intentos = 0;

const maxIntentos = 5;

let pistas = [];


/* =====================================
   ELEMENTOS HTML
===================================== */

const palabraInput = document.getElementById("palabraSecreta");

const pista1Input = document.getElementById("pista1");

const pista2Input = document.getElementById("pista2");

const pista3Input = document.getElementById("pista3");

const crearCriptex = document.getElementById("crearCriptex");

const zonaCriptex = document.getElementById("zonaCriptex");

const panelConfiguracion =
    document.querySelector(".panel-configuracion");

const ruedas = document.getElementById("ruedas");

const comprobar = document.getElementById("comprobar");

const mensaje = document.getElementById("mensaje");

const intentosTexto = document.getElementById("intentos");

const estadoTexto = document.getElementById("estadoTexto");

const listaPistas = document.getElementById("listaPistas");

const modalVictoria =
    document.getElementById("modalVictoria");

const modalBloqueo =
    document.getElementById("modalBloqueo");

const palabraDescubierta =
    document.getElementById("palabraDescubierta");

const cerrarVictoria =
    document.getElementById("cerrarVictoria");

const reiniciar =
    document.getElementById("reiniciar");


/*  CREAR CRIPTEX */

crearCriptex.addEventListener("click", function() {

    let palabra = palabraInput.value
        .toUpperCase()
        .trim();


    /*  VALIDAR PALABRA */

    if (palabra === "") {

        alert("Escribe una palabra secreta.");

        return;
    }


    if (!/^[A-ZÁÉÍÓÚÑ]+$/.test(palabra)) {

        alert("Utiliza solamente letras.");

        return;
    }


    /*GUARDAR PALABRA*/

    palabraSecreta = quitarAcentos(palabra);


    /* GUARDAR PISTAS */

    pistas = [

        pista1Input.value.trim() ||
        "Observa cuidadosamente.",

        pista2Input.value.trim() ||
        "La respuesta está frente a ti.",

        pista3Input.value.trim() ||
        "Piensa antes de girar."

    ];


    /*  REINICIAR VARIABLES */

    intentos = 0;

    posiciones = [];


    for (
        let i = 0;
        i < palabraSecreta.length;
        i++
    ) {

        posiciones.push(0);

    }


    /*CREAR RUEDAS*/

    crearRuedas();

    mostrarPistas();

    actualizarIntentos();


    /*MOSTRAR CRIPTEX */

    zonaCriptex.classList.remove("oculto");


    /*OCULTAR CONFIGURACIÓN
       
       IMPORTANTE:
       Después de crear el Criptex,
       el jugador ya no puede regresar
       al formulario para ver la palabra.*/

    panelConfiguracion.style.display = "none";


    /*MENSAJE */

    mensaje.textContent =
        "El Criptex está listo. ¡Descifra la palabra!";

    mensaje.style.color = "#8eeaff";


    /* LLEVAR AL JUGADOR AL CRIPTEX*/

    setTimeout(function() {

        zonaCriptex.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 200);


});


/* CREAR RUEDAS */

function crearRuedas() {

    ruedas.innerHTML = "";


    for (
        let i = 0;
        i < palabraSecreta.length;
        i++
    ) {

        const rueda =
            document.createElement("div");

        rueda.classList.add("rueda");


        /* LETRA */

        const letra =
            document.createElement("div");

        letra.classList.add("letra");

        letra.id = "letra-" + i;

        letra.textContent = "A";


        /* CONTROLES */

        const controles =
            document.createElement("div");

        controles.classList.add("control");


        const botonArriba =
            document.createElement("button");

        botonArriba.textContent = "▲";


        const botonAbajo =
            document.createElement("button");

        botonAbajo.textContent = "▼";


        /* BOTÓN ARRIBA */

        botonArriba.addEventListener(
            "click",
            function() {

                moverRueda(i, 1);

            }
        );


        /* BOTÓN ABAJO */

        botonAbajo.addEventListener(
            "click",
            function() {

                moverRueda(i, -1);

            }
        );


        controles.appendChild(botonArriba);

        controles.appendChild(botonAbajo);


        rueda.appendChild(letra);

        rueda.appendChild(controles);

        ruedas.appendChild(rueda);

    }

}


/* MOVER RUEDA */

function moverRueda(indice, cantidad) {

    posiciones[indice] += cantidad;


    /* SI LLEGA AL FINAL */

    if (
        posiciones[indice] >= letras.length
    ) {

        posiciones[indice] = 0;

    }


    /* SI BAJA DEL PRINCIPIO */

    if (
        posiciones[indice] < 0
    ) {

        posiciones[indice] =
            letras.length - 1;

    }


    /* ACTUALIZAR LETRA */

    const letra =
        document.getElementById(
            "letra-" + indice
        );


    letra.textContent =
        letras[posiciones[indice]];


    /* ANIMACIÓN */

    letra.classList.remove("giro");

    void letra.offsetWidth;

    letra.classList.add("giro");


    /* SONIDO */

    reproducirSonido("giro");

}


/*COMPROBAR PALABRA*/

comprobar.addEventListener(
    "click",
    function() {

        if (palabraSecreta === "") {

            return;

        }


        let combinacion = "";


        for (
            let i = 0;
            i < posiciones.length;
            i++
        ) {

            combinacion +=
                letras[posiciones[i]];

        }


        /* COMPROBACIÓN */

        if (
            combinacion === palabraSecreta
        ) {

            ganar();

        } else {

            fallo();

        }

    }
);


     /*CUANDO FALLA*/

function fallo() {

    intentos++;

    actualizarIntentos();


    /* PRIMER ERROR */

    if (intentos === 1) {

        desbloquearPista(0);

    }


    /* TERCER ERROR */

    if (intentos === 3) {

        desbloquearPista(1);

    }


    /* CUARTO ERROR */

    if (intentos === 4) {

        desbloquearPista(2);

    }


    /* QUINTO ERROR */

    if (intentos >= maxIntentos) {

        bloquearCriptex();

        return;

    }


    mensaje.textContent =
        "❌ Combinación incorrecta. Intenta nuevamente.";

    mensaje.style.color = "#ff8b8b";


    reproducirSonido("error");

}


/* ACTUALIZAR INTENTOS*/

function actualizarIntentos() {

    let resultado = "";


    for (
        let i = 0;
        i < maxIntentos;
        i++
    ) {

        if (
            i < maxIntentos - intentos
        ) {

            resultado += "★ ";

        } else {

            resultado += "☆ ";

        }

    }


    intentosTexto.textContent =
        resultado;

}


/*MOSTRAR PISTAS */

function mostrarPistas() {

    listaPistas.innerHTML = "";


    for (
        let i = 0;
        i < pistas.length;
        i++
    ) {

        const div =
            document.createElement("div");

        div.classList.add("pista");

        div.id = "pista-" + i;

        div.textContent =
            "🔒 Pista bloqueada";


        listaPistas.appendChild(div);

    }

}


/* DESBLOQUEAR PISTA */

function desbloquearPista(numero) {

    const pista =
        document.getElementById(
            "pista-" + numero
        );


    if (pista) {

        pista.textContent =
            "💡 " + pistas[numero];

        pista.classList.remove(
            "bloqueada"
        );

    }

}


/* GANAR */

function ganar() {

    estadoTexto.textContent =
        "DESBLOQUEADO";


    estadoTexto.style.color =
        "#72ffb3";


    mensaje.textContent =
        "✨ ¡La combinación es correcta! ✨";


    mensaje.style.color =
        "#72ffb3";


    palabraDescubierta.textContent =
        palabraSecreta;


    modalVictoria.classList.add(
        "activo"
    );


    reproducirSonido("correcto");

}


/* BLOQUEAR CRIPTEX */

function bloquearCriptex() {

    estadoTexto.textContent =
        "BLOQUEADO";


    estadoTexto.style.color =
        "#ff6464";


    comprobar.disabled = true;


    mensaje.textContent =
        "⚠️ El mecanismo se ha bloqueado.";


    mensaje.style.color =
        "#ff6464";


    modalBloqueo.classList.add(
        "activo"
    );


    reproducirSonido("bloqueo");


    /* CUBRIR LAS LETRAS CON TINTA */

    const letrasRuedas =
        document.querySelectorAll(
            ".letra"
        );


    letrasRuedas.forEach(
        function(letra) {

            letra.style.color =
                "#020202";

            letra.style.background =
                "#030303";

            letra.textContent =
                "█";

        }
    );

}


/* CERRAR VICTORIA */

cerrarVictoria.addEventListener(
    "click",
    function() {

        modalVictoria.classList.remove(
            "activo"
        );

    }
);


/* REINICIAR */

reiniciar.addEventListener(
    "click",
    function() {

        location.reload();

    }
);


/*  QUITAR ACENTOS*/

function quitarAcentos(texto) {

    return texto
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


/* SONIDOS */

function reproducirSonido(tipo) {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        return;

    }


    const audioContext =
        new AudioContext();


    const oscilador =
        audioContext.createOscillator();


    const volumen =
        audioContext.createGain();


    oscilador.connect(volumen);

    volumen.connect(
        audioContext.destination
    );


    /* SONIDO DE RUEDA */

    if (tipo === "giro") {

        oscilador.frequency.value =
            180;

        volumen.gain.value =
            0.05;

        oscilador.type =
            "square";

    }


    /* SONIDO DE ERROR */

    if (tipo === "error") {

        oscilador.frequency.value =
            100;

        volumen.gain.value =
            0.08;

        oscilador.type =
            "sawtooth";

    }


    /* SONIDO DE VICTORIA */

    if (tipo === "correcto") {

        oscilador.frequency.value =
            600;

        volumen.gain.value =
            0.1;

        oscilador.type =
            "sine";

    }


    /* SONIDO DE BLOQUEO */

    if (tipo === "bloqueo") {

        oscilador.frequency.value =
            70;

        volumen.gain.value =
            0.1;

        oscilador.type =
            "sawtooth";

    }


    oscilador.start();


    oscilador.stop(
        audioContext.currentTime +
        0.12
    );

}

