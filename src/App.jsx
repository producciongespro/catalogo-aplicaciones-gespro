import { useEffect, useRef, useState } from 'react'

const TIEMPO_POR_PREGUNTA = 15
const STORAGE_KEY = 'rankingFalsoVerdaderoPremium'

export default function App() {
  const [preguntas, setPreguntas] = useState([])
  const [indiceActual, setIndiceActual] = useState(0)
  const [puntos, setPuntos] = useState(0)
  const [tiempo, setTiempo] = useState(TIEMPO_POR_PREGUNTA)
  const [juegoIniciado, setJuegoIniciado] = useState(false)
  const [juegoTerminado, setJuegoTerminado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensajeRespuesta, setMensajeRespuesta] = useState('')
  const [mostrarFeedback, setMostrarFeedback] = useState(false)
  const [ranking, setRanking] = useState([])
  const [motivoFin, setMotivoFin] = useState('')

  const sonidoCorrecto = useRef(null)
  const sonidoIncorrecto = useRef(null)
  const timeoutFeedback = useRef(null)

  useEffect(() => {
    cargarPreguntas()
    cargarRanking()

    return () => {
      if (timeoutFeedback.current) {
        clearTimeout(timeoutFeedback.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!juegoIniciado || juegoTerminado || mostrarFeedback) return

    if (tiempo <= 0) {
      finalizarJuego('Se agotó el tiempo.')
      return
    }

    const intervalo = setInterval(() => {
      setTiempo((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(intervalo)
  }, [tiempo, juegoIniciado, juegoTerminado, mostrarFeedback])

  const cargarPreguntas = async () => {
    try {
      setCargando(true)
      setError('')

      const response = await fetch('/data/preguntas.json')

      if (!response.ok) {
        throw new Error('No se pudieron cargar las preguntas.')
      }

      const data = await response.json()
      const preguntasMezcladas = [...data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)

      setPreguntas(preguntasMezcladas)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al cargar las preguntas.')
    } finally {
      setCargando(false)
    }
  }

  const cargarRanking = () => {
    const datos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    setRanking(datos)
  }

  const guardarRanking = (puntajeFinal) => {
    const nuevoRegistro = {
      fecha: new Date().toLocaleString(),
      puntos: puntajeFinal
    }

    const rankingActual = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    const rankingActualizado = [...rankingActual, nuevoRegistro]
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 5)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingActualizado))
    setRanking(rankingActualizado)
  }

  const iniciarJuego = async () => {
    await cargarPreguntas()
    setIndiceActual(0)
    setPuntos(0)
    setTiempo(TIEMPO_POR_PREGUNTA)
    setMensajeRespuesta('')
    setMostrarFeedback(false)
    setMotivoFin('')
    setJuegoTerminado(false)
    setJuegoIniciado(true)
  }

  const reiniciarJuego = async () => {
    if (timeoutFeedback.current) {
      clearTimeout(timeoutFeedback.current)
    }

    setJuegoIniciado(false)
    setJuegoTerminado(false)
    setIndiceActual(0)
    setPuntos(0)
    setTiempo(TIEMPO_POR_PREGUNTA)
    setMensajeRespuesta('')
    setMostrarFeedback(false)
    setMotivoFin('')
    await cargarPreguntas()
  }

  const finalizarJuego = (motivo = '') => {
    setJuegoIniciado(false)
    setJuegoTerminado(true)
    setMotivoFin(motivo)
    guardarRanking(puntos)
  }

  const reproducirSonido = (esCorrecta) => {
    const audio = esCorrecta ? sonidoCorrecto.current : sonidoIncorrecto.current

    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
  }

  const responderPregunta = (respuestaUsuario) => {
    if (mostrarFeedback || !preguntas[indiceActual]) return

    const preguntaActual = preguntas[indiceActual]
    const esCorrecta = respuestaUsuario === preguntaActual.respuesta
    const nuevoPuntaje = esCorrecta ? puntos + 1 : puntos

    setPuntos(nuevoPuntaje)
    setMensajeRespuesta(esCorrecta ? '¡Correcto!' : 'Incorrecto')
    setMostrarFeedback(true)
    reproducirSonido(esCorrecta)

    timeoutFeedback.current = setTimeout(() => {
      const siguienteIndice = indiceActual + 1

      if (siguienteIndice < preguntas.length) {
        setIndiceActual(siguienteIndice)
        setTiempo(TIEMPO_POR_PREGUNTA)
        setMensajeRespuesta('')
        setMostrarFeedback(false)
      } else {
        setPuntos(nuevoPuntaje)
        setJuegoIniciado(false)
        setJuegoTerminado(true)
        setMotivoFin('Has completado todas las preguntas.')
        guardarRanking(nuevoPuntaje)
      }
    }, 1200)
  }

  const obtenerClaseTiempo = () => {
    if (tiempo <= 5) return 'danger'
    if (tiempo <= 10) return 'warning'
    return 'success'
  }

  const obtenerMensajeResultado = () => {
    if (puntos === 10) return 'Excelente resultado'
    if (puntos >= 7) return 'Muy buen desempeño'
    if (puntos >= 5) return 'Buen intento'
    return 'Sigue practicando'
  }

  const porcentajeTiempo = (tiempo / TIEMPO_POR_PREGUNTA) * 100
  const preguntaActual = preguntas[indiceActual]

  if (cargando) {
    return (
      <div className="app-shell">
        <div className="container-app">
          <div className="premium-panel centered-panel">
            <div className="loader-ring" />
            <h2 className="loading-title">Cargando experiencia</h2>
            <p className="loading-text">Preparando las preguntas del juego...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="container-app">
          <div className="premium-card error-card">
            <div className="status-icon error-icon">!</div>
            <h2>No se pudo iniciar</h2>
            <p>{error}</p>
            <button className="btn btn-primary premium-btn" onClick={cargarPreguntas}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <audio ref={sonidoCorrecto} src="/sounds/correcto.mp3" preload="auto" />
      <audio ref={sonidoIncorrecto} src="/sounds/incorrecto.mp3" preload="auto" />

      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-grid" />

      <div className="container-app">
        {!juegoIniciado && !juegoTerminado && (
          <section className="hero-panel">
            <div className="hero-badge">Juego interactivo</div>

            <h1 className="hero-title">Falso o Verdadero</h1>

            <p className="hero-subtitle">
              Pon a prueba tus conocimientos sobre animales con una experiencia visual
              moderna, rápida y desafiante.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">10</span>
                <span className="hero-stat-label">preguntas</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">15s</span>
                <span className="hero-stat-label">por pregunta</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">Top 5</span>
                <span className="hero-stat-label">ranking local</span>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn btn-warning premium-btn premium-btn-xl" onClick={iniciarJuego}>
                Comenzar partida
              </button>
            </div>

            <div className="hero-note">
              Si el tiempo llega a cero, la partida termina automáticamente con el puntaje acumulado.
            </div>

            <div className="ranking-panel">
              <div className="ranking-header">
                <h3>Ranking de puntuaciones</h3>
                <span className="ranking-chip">Top 5</span>
              </div>

              {ranking.length === 0 ? (
                <div className="ranking-empty">
                  Aún no hay resultados guardados. Juega tu primera partida.
                </div>
              ) : (
                <div className="ranking-list">
                  {ranking.map((item, index) => (
                    <div className="ranking-item" key={`${item.fecha}-${index}`}>
                      <div className="ranking-left">
                        <div className={`ranking-position ${index === 0 ? 'gold' : ''}`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="ranking-date">{item.fecha}</div>
                          <div className="ranking-label">Puntuación registrada</div>
                        </div>
                      </div>
                      <div className="ranking-score">{item.puntos} pts</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {juegoIniciado && !juegoTerminado && preguntaActual && (
          <section className="question-layout">
            <div className="question-card">
              <div className="question-topbar">
                <div className="glass-chip">
                  Pregunta {indiceActual + 1} de {preguntas.length}
                </div>
                <div className="glass-chip primary-chip">Puntos: {puntos}</div>
              </div>

              <div className="time-block">
                <div className="time-label-row">
                  <span>Tiempo restante</span>
                  <span className={`time-value ${obtenerClaseTiempo()}`}>{tiempo}s</span>
                </div>

                <div className="timebar-shell">
                  <div
                    className={`timebar-fill ${obtenerClaseTiempo()}`}
                    style={{ width: `${porcentajeTiempo}%` }}
                  />
                </div>
              </div>

              <div className="question-text-wrap">
                <h2 className="question-title">{preguntaActual.pregunta}</h2>
              </div>

              <div className="media-panel">
                {preguntaActual.imagen ? (
                  <img
                    src={preguntaActual.imagen}
                    alt="Imagen relacionada con la pregunta"
                    className="question-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    <div className="placeholder-icon">🦊</div>
                    <div className="placeholder-title">Pregunta sin imagen</div>
                    <div className="placeholder-text">
                      Puedes responder normalmente aunque esta tarjeta no incluya ilustración.
                    </div>
                  </div>
                )}
              </div>

              {mostrarFeedback && (
                <div
                  className={`feedback-banner ${
                    mensajeRespuesta === '¡Correcto!' ? 'feedback-ok' : 'feedback-bad'
                  }`}
                >
                  {mensajeRespuesta}
                </div>
              )}

              <div className="action-row">
                <button
                  className="btn btn-success premium-answer-btn"
                  onClick={() => responderPregunta(true)}
                  disabled={mostrarFeedback}
                >
                  <span className="answer-symbol">V</span>
                  <span>Verdadero</span>
                </button>

                <button
                  className="btn btn-danger premium-answer-btn"
                  onClick={() => responderPregunta(false)}
                  disabled={mostrarFeedback}
                >
                  <span className="answer-symbol">F</span>
                  <span>Falso</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {juegoTerminado && (
          <section className="result-card">
            <div className="result-header">
              <div className="result-badge">Partida finalizada</div>
              <h1>Resultado final</h1>
              <p>{motivoFin || 'La partida ha terminado.'}</p>
            </div>

            <div className="score-highlight">
              <div className="score-circle">
                <span>{puntos}</span>
                <small>/ 10</small>
              </div>

              <div className="score-summary">
                <h3>{obtenerMensajeResultado()}</h3>
                <p>
                  Has conseguido <strong>{puntos}</strong> punto{puntos !== 1 ? 's' : ''} en esta
                  sesión.
                </p>
              </div>
            </div>

            <div className="ranking-panel result-ranking">
              <div className="ranking-header">
                <h3>Mejores puntuaciones</h3>
                <span className="ranking-chip">Actualizado</span>
              </div>

              {ranking.length === 0 ? (
                <div className="ranking-empty">No hay puntuaciones registradas.</div>
              ) : (
                <div className="ranking-list">
                  {ranking.map((item, index) => (
                    <div className="ranking-item" key={`${item.fecha}-${index}`}>
                      <div className="ranking-left">
                        <div className={`ranking-position ${index === 0 ? 'gold' : ''}`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="ranking-date">{item.fecha}</div>
                          <div className="ranking-label">Resultado guardado</div>
                        </div>
                      </div>
                      <div className="ranking-score">{item.puntos} pts</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="result-actions">
              <button className="btn btn-primary premium-btn premium-btn-xl" onClick={reiniciarJuego}>
                Jugar de nuevo
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
