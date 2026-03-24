import Carta from "./Carta";

export default function Tablero({cartas, handleClick, nivel}) {
    
    const columnas = nivel === 1 ? 4 : nivel === 2 ? 5 : 6;

    return(
        <div className="tablero-contenedor">
            <div 
                className="tablero-grid"
                style={{gridTemplateColumns: `repeat(${columnas},100px)`}}
            >
                {cartas.map(carta=>(
                    <Carta
                        key={carta.uid}
                        carta={carta}
                        handleClick={handleClick}
                    />
                ))}
            </div>
        </div>
    )
};
