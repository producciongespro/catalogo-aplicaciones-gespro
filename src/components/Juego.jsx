import { useEffect, useState } from "react";


export default function Juego() {

    const [juegos,setJuegos]= useState([])
    const [elementos, setElementos]= useState([])
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
        setElementos(data.juegos[0].elementos)
        // console.log(juegos);
        
    }

    // todo: tengo que pensar como hacer que el juego avance cuando termine el primero
    // iniciar el juego primer juego
    const juegoActual = juegos[0]
    // console.log("Juego Actual",juegoActual);
    
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
                        <div key={elemento.id} className="elemento" draggable>
                            <p>{elemento.nombre}</p>
                        </div>
                    ))}
                </div>

                {/* areas para dejar caer los elementos */}
                <div className="col-12 d-flex justify-content-center gap-5 mt-5">
                    {
                        juegoActual?.areas.map(juego=>(
                            <div key={juego.id} className="areas">
                                <p>{juego.nombre}</p>
                            </div>
                        ))
                    }
                </div>
                
            </div>
        </div>
    )
}