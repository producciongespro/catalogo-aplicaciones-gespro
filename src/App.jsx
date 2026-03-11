import { useState } from "react"
import PantallaInicio from "./components/PantallaInicio";
import CuentaRegresiva from "./components/CuentaRegresiva";
import Juego from "./components/Juego"

export default function App() {
  
  const [iniciar, setIniciar] = useState("inicio");

  // const iniciaJuego= ()=>{
  //   setIniciar("contador")
  // }
  
  return (
    <div className="game-bg text-center">
      {iniciar === "inicio" && (
        <PantallaInicio iniciar={()=>setIniciar("contador")}/>
      )}
      {iniciar === "contador" && (
        <CuentaRegresiva terminar={()=>setIniciar("juego")}/>
      )}
      {iniciar === "juego" && (
        <Juego volverInicio={()=>setIniciar("inicio")}/>
      )}
    </div>
  )
}


