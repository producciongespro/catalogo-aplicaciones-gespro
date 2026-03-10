export default function JuegoAudioAnimales({ juego }) {

    const play = ()=>{
    const audio = new Audio(`/sonidos/${juego.sonido}`)
    audio.play()
    }

    return(
    <div>

    <h2>{juego.titulo}</h2>
    <h3>{juego.instrucciones}</h3>

    <button onClick={play}>
    🔊 Escuchar sonido
    </button>

    </div>
)
}