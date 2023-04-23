
//AGREGAR COLORES
let longitudCuadrado = 30 //px que va a ocupar cada cuadrado
let playerX
let playerY
const columnas = 10
const filas = 20
const ancho = longitudCuadrado * columnas
const alto = longitudCuadrado * filas
const colorVacio = "white"

let banderaTimeout = false;
const juego = [];
let puedeJugar = false;
let puntaje = 0;
let tablero = []
const puntosPorCuadro = 1
const milisegundosDropeoPieza = 2000
const milisegundosAvancePieza = 1000

class Punto{ //Limite de coordenadas de cada trinomio
    constructor(x,y){
        this.x = x,
        this.y = y,
        this.limiteX = columnas - 1,
        this.limiteY = filas - 1
    }
}
class Figura{ //Constructor de trinomios
    constructor(rotaciones){
        this.rotaciones = rotaciones,
        this.indiceRotacion = 0
        this.puntos = this.rotaciones[this.indiceRotacion]
        this.rotaciones.forEach(puntos=>{
            puntos.forEach(punto=>{
                punto.color = "red" //TODO AGREGAR COLORES
            })
        })
    }
    getPuntos(){
        return this.puntos
    }
    puntoValidoInterno(puntoParaComprobar,posicionX,posicionY){
        return puntoValido(puntoParaComprobar,posicionX,posicionY,this.puntos)
    }
    puedeMoverDerecha(posicionX, posicionY){
        for (const punto of this.puntos){
            const nuevoPunto = new Punto(punto.x + 1, punto.y)
            if (!this.puntoValidoInterno(nuevoPunto,posicionX, posicionY)){
                return false
            }
        }
        return true
    }
    puedeMoverIzquierda(posicionX, posicionY) {
        for (const punto of this.puntos) {
            const nuevoPunto = new Punto(punto.x - 1, punto.y);
            if (!this.puntoValidoInterno(nuevoPunto, posicionX, posicionY)) {
                return false
            }
        }
        return true
    }
    puedeMoverAbajo(posicionY, posicionX) {
        for (const punto of this.puntos) {
            const nuevoPunto = new Punto(punto.x, punto.y + 1);
            if (!this.puntoValidoInterno(nuevoPunto, posicionX, posicionY)) {
                return false;
            }
        }
        return true
    }
    puedeRotar(posicionY, posicionX){
        const nuevosPuntosDespuesDeRotar = this.obtenerSiguienteRotacion()
        for (const puntoRotado of nuevosPuntosDespuesDeRotar){
            if (!this.puntoValidoInterno(puntoRotado,posicionX, posicionY)){
                return false
            }
        }
        return true
    }
    aumentarIndiceDeRotacion(){
        if (this.rotaciones.length <= 0){
            this.indiceRotacion = 0
        }
        else{
            if (this.indiceRotacion + 1 >= this.rotaciones.length){
                this.indiceRotacion = 0
            }
            else{
                this.indiceRotacion++
            }
        }
    }
    obtenerSiguienteRotacion(){
        return this.rotaciones[this.indiceRotacion]
    }
    rotar(x,y){
        if (!this.puedeRotar(x,y)){
            return
        }
        this.puntos = this.obtenerSiguienteRotacion()
        this.aumentarIndiceDeRotacion()
    }
}

const canvas = document.querySelector("#canvasPs1")
canvas.setAttribute("width",ancho+"px")
canvas.setAttribute("height",alto+"px")
const contexto = canvas.getContext("2d")

const RNG = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const crearFigura = () =>{
    switch(RNG(1,7)){
        case 1: //El cuadradito puto
            return new Figura ([[new Punto(0,0),new Punto(1,0),new Punto (0,1), new Punto(1,1)]])
        case 2: //La linea puta
            return new Figura([
                [new Punto(0, 0), new Punto(1, 0), new Punto(2, 0), new Punto(3, 0)],
                [new Punto(0, 0), new Punto(0, 1), new Punto(0, 2), new Punto(0, 3)],
            ]);
        case 3: // La L que siempre te hace perder
            return new Figura([
                [new Punto(0, 1), new Punto(1, 1), new Punto(2, 1), new Punto(2, 0)],
                [new Punto(0, 0), new Punto(0, 1), new Punto(0, 2), new Punto(1, 2)],
                [new Punto(0, 0), new Punto(0, 1), new Punto(1, 0), new Punto(2, 0)],
                [new Punto(0, 0), new Punto(1, 0), new Punto(1, 1), new Punto(1, 2)],
            ]);
        case 4: //La L humilde que entra en cualquier lado (En realidad es una J)
            return new Figura([
                [new Punto(0, 0), new Punto(0, 1), new Punto(1, 1), new Punto(2, 1)],
                [new Punto(0, 0), new Punto(1, 0), new Punto(0, 1), new Punto(0, 2)],
                [new Punto(0, 0), new Punto(1, 0), new Punto(2, 0), new Punto(2, 1)],
                [new Punto(0, 2), new Punto(1, 2), new Punto(1, 1), new Punto(1, 0)],
            ]);
        case 5: //La Z derecha
            return new Figura([
                [new Punto(0, 0), new Punto(1, 0), new Punto(1, 1), new Punto(2, 1)],
                [new Punto(0, 1), new Punto(1, 1), new Punto(1, 0), new Punto(0, 2)],
            ]);
        case 6: //La Z al reves
            return new Figura([
                [new Punto(0, 1), new Punto(1, 1), new Punto(1, 0), new Punto(2, 0)],
                [new Punto(0, 0), new Punto(0, 1), new Punto(1, 1), new Punto(1, 2)],
            ]);
        case 7: //La T. Que figura humilde la T. Entra en cualquier lado. Alla le entran
            return new Figura([
                [new Punto(0, 1), new Punto(1, 1), new Punto(1, 0), new Punto(2, 1)],
                [new Punto(0, 0), new Punto(0, 1), new Punto(0, 2), new Punto(1, 1)],
                [new Punto(0, 0), new Punto(1, 0), new Punto(2, 0), new Punto(1, 1)],
                [new Punto(0, 1), new Punto(1, 0), new Punto(1, 1), new Punto(1, 2)],
            ]);
    }
}

const reiniciarCoordenadas = () =>{
    playerX = Math.floor(columnas/2) - 1;
    playerY = 0
}
const refrescarPuntaje = () => console.log("tienes " + puntaje + " puntos");

const puntoDesocupadoEnJuego = (x,y) =>{
    if (!juego[y]) return true
    if (!juego[y][x]) return true
    return !juego[y][x].ocupado
}
const puntoEstaFueraDeLosLimites = (punto) =>{
    const xRelativo = punto.x + playerX
    const yRelativo = punto.y + playerY
    return xRelativo < 0 || xRelativo > punto.limiteX || yRelativo < 0 || yRelativo > punto.limiteY
}
const puntoAbsolutoFueraDeLimites = (xRelativo, yRelativo) => {
    return xRelativo < 0 || xRelativo > columnas - 1 || yRelativo < 0 || yRelativo > filas - 1;
}
const puntoValido = (puntoParaComprobar,x,y,puntos) =>{
    const desocupado = puntoDesocupadoEnJuego(x + puntoParaComprobar.x,y,puntoParaComprobar.y)
    const ocupaMismaCoordenadaQuePuntoActual = puntos.findIndex(puntoExistente =>{
        return puntoParaComprobar.x === puntoExistente.x && puntoParaComprobar.y === puntoExistente.y
    }) !== -1
    const fueraDeLimites = puntoEstaFueraDeLosLimites(puntoParaComprobar)
    return !((!desocupado && !ocupaMismaCoordenadaQuePuntoActual) || fueraDeLimites)
}


const obtenerPuntosQueSeEliminan = () =>{
    const puntos = []
    let y = 0
    for (const fila of juego){
        const filaLlena = fila.every(punto => punto.ocupado)
        if (filaLlena){
            puntos.push(y)
        }
        y++
    }
    return puntos
}

const verificarFilasCompletasYEliminarlas = () =>{
    const puntos = obtenerPuntosQueSeEliminan()
    if (puntos.length <= 0) return
    puntaje += puntosPorCuadro * columnas * puntos.length
    refrescarPuntaje()
    puedeJugar = false
    setTimeout(() => {
        quitarFilasDeTablero(puntos)
        sincronizarPiezasConTablero()
        const puntosInvertidos = Array.from(puntos)
        puntosInvertidos.reverse()
        for (const y of puntosInvertidos){
            tablero.sort((a,b)=>{
                return b.y - a.y
            })
            tablero = tablero.map(punto =>{
                if (punto.y<y){
                    let contador = 0
                    while (puntoDesocupadoEnJuego(punto.x,punto.y + 1) && !puntoAbsolutoFueraDeLimites(punto.x,punto.y+1) && contador < puntos.length){
                        punto.y++
                        contador++
                        sincronizarPiezasConTablero()
                    }
                }
                return punto
            })
        }
        sincronizarPiezasConTablero()
        puedeJugar = true
    }, 10);
}
const quitarFilasDeTablero = posiciones =>{
    for (const posicionY of posiciones){
        tablero = tablero.filter(punto =>{
            return punto.y !== posicionY
        })
    }
}

reiniciarCoordenadas()


const inicializarTableroDeJuego = () =>{
    for (let y = 0; y < filas; y++) {
        juego.push([]);
        for (let x = 0; x < columnas; x++) {
            juego[y].push({
                color: colorVacio,
                ocupado: false,
            });
        }
    }
}
inicializarTableroDeJuego();

const llenar = () =>{
    for (let y = 0; y < filas; y++){
        for (let x = 0; x < columnas; x++){
            juego[y][x] = {
                color: "blue",
                ocupado: false,
            }
        }
    }
}

const agregarFiguraATablero = (figura) =>{
    for (const punto of figura.getPuntos()){
        punto.x += playerX;
        punto.y += playerY
        tablero.push(punto)
    }
    reiniciarCoordenadas()
}

const superponerTablero = () =>{
    for (const punto of tablero){
        juego[punto.y][punto.x] ={
            color:punto.color,
            ocupado:true
        }
    }
}

const moverFiguraATablero = (figura) =>{
    for (const punto of figura.getPuntos()){
        juego[punto.y + playerY][punto.x + playerX] = {
            color:punto.color,
            ocupado:true
        }
    }
}

llenar(juego)

const dibujar = () =>{
    let x = 0, y = 0;
    for (const fila of juego) {
        x = 0;
        for (const cuadro of fila) {
            let colorRelleno;
            if (cuadro.ocupado) {
                colorRelleno = cuadro.color
            } else {
                colorRelleno = colorVacio
            }
            contexto.fillStyle = cuadro.ocupado ? cuadro.color : colorVacio;
            contexto.fillRect(x, y, longitudCuadrado, longitudCuadrado);
            contexto.restore();
            contexto.strokeStyle = ("white") 
            contexto.strokeRect(x, y, longitudCuadrado, longitudCuadrado);
            x += longitudCuadrado;
        }
        y += longitudCuadrado
    }
    requestAnimationFrame(dibujar)
}

const sincronizarPiezasConTablero = () => {
    llenar();
    superponerTablero();
    moverFiguraATablero(figuraElegida); 
};
let siguienteDireccion
let idInterval
let figuraElegida = crearFigura()

const loop = () =>{
    if (!puedeJugar){
        return
    }
    if (figuraElegida.puedeMoverAbajo(playerY,playerX)){
        playerY++
    }
    else{
        if(!puedeJugar){
            return
        }
        if (banderaTimeout){return}
        banderaTimeout = true
        setTimeout(() => {
            banderaTimeout = false
            if (figuraElegida.puedeMoverAbajo(playerY,playerX)){
                return
            }
            console.log("La figura choco contra un punto ocupado en " + (playerY++))
            agregarFiguraATablero(figuraElegida)
            if (pierde()){
                console.log("alto puto, perdiste")
                puedeJugar = false
                return
            }
            verificarFilasCompletasYEliminarlas()
            figuraElegida = crearFigura()
            sincronizarPiezasConTablero()
        }, milisegundosDropeoPieza);
    }
    sincronizarPiezasConTablero()
}

const intentarMoverDerecha = () => {
    if (figuraElegida.puedeMoverDerecha(playerX, playerY)) {
        playerX++;
    }
};
const intentarMoverIzquierda = () => {
    if (figuraElegida.puedeMoverIzquierda(playerX, playerY)) {
        playerX--
    }
};
const intentarMoverAbajo = () => {
    if (figuraElegida.puedeMoverAbajo(playerX, playerY)) {
        playerY++;
    }
};

const intentarRotar = () =>{
    figuraElegida.rotar(playerX,playerY)
}

document.addEventListener("keydown",(a)=>{
    const {code} = a
    switch(code){
        case "ArrowRight":
            intentarMoverDerecha();
            break;
        case "ArrowLeft":
            intentarMoverIzquierda();
            break;
        case "ArrowDown":
            intentarMoverAbajo();
            break;
        case "Space":
            intentarRotar();
            break;
    }
    sincronizarPiezasConTablero();
})

requestAnimationFrame(dibujar);
const iniciarJuego = () => {
    refrescarPuntaje();
    puedeJugar = true;
    idInterval = setInterval(loop, milisegundosAvancePieza);
}   

const pierde = () => {
    for (const punto of tablero) {
        console.log(punto)
        if (punto.y === 1) return true;
    }
    return false;
};

iniciarJuego()