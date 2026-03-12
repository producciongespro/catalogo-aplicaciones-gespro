import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import CargarJuegos from "./CargarJuegos";
import ModalFinJuego from "./ModalFinJuego";
import mezclarArray from "../helpers/mezclarArray";

export default function Juego({volverInicio}) {

    const [juegos,setJuegos]= useState([])
    const [elementos, setElementos]= useState([])
    const [contadorJuegos, setContadorJuegos]= useState(0)
    const [mensaje, setMensaje]= useState("")
    const [areaActiva, setAreaActiva] = useState(null)
    const [estadoDrop, setEstadoDrop] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [areas, setAreas] = useState([])

    const sonidoOk = new Audio("/sonidos/ok.mp3")
    const sonidoNo = new Audio("/sonidos/no.mp3")
    const sonidoFin = new Audio("/sonidos/fin.mp3")

    useEffect(() => {
        setup()
    }, []);

    // carga inicial
    const setup = async ()=>{
        try {
            // console.log("cargando juegos....");
            const respuesta = await fetch("/datos/datos.json")
            const data = await respuesta.json()
            setJuegos(data.juegos)
            // carga el primer juego
            setElementos(mezclarArray(data.juegos[0].elementos))
            setAreas(mezclarArray(data.juegos[0].areas))
        } catch (error) {
            console.log("Error cargando juegos", error);
        }    
    }

    
    // iniciar el juego primer juego
    const juegoActual = juegos[contadorJuegos]

    // cuando el elemento inicia el arrastre se transfiere a la caja que recibe
    const handleOnDragStart = (e, elemento)=>{
        e.dataTransfer.setData("elemento", JSON.stringify(elemento))
        
        // utiliza la misma imagen para arrastrar, mostraba un globo en algunas imagenes
        const img = e.target
        e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2)
    }

    // prevenir el comportamiento del evento en el navegador
    const handlePermitirDrop = (e)=>{
        e.preventDefault();
    }

    // cuando el elemento cae en el area, aca va toda la logica
    const handleOnDrop = (e, juegoId)=>{
        e.preventDefault();

        // se recibe el valor que viene en el transfer con getData
        const elemento = JSON.parse(e.dataTransfer.getData("elemento"))

        // validar el campo de la respuesta del elemento con el area que cae
        if(elemento.respuesta === juegoId){
            // sonido correcta posicion
            sonidoOk.play()
            setAreaActiva(juegoId)
            setEstadoDrop("correcto")

            setTimeout(()=>{
                setAreaActiva(null)
                setEstadoDrop(null)
            },700)
            // filtar los elementos para quitarlos de la pantalla 
            const nuevosElementos = elementos.filter(ele => ele.id !== elemento.id);
            // setearlos al state
            setElementos(nuevosElementos)

            if(nuevosElementos.length === 0){
              
                sonidoFin.play()

                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                })

                setMensaje("Nivel completado")

                // rerasar un poco el siguiente juego
                setTimeout(()=>{
                    // aca valoramos si el arreglo de juegos esta vacio
                    if(contadorJuegos < juegos.length - 1){
                        const siguienteJuego = contadorJuegos + 1;

                        setContadorJuegos(siguienteJuego)
                        setElementos(mezclarArray(juegos[siguienteJuego].elementos))
                        setAreas(mezclarArray(juegos[siguienteJuego].areas))
                        // mensajes limpiarlo
                        setMensaje("")
                    }else{
                        // mensajes aca setearlo
                        setMensaje("Juego Terminado")
                        // abre el modal de juego terminado
                        setMostrarModal(true)
                    }
                },1000) //2 segunditos
                
            }else{
                // mensajes aca setearlo
                setMensaje("Correcto")
            }
        }else{
            sonidoNo.play()
            setMensaje("Intenta otra vez")
            setAreaActiva(juegoId)
            setEstadoDrop("incorrecto")

            setTimeout(()=>{
                setAreaActiva(null)
                setEstadoDrop(null)
            },700)
        }
    }

    // reiniciar el juego
    const reiniciarJuego = ()=>{
        setContadorJuegos(0)
        setElementos(mezclarArray(juegos[0].elementos))
        setAreas(mezclarArray(juegos[0].areas))
        setMensaje("")
        setMostrarModal(false)
    }


    // para hasta que juegos tenga algo si no juegoActual.titulo se me cae
    if (juegos.length === 0) return <p>Cargando...</p>;

    return(
        <div className="container">
            <CargarJuegos 
                juego={juegoActual}
                elementos={elementos}
                handleOnDragStart={handleOnDragStart}
                handleOnDrop={handleOnDrop}
                handlePermitirDrop={handlePermitirDrop}
                mensaje={mensaje}
                contadorJuegos={contadorJuegos}
                juegos={juegos}
                areaActiva={areaActiva}
                estadoDrop={estadoDrop}
                areas={areas}
            />

            {mostrarModal && (
                <ModalFinJuego 
                    mostrar={mostrarModal}
                    reiniciarJuego={reiniciarJuego} 
                    volverInicio={volverInicio}
                />
            )}
        </div>
    )
}