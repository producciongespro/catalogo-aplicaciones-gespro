import { useEffect, useState } from "react"
import JuegoMemoria from "./components/JuegoMemoria"



function App() {

  const [tarjetas, setTarjetas]= useState(null)
  const [error, setError]= useState(null)

  const setup = async ()=>{
    try {
      const res = await fetch("/data/data-tarjetas.json")
      const {tarjetas} = await res.json()
      setTarjetas(tarjetas)
    } catch (err) {
      console.log(err);
      setError("No se cargaron los datos de las tarjetas")
    }
  }

  useEffect(() => {
    setup();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <JuegoMemoria tarjetas={tarjetas}/>
  )
}

export default App
