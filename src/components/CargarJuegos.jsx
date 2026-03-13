import JuegoImgMusica from "./JuegoImgMusica"
import JuegoAudioAnimales from "./JuegoAudioAnimales"
import JuegoImgFormas from "./JuegoImgFormas"
import JuegoMapaCr from "./JuegoMapaCr"

export default function CargarJuegos(props) {
    const tipos = {
        imagenes: JuegoImgMusica,
        sonido: JuegoAudioAnimales,
        imagenesFormas: JuegoImgFormas,
        mapaCR: JuegoMapaCr
    }

    const Componente = tipos[props.juego.tipo]

    return <Componente {...props}/>
}