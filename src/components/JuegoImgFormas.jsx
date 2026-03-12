import ProgresoJuego from "./ProgresoJuego";
import TituloJuego from "./TituloJuegos";

export default function JuegoImgFormas({
  juego,
  elementos,
  handleOnDragStart,
  handleOnDrop,
  handlePermitirDrop,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop,
  areas
}) {
    return(
        <div className="pt-3">
            <TituloJuego
                titulo={juego.titulo}
                instrucciones={juego.instrucciones}
            />

            <div className="row">
                {/* elementos para arrastrar */}
                <div className="col-12 d-flex justify-content-center flex-wrap gap-3 mt-5 mb-5">
                    {elementos.map(elemento =>(
                        <img 
                            className="elemento" 
                            src={`/imagenes/${elemento.imagen}`} 
                            alt={elemento.nombre} 
                            key={elemento.id} 
                            draggable
                            onDragStart={(e)=> handleOnDragStart(e, elemento)}
                        />
                    ))}
                </div>

                {/* areas para dejar caer los elementos */}
                <div className="col-12 d-flex justify-content-center flex-wrap gap-5 mt-5 borde-areas-formas">
                    {
                        areas?.map(juego=>(
                            <img 
                                key={juego.id} 
                                src={`/imagenes/${juego.imagen}`}
                                className={`areas-formas
                                    ${areaActiva === juego.id && estadoDrop === "correcto" ? "correcto" : ""}
                                    ${areaActiva === juego.id && estadoDrop === "incorrecto" ? "incorrecto" : ""}
                                `}
                                onDrop={(e)=> handleOnDrop(e, juego.id)}
                                onDragOver={handlePermitirDrop}
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
