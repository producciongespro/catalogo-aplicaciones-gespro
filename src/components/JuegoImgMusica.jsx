export default function JuegoImgMusica({
  juego,
  elementos,
  handleOnDragStart,
  handleOnDrop,
  handlePermitirDrop,
  mensaje,
  contadorJuegos,
  juegos
}) {
    return(
        <div>
            <h2>{juego.titulo}</h2>
            <h3>{juego.instrucciones}</h3>
            <div className="row">
                {/* elementos para arrastrar */}
                <div className="col-12 d-flex justify-content-center gap-3 mt-5 mb-5">
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
                <div className="col-12 d-flex justify-content-center gap-5 mt-5">
                    {
                        juego?.areas.map(juego=>(
                            <div 
                                key={juego.id} 
                                className="areas"
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
