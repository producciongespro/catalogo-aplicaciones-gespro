import { useState } from "react";
import "../css/JuegoMemoria.css"

export default function JuegoMemoria({tarjetas}) {
  console.log(tarjetas);
  
  const [nivel, setNivel] = useState(1)
  const [cartas, setCartas] = useState([])
  const [seleccionadas, setSeleccionadas] = useState([])
  const [bloqueado, setBloqueado]=useState(false)
  
  const niveles = {
    1: 8,
    2: 10,
    3: 12
  }
 

  return (
    <div className="container text-center mt-4">
      <h2 className="mt-3">Juego de Memoria</h2>
      <h4 className="text-primary"> Nivel {nivel}</h4>
      <div className="flex justify-content-center align-items-center tablero-contenedor">
        <div className="tablero-grid">
          cartas
        </div>
      </div>
    </div>
  );
}