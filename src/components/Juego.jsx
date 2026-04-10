import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import CargarJuegos from "./CargarJuegos";
import ModalFinJuego from "./ModalFinJuego";
import mezclarArray from "../helpers/mezclarArray";

export default function Juego({ volverInicio }) {

    const [juegos, setJuegos] = useState([]);
    const [elementos, setElementos] = useState([]);
    const [contadorJuegos, setContadorJuegos] = useState(0);
    const [mensaje, setMensaje] = useState("");
    const [areaActiva, setAreaActiva] = useState(null);
    const [estadoDrop, setEstadoDrop] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [areas, setAreas] = useState([]);

    const [dragging, setDragging] = useState(null);

    // refs para movimiento fluido
    const elementoRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });

    const sonidoOk = new Audio("/sonidos/ok.mp3");
    const sonidoNo = new Audio("/sonidos/no.mp3");
    const sonidoFin = new Audio("/sonidos/fin.mp3");

    useEffect(() => {
        setup();
    }, []);

    const setup = async () => {
        try {
            const respuesta = await fetch("/datos/datos.json");
            const data = await respuesta.json();
            setJuegos(data.juegos);
            setElementos(mezclarArray(data.juegos[0].elementos));
            setAreas(mezclarArray(data.juegos[0].areas));
        } catch (error) {
            console.log("Error cargando juegos", error);
        }
    };

    const juegoActual = juegos[contadorJuegos];

    // hacer drop
    const simularDrop = (elemento, juegoId) => {

        if (elemento.respuesta === juegoId) {
            sonidoOk.play();
            setAreaActiva(juegoId);
            setEstadoDrop("correcto");

            setTimeout(() => {
                setAreaActiva(null);
                setEstadoDrop(null);
            }, 700);

            const nuevosElementos = elementos.filter(ele => ele.id !== elemento.id);
            setElementos(nuevosElementos);

            if (nuevosElementos.length === 0) {

                sonidoFin.play();

                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });

                setMensaje("Nivel completado");

                setTimeout(() => {
                    if (contadorJuegos < juegos.length - 1) {
                        const siguienteJuego = contadorJuegos + 1;

                        setContadorJuegos(siguienteJuego);
                        setElementos(mezclarArray(juegos[siguienteJuego].elementos));
                        setAreas(mezclarArray(juegos[siguienteJuego].areas));
                        setMensaje("");
                    } else {
                        setMensaje("Juego Terminado");
                        setMostrarModal(true);
                    }
                }, 1000);

            } else {
                setMensaje("Correcto");
            }

        } else {
            sonidoNo.play();
            setMensaje("Intenta otra vez");
            setAreaActiva(juegoId);
            setEstadoDrop("incorrecto");

            setTimeout(() => {
                setAreaActiva(null);
                setEstadoDrop(null);
            }, 700);
        }
    };

    // pointer events
    const handlePointerDown = (e, elemento) => {
        e.preventDefault();
        setDragging(elemento);

        elementoRef.current = e.currentTarget;
        elementoRef.current.setPointerCapture(e.pointerId);

        offset.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e) => {
        if (!dragging || !elementoRef.current) return;

        offset.current.x += e.movementX;
        offset.current.y += e.movementY;

        elementoRef.current.style.transform =
            `translate(${offset.current.x}px, ${offset.current.y}px)`;

        elementoRef.current.style.pointerEvents = "none";
    };

    const handlePointerUp = (e) => {
        if (!dragging) return;

        const elementoDOM = document.elementFromPoint(e.clientX, e.clientY);

        if (elementoDOM) {
            const zona = elementoDOM.closest("[data-area-id]");

            if (zona) {
                const areaId = Number(zona.getAttribute("data-area-id"))
                simularDrop(dragging, areaId);
            }
        }

        // reset visual
        if (elementoRef.current) {
            elementoRef.current.style.transform = "translate(0,0)";
            elementoRef.current.style.pointerEvents = "auto";
            elementoRef.current.releasePointerCapture(e.pointerId);
        }

        offset.current = { x: 0, y: 0 };
        setDragging(null);
    };

    const reiniciarJuego = () => {
        setContadorJuegos(0);
        setElementos(mezclarArray(juegos[0].elementos));
        setAreas(mezclarArray(juegos[0].areas));
        setMensaje("");
        setMostrarModal(false);
    };

    if (juegos.length === 0) return <p>Cargando...</p>;

    return (
        <div className="container">
            <CargarJuegos
                juego={juegoActual}
                elementos={elementos}
                mensaje={mensaje}
                contadorJuegos={contadorJuegos}
                juegos={juegos}
                areaActiva={areaActiva}
                estadoDrop={estadoDrop}
                areas={areas}
                handlePointerDown={handlePointerDown}
                handlePointerMove={handlePointerMove}
                handlePointerUp={handlePointerUp}
            />

            {mostrarModal && (
                <ModalFinJuego
                    mostrar={mostrarModal}
                    reiniciarJuego={reiniciarJuego}
                    volverInicio={volverInicio}
                />
            )}
        </div>
    );
}