import { useEffect, useState } from "react";


export default function Juego() {

    const [juegos,setJuegos]= useState([])
    const [elementos, setElementos]= useState([])
    const [contadorJuegos, setContadorJuegos]= useState(0)
    const [mensaje, setMensaje]= useState("")
    // logica del juego
    // crear una constante con los juegos usando fetch
    // cargar los datos en una constante usar useEffect
    // el estado juegos almacena los niveles 1,2,3
    // el estado elementos guarda los elementos que se pueden arrastrar

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

    // todo: tengo que pensar como hacer que el juego avance cuando termine el primero
    //  setContadorJuegos(1)
    // iniciar el juego primer juego
    const juegoActual = juegos[contadorJuegos]
    // console.log("Juego Actual",juegoActual);
    

    // cuando el elemento inicia el arrastre se transfiere a la caja que recibe
    const onDragStart = (e, elemento)=>{
        e.dataTransfer.setData("elemento", JSON.stringify(elemento))
    }

    // prevenir el comportamiento del evento en el navegador
    const permitirDrop = (e)=>{
        e.preventDefault();
    }

    // cuando el elemento cae en el area, aca va toda la logica
    const onDrop = (e, juegoId)=>{
        e.preventDefault();
        // se recibe el valor que viene en el transfer con getData
        const elemento = JSON.parse(e.dataTransfer.getData("elemento"))

        // validar el campo de la respuesta del elemento con el area que cae
        if(elemento.respuesta === juegoId){
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
                    setMensaje("Nivel compeltado")
                }else{
                    // mensajes aca setearlo
                    setMensaje("Juego Terminado")
                }
            }else{
                // mensajes aca setearlo
                setMensaje("Correcto")
            }
        }else{
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
                            onDragStart={(e)=> onDragStart(e, elemento)}
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
                                onDrop={(e)=> onDrop(e, juego.id)}
                                onDragOver={permitirDrop}
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