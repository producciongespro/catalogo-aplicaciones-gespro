import ProgresoJuego from "./ProgresoJuego";
import TituloJuego from "./TituloJuegos";

export default function JuegoImgMusica({
  juego,
  elementos,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop,
  areas,

  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) {
    return (
        <div className="pt-2">
            <TituloJuego
                titulo={juego.titulo}
                instrucciones={juego.instrucciones}
            />

            <div className="row">

                {/* ELEMENTOS */}
                <div className="col-12 d-flex justify-content-center flex-wrap gap-3 mt-5 mb-5">
                    {elementos.map(elemento => (
                        <div>
                            <img
                                key={elemento.id}
                                className="elemento"
                                src={`/imagenes/${elemento.imagen}`}
                                alt={elemento.nombre}
                                draggable={false}
                                onPointerDown={(e) => handlePointerDown(e, elemento)}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
    
                                style={{
                                    touchAction: "none",
                                    userSelect: "none",
                                    cursor: "grab"
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* AREAS */}
                <div className="col-12 d-flex justify-content-center flex-wrap gap-5">
                    {areas?.map(area => (
                        <div
                            key={area.id}
                            data-area-id={area.id}
                            className={`areas
                                ${areaActiva === area.id && estadoDrop === "correcto" ? "correcto" : ""}
                                ${areaActiva === area.id && estadoDrop === "incorrecto" ? "incorrecto" : ""}
                            `}
                        >
                            <p>{area.nombre}</p>
                        </div>
                    ))}
                </div>

                

            </div>
            <ProgresoJuego
                    mensaje={mensaje}
                    contadorJuegos={contadorJuegos}
                    juegos={juegos}
                />
        </div>
    );
}