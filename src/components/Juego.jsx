import { useEffect, useState } from "react";


export default function Juego() {

    const [juegos,setJuegos]= useState([])
    const [elementos, setElementos]= useState([])
    const [contadorJuegos, setContadorJuegos]= useState(0)
    const [mensaje, setMensaje]= useState("")
    
    const sonidoOk = new Audio("/sonidos/ok.mp3")
    const sonidoNo = new Audio("/sonidos/no.mp3")
    const sonidoFin = new Audio("/sonidos/fin.mp3")

    useEffect(() => {
        setup()
    }, []);

    const setup = async ()=>{
        // console.log("cargando juegos....");
        const respuesta = await fetch("/datos/datos.json")
        const data = await respuesta.json()
        console.log(data);
        
       
        setJuegos(data.juegos)
        // carga el primer juego
        setElementos(data.juegos[0].elementos)
        // console.log(juegos);
        
    }

    // iniciar el juego primer juego
    const juegoActual = juegos[contadorJuegos]
    // console.log("Juego Actual",juegoActual);
    

    // cuando el elemento inicia el arrastre se transfiere a la caja que recibe
    const handleOnDragStart = (e, elemento)=>{
        e.dataTransfer.setData("elemento", JSON.stringify(elemento))
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
            // filtar los elementos para quitarlos de la pantalla 
            const nuevosElementos = elementos.filter(ele => ele.id !== elemento.id);
            // setearlos al state
            setElementos(nuevosElementos)

            if(nuevosElementos.length === 0){
              
                // aca valoramos si el arreglo de juegos esta vacio
                if(contadorJuegos < juegos.length - 1){
                    const siguienteJuego = contadorJuegos + 1;

                    setContadorJuegos(siguienteJuego)
                    setElementos(juegos[siguienteJuego].elementos)
                    // mensajes aca setearlo
                    setMensaje("Nivel completado")
                }else{
                    // mensajes aca setearlo
                    setMensaje("Juego Terminado")
                }
            }else{
                // mensajes aca setearlo
                setMensaje("Correcto")
            }
        }else{
            sonidoNo.play()
            setMensaje("Intenta otra vez")
        }
    }

    // para hasta que juegos tenga algo si no juegoActual.titulo se me cae
    if (juegos.length === 0) return <p>Cargando...</p>;

    return(
        <div className="container">
            <h2>{juegoActual.titulo}</h2>
            <h3>{juegoActual.instrucciones}</h3>
            <div className="row">
                {/* elementos para arrastrar */}
                <div className="col-12 d-flex justify-content-center gap-3 mt-5 mb-5">
                    {elementos.map(elemento =>(
                        <div key={elemento.id} 
                            className="elemento" 
                            draggable
                            onDragStart={(e)=> handleOnDragStart(e, elemento)}
                        >
                            <p>{elemento.nombre}</p>
                        </div>
                    ))}
                </div>

                {/* areas para dejar caer los elementos */}
                <div className="col-12 d-flex justify-content-center gap-5 mt-5">
                    {
                        juegoActual?.areas.map(juego=>(
                            <div 
                                key={juego.id} 
                                className="areas"
                                onDrop={(e)=> handleOnDrop(e, juego.id)}
                                onDragOver={handlePermitirDrop}
                            >
                                <p>{juego.nombre}</p>
                            </div>
                        ))
                    }
                </div>
                

                <h3>{mensaje}</h3>

                <p>
                    Juego {contadorJuegos + 1} de {juegos.length}
                </p>

            </div>
        </div>
    )
}