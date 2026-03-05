import { useEffect, useState } from "react";


export default function Juego() {

    const [juegos,setJuegos]= useState([])
    const [items, setItems ]= useState([])
    // logica del juego
    // crear una constante con los juegos usando fetch
    // cargar los datos en una constante usar useEffect

    useEffect(() => {
        setup()
    }, []);

    const setup = async ()=>{
        // console.log("cargando juegos....");
        const respuesta = await fetch("/datos/datos.json")
        const data = await respuesta.json()
        console.log(data);
        
        
        setJuegos(data.juegos)
        setItems(data.juegos[0].items)
        // console.log(juegos);
        
    }

    // iniciar el juego primer juego
    const juegoActual = juegos[0]


    return(
        <h2>Desde Juego....</h2>
    )
}