export default function Carta({carta,handleClick}) {

    const abierta = carta.abierta || carta.encontrada
    
    return(
        <div className="carta-contenedor" onClick={() => handleClick(carta)}>
            <div className={`carta-inner ${abierta ? "flip" : ""}`}>
                
                {/* Frente */}
                <div className="carta-frente">
                ?
                </div>

                {/* Atrás */}
                <div className="carta-atras">
                <img 
                    src={`/img/${carta.imagen}`} alt={carta.valor}/>
                </div>

            </div>
        </div>
        
    )
};
