import JuegoImgMusica from "./JuegoImgMusica"
import JuegoAudioAnimales from "./JuegoAudioAnimales"

export default function CargarJuegos(props) {
    const tipos = {
        imagenes: JuegoImgMusica,
        sonido: JuegoAudioAnimales
    }

    const Componente = tipos[props.juego.tipo]

    return <Componente {...props}/>
}