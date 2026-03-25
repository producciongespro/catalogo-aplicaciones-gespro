import { useState, useEffect } from "react";
import Tablero from "./Tablero";
import "../css/JuegoMemoria.css"

export default function JuegoMemoria({tarjetas}) {
  //console.log(tarjetas.filter(tarjeta => tarjeta.tipo === "numero"));
  
  const [nivel, setNivel] = useState(1)
  const [cartas, setCartas] = useState([])
  const [seleccionadas, setSeleccionadas] = useState([])
  const [bloqueado, setBloqueado]=useState(false)

  const sonidoOk = new Audio("/sonidos/ok.mp3")
  const sonidoNo = new Audio("/sonidos/no.mp3")
  const sonidoFin = new Audio("/sonidos/fin.mp3")
  const sonidoFlip = new Audio("/sonidos/flip.mp3")
  
  const niveles = {
    1: 8,
    2: 10,
    3: 12
  }
 
  // Sekeccionar las cartas a mostrar, el nivel inicia en 1
  const selecionarCartas = (nivel)=>{
    const cantidad = niveles[nivel]
    const paresNecesarios = cantidad / 2

    const tipoNivel = nivel === 1 ? "numero" : nivel === 2 ? "animal" : "transporte"

    // Filtra solo las cartas del nivel
    const tarjetasFiltradas = (tarjetas || []).filter(tarjeta => tarjeta.tipo === tipoNivel)
    
    //Agrupa en parejas
    const grupos = {}

    tarjetasFiltradas.forEach(carta => {
      if(!grupos[carta.parId]){ grupos[carta.parId]=[] }
      grupos[carta.parId].push(carta) 
    })

    //convertir el objeto en array, 
    // solo filtra grupos completos, 
    // mezcla aleatoriamente, 
    // toma solo pares necesarios
    const pares = Object.values(grupos)
      .filter(grupo => grupo.length === 2)
      .sort(()=> Math.random() - 0.5)
      .slice(0, paresNecesarios)

    // se crea un solo arreglo flat,
    // con map, a cada uno se le agrega un valor unico, 
    // si esta volteada, 
    // si se encontro
    // con sort se mezclan
    const arregloCartas = pares.flat().map(carta=>({
      ...carta,
      uid: crypto.randomUUID(),
      abierta: false,
      encontrada: false
    })).sort(()=> Math.random() - 0.5)
    
    
    return arregloCartas
    
  }

  useEffect(() => {
    if (!tarjetas) return
    setCartas(selecionarCartas(nivel))
    setSeleccionadas([])
  }, [nivel, tarjetas])


  // Maneja cuando se hace click en la tarjeta
  const handleClick = (carta)=>{
    //validar estas opciones
    if(bloqueado || carta.abierta || carta.encontrada) return

    sonidoFlip.play()
    const nuevas = cartas.map(c => 
      c.uid === carta.uid ? {...c, abierta: true } : c)

    const nuevasSeleccionadas = [...seleccionadas, carta]

    setCartas(nuevas)
    setSeleccionadas(nuevasSeleccionadas)

    if(nuevasSeleccionadas.length === 2) verificarPareja(nuevasSeleccionadas)
  }

  const verificarPareja = ([carta1, carta2]) => {
    setBloqueado(true)

    const esPareja = carta1.parId === carta2.parId

    setTimeout(() => {
      setCartas(prev =>
        prev.map(c => {
          if(c.uid === carta1.uid || c.uid === carta2.uid){
            return {...c, abierta: esPareja, encontrada: esPareja}
          }
          return esPareja ? c : {...c, abierta:false}
        })
      )

      setSeleccionadas([])
      setBloqueado(false)
    }, 800);

  }

  useEffect(()=>{
    if(cartas.length && cartas.every(c => c.encontrada)){
      if(nivel < 3){
        setTimeout(() => {
          setNivel(nivel + 1)
        }, 800);
      }else{
        alert("Juego Terminado")
      }
    }
  },[cartas])
  

  return (
    <div className="container text-center mt-4">
      <h2 className="mt-3">Juego de Memoria</h2>
      <h4 className="text-primary"> Nivel {nivel}</h4>
      <div className="flex justify-content-center align-items-center tablero-contenedor">
        <div className="tablero-grid">
          <Tablero
            cartas={cartas}
            handleClick={handleClick}
            nivel={nivel}
          />
        </div>
      </div>
    </div>
  );
}