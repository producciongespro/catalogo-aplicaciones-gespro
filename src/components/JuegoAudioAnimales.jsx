import { AiTwotoneSound } from "react-icons/ai";

export default function JuegoAudioAnimales({ juego,
  elementos,
  handleOnDragStart,
  handleOnDrop,
  handlePermitirDrop,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop
 }) {

   const handleReproducir = (elemento)=>{
        const audio = new Audio(`/sonidos/${elemento.audio}`)
        audio.play()
   }

    return(
    <div>

        <h2>{juego.titulo}</h2>
        <h3>{juego.instrucciones}</h3>

         <div className="row">
                {/* elementos para arrastrar */}
                <div className="col-12 d-flex justify-content-center gap-3 mt-5 mb-5">
                    {elementos.map(elemento =>(
                        <div 
                            className="d-flex flex-column justify-content-center align-items-center" 
                            key={elemento.id} 
                            draggable
                            onDragStart={(e)=> handleOnDragStart(e, elemento)}
                        >   
                            <AiTwotoneSound className="icono-sonido" />
                            <button 
                                className="btn btn-outline-success"
                                onClick={()=>handleReproducir(elemento)}
                            >Reproducir</button>
                        </div>
                    ))}
                </div>

                {/* areas para dejar caer los elementos */}
                <div className="col-12 d-flex justify-content-center gap-5 mt-5">
                    {
                        juego?.areas.map(juego=>(
                            <div 
                                key={juego.id} 
                                className={`areas
                                    ${areaActiva === juego.id && estadoDrop === "correcto" ? "correcto" : ""}
                                    ${areaActiva === juego.id && estadoDrop === "incorrecto" ? "incorrecto" : ""}
                                `}
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