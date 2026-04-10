import { AiTwotoneSound } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import ProgresoJuego from "./ProgresoJuego";
import TituloJuego from "./TituloJuegos";

export default function JuegoAudioAnimales({
  juego,
  elementos,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop,
  areas,

  // nuevos
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  areaHover
}) {

   const handleReproducir = (elemento)=>{
        const audio = new Audio(`/sonidos/${elemento.audio}`)
        audio.play()
   }

    return(
    <div className="pt-3">

        <TituloJuego
            titulo={juego.titulo}
            instrucciones={juego.instrucciones}
        />

        {/* EVENTOS GLOBALES */}
        <div 
            className="row"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >

            {/* ELEMENTOS */}
            <div className="col-12 d-flex justify-content-center flex-wrap gap-3 mt-5 mb-5">
                {elementos.map(elemento =>(
                    <div 
                        key={elemento.id}
                        className="elemento-audio d-flex flex-column justify-content-center align-items-center"

                        draggable={false}

                        onPointerDown={(e)=> handlePointerDown(e, elemento)}

                        style={{
                            touchAction: "none",
                            userSelect: "none",
                            cursor: "grab"
                        }}
                    >   
                        <AiTwotoneSound className="icono-sonido" />

                        <button 
                            className="btn btn-outline-success btn-audio"
                            onPointerDown={(e)=> e.stopPropagation()}
                            onClick={(e)=>{
                                e.stopPropagation() // evita interferencia con drag
                                handleReproducir(elemento)
                            }}
                        >
                            <span className="d-none d-md-inline">Reproducir</span>
                            <span className="d-md-none"><FaPlay /></span>
                        </button>
                    </div>
                ))}
            </div>

            {/* AREAS */}
            <div className="col-12 d-flex justify-content-center flex-wrap gap-5">
                {
                    areas?.map(area=>(
                        <div 
                            key={area.id}
                            data-area-id={area.id}

                            className={`areas
                                ${areaHover === area.id ? "hover" : ""}
                                ${areaActiva === area.id && estadoDrop === "correcto" ? "correcto" : ""}
                                ${areaActiva === area.id && estadoDrop === "incorrecto" ? "incorrecto" : ""}
                            `}
                        >
                            <p>{area.nombre}</p>
                        </div>
                    ))
                }
            </div>

            <ProgresoJuego
                mensaje={mensaje}
                contadorJuegos={contadorJuegos}
                juegos={juegos}
            />

        </div>

    </div>
)
}