export default function ProgresoJuego({mensaje, contadorJuegos, juegos}) {
    return(
        <div className="row">
            <div className="col-12">
                <h3 className="mensaje-progreso">{mensaje}</h3>
                <p className="progreso">
                    Juego {contadorJuegos + 1} de {juegos.length}
                </p>
            </div>
        </div>
    )
}