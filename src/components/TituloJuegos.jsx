export default function TituloJuego({titulo,instrucciones}) {
    return(
        <>
            <h2 className="titulo-juego">{titulo}</h2>
            <h3 className="instrucciones">{instrucciones}</h3>
        </>
    )
}