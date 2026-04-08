import { motion } from "framer-motion";

export default function Carta({ carta, handleClick, error }) {

  const abierta = carta.abierta || carta.encontrada;

  return (
    <motion.div
      className="carta-contenedor"
      onClick={() => handleClick(carta)}
      
      // 🟢 hover
      whileHover={{ scale: 1.08 }}

      // 🔴 animación error (shake)
      animate={{
        x: error ? [0, -10, 10, -10, 10, 0] : 0,
        scale: carta.encontrada ? 1.1 : 1
      }}

      transition={{ duration: 0.3 }}
    >
      <div className={`carta-inner ${abierta ? "flip" : ""}`}>
        
        {/* Frente */}
        <div className="carta-frente">
          ?
        </div>

        {/* Atrás */}
        <div className="carta-atras">
          {carta.imagen ? (
            <img src={`/img/${carta.imagen}`} alt={carta.valor} />
          ) : (
            carta.contenido
          )}
        </div>

      </div>
    </motion.div>
  );
}