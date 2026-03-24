export default function Carta({carta,handleClick}) {

    const abierta = carta.abierta || carta.encontrada
    
    return(
        <div
            className={`carta ${abierta ? "abierta" : ""}`}
            onClick={()=>handleClick(carta)}
        >
            {abierta ? carta.contenido : "?"}
        </div>
    )
};
