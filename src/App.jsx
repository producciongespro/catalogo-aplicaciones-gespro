import { useState } from "react"
import Juego from "./components/Juego"

function App() {
  
  const [iniciar, setIniciar] = useState(false)

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1>Juego de Arrastrar y Soltar</h1>


          {!iniciar ? (
              <button 
                className="btn btn-outline-success btn-lg"
                onClick={()=> setIniciar(true)}
              >
                 Iniciar Juego
              </button>
          ):(
            <Juego/>
          )}

        </div>
      </div>
    </div>
  )
}

export default App
