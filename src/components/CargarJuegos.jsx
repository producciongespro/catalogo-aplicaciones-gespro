import JuegoImgMusica from "./JuegoImgMusica"
import JuegoAudioAnimales from "./JuegoAudioAnimales"
import JuegoImgFormas from "./JuegoImgFormas"

export default function CargarJuegos(props) {
    const tipos = {
        imagenes: JuegoImgMusica,
        sonido: JuegoAudioAnimales,
        imagenesFormas: JuegoImgFormas
    }

    const Componente = tipos[props.juego.tipo]

    return <Componente {...props}/>
}