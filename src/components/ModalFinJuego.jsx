export default function ModalFinJuego({mostrar, reiniciarJuego,volverInicio}) {
    
    if(!mostrar) return null
    return(
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                <div className="modal-header">
                    <h5 className="modal-title">¡Juego completado!</h5>
                </div>

                <div className="modal-body text-center">
                    <p>Has terminado todos los juegos</p>
                </div>

                <div className="modal-footer justify-content-center">

                    <button 
                        className="btn btn-success"
                        onClick={reiniciarJuego}
                    >
                        Volver a jugar
                    </button>

                    <button 
                        className="btn btn-primary"
                        onClick={volverInicio}
                    >
                        Pantalla inicial
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}