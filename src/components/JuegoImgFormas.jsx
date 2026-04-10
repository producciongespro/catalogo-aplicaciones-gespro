import ProgresoJuego from "./ProgresoJuego";
import TituloJuego from "./TituloJuegos";

export default function JuegoImgFormas({
  juego,
  elementos,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop,
  areas,

  // nuevos props
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  areaHover
}) {
    return(
        <div className="pt-2">
            <TituloJuego
                titulo={juego.titulo}
                instrucciones={juego.instrucciones}
            />

            <div className="row mx-auto">

                {/* ELEMENTOS */}
                <div className="col-12 d-flex justify-content-center flex-wrap gap-3 mt-5 mb-5">
                    {elementos.map(elemento =>(
                        <img 
                            key={elemento.id}
                            className="elemento"
                            src={`/imagenes/${elemento.imagen}`} 
                            alt={elemento.nombre}

                            draggable={false} // importante

                            onPointerDown={(e)=> handlePointerDown(e, elemento)}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}

                            style={{
                                touchAction: "none",
                                userSelect: "none",
                                cursor: "grab"
                            }}
                        />
                    ))}
                </div>

                {/* AREAS (imagenes como drop zones) */}
                <div className="col-12 d-flex justify-content-center flex-wrap gap-4 borde-areas-formas">
                    {
                        areas?.map(area =>(
                            <img 
                                key={area.id} 
                                src={`/imagenes/${area.imagen}`}

                                data-area-id={area.id} // CLAVE

                                className={`areas-formas
                                    ${areaHover === area.id ? "hover" : ""}
                                    ${areaActiva === area.id && estadoDrop === "correcto" ? "correcto" : ""}
                                    ${areaActiva === area.id && estadoDrop === "incorrecto" ? "incorrecto" : ""}
                                `}
                            />
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