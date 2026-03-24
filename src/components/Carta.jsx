export default function Carta({carta,handleClick}) {

    const abierta = carta.abierta || carta.encontrada
    
    return(
        <div
            className={`carta ${abierta ? "abierta" : ""}`}
            onClick={()=>handleClick(carta)}
        >
            {abierta ? (
                <img 
                    src={`/img/${carta.imagen}`} alt={carta.valor}/>
                ) : "?"
            }
        </div>
    )
};
