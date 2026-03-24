import Carta from "./Carta";

export default function Tablero({cartas, handleClick, nivel}) {
    
    const columnas = nivel === 1 ? 4 : nivel === 2 ? 4 : 4;
    
    return(
        <div className="container">
            <div className="tablero-grid"
                style={{ gridTemplateColumns: `repeat(${columnas}, 150px)` }}
            >
                {cartas.map(carta => (
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
