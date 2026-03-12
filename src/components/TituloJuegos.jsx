export default function TituloJuego({titulo,instrucciones}) {
    return(
         <div className="row fondo-titulos shadow-lg">
            <div className="col-12">
                <h2 className="titulo-juego">{titulo}</h2>
                <hr className="shadow" />
                <h3 className="instrucciones">{instrucciones}</h3>
            </div>
        </div>     
    )
}