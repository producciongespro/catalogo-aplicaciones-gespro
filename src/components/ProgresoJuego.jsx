export default function ProgresoJuego({mensaje, contadorJuegos, juegos}) {
    return(
        <>
            <h3 className="mensaje-progreso">{mensaje}</h3>
            <p className="progreso">
                Juego {contadorJuegos + 1} de {juegos.length}
            </p>
        </>
    )
}