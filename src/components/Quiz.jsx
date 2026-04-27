import { useState, useEffect, useMemo } from 'react'
import './Quiz.css'
import Pregunta from './Pregunta'
import Resultados from './Resultados'
import Home from './Home'

function Quiz() {
  const [estado, setEstado] = useState('home') // 'home', 'quiz', 'resultados'
  const [preguntas, setPreguntas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  
  const [indicePreguntaActual, setIndicePreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState([])
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null)

  // Cargar datos del JSON
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        setCargando(true)
        const response = await fetch('/datos.json')
        if (!response.ok) {
          throw new Error('Error al cargar las preguntas')
        }
        const data = await response.json()
        setPreguntas(data.preguntas)
        setRespuestas(Array(data.preguntas.length).fill(null))
      } catch (err) {
        setError(err.message)
        console.error('Error:', err)
      } finally {
        setCargando(false)
      }
    }

    cargarPreguntas()
  }, [])

  // Sincronizar selección al cambiar de pregunta
  useEffect(() => {
    setRespuestaSeleccionada(respuestas[indicePreguntaActual] ?? null)
  }, [indicePreguntaActual, respuestas])

  const puntaje = useMemo(() => {
    return preguntas.reduce((acum, pregunta, idx) => {
      const respuestaIndex = respuestas[idx]
      if (respuestaIndex === null || respuestaIndex === undefined) return acum
      return pregunta.opciones[respuestaIndex]?.correcta ? acum + 1 : acum
    }, 0)
  }, [preguntas, respuestas])

  // Manejar respuesta
  const handleAnswer = (indexOpcion) => {
    setRespuestaSeleccionada(indexOpcion)

    const nuevasRespuestas = [...respuestas]
    nuevasRespuestas[indicePreguntaActual] = indexOpcion
    setRespuestas(nuevasRespuestas)
  }

  const handlePrev = () => {
    if (indicePreguntaActual > 0) {
      setIndicePreguntaActual(indicePreguntaActual - 1)
    }
  }

  const handleNext = () => {
    if (indicePreguntaActual < preguntas.length - 1) {
      setIndicePreguntaActual(indicePreguntaActual + 1)
      return
    }

    setEstado('resultados')
  }

  // Iniciar quiz
  const handleStart = () => {
    if (preguntas.length === 0) {
      setError('No se pudieron cargar las preguntas')
      return
    }
    setEstado('quiz')
    setRespuestas(Array(preguntas.length).fill(null))
    setIndicePreguntaActual(0)
    setRespuestaSeleccionada(null)
  }

  // Reiniciar quiz
  const handleRestart = () => {
    setEstado('home')
    setRespuestas(Array(preguntas.length).fill(null))
    setIndicePreguntaActual(0)
    setRespuestaSeleccionada(null)
  }

  // Estados de renderizado
  if (error) {
    return (
      <div className="quiz-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (estado === 'home') {
    return <Home onStart={handleStart} />
  }

  if (estado === 'quiz') {
    if (preguntas.length === 0) {
      return <div className="quiz-loading">Cargando preguntas...</div>
    }

    return (
      <Pregunta
        preguntaData={preguntas[indicePreguntaActual]}
        numeroPregunta={indicePreguntaActual + 1}
        totalPreguntas={preguntas.length}
        onAnswer={handleAnswer}
        respuestaSeleccionada={respuestaSeleccionada}
        onPrev={handlePrev}
        onNext={handleNext}
        canPrev={indicePreguntaActual > 0}
        canNext={respuestaSeleccionada !== null}
        isLast={indicePreguntaActual === preguntas.length - 1}
      />
    )
  }

  if (estado === 'resultados') {
    return (
      <Resultados
        puntaje={puntaje}
        totalPreguntas={preguntas.length}
        respuestas={respuestas}
        preguntas={preguntas}
        onRestart={handleRestart}
      />
    )
  }
}

export default Quiz