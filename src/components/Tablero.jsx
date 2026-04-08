
import { motion } from "framer-motion";
import Carta from "./Carta";


export default function Tablero({cartas, handleClick, nivel, errorIds}) {
    
    const columnas = nivel === 1 ? 4 : nivel === 2 ? 4 : 4;
    
    return(
        <div className="container">
            <motion.div 
                className="tablero-grid"
                style={{ gridTemplateColumns: `repeat(${columnas}, 150px)` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
            >
                {cartas.map(carta => (
                    <Carta
                        key={carta.uid}
                        carta={carta}
                        handleClick={handleClick}
                        errorIds={errorIds.includes(carta.uid)}
                    />
                ))}
            </motion.div>
    </div>
    )
};
