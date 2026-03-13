import { useState, useEffect } from 'react'
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
  const [puntaje, setPuntaje] = useState(0)
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
      } catch (err) {
        setError(err.message)
        console.error('Error:', err)
      } finally {
        setCargando(true)
      }
    }

    cargarPreguntas()
  }, [])

  // Manejar respuesta
  const handleAnswer = (indexOpcion) => {
    if (respuestaSeleccionada !== null) return // No permitir cambiar una vez seleccionada

    setRespuestaSeleccionada(indexOpcion)
    
    // Verificar si es correcta
    const preguntaActual = preguntas[indicePreguntaActual]
    const esCorrecta = preguntaActual.opciones[indexOpcion].correcta
    
    // Guardar respuesta
    const nuevasRespuestas = [...respuestas, indexOpcion]
    setRespuestas(nuevasRespuestas)

    if (esCorrecta) {
      setPuntaje(puntaje + 1)
    }

    // Después de 1 segundo ir a la siguiente pregunta o mostrar resultados
    setTimeout(() => {
      if (indicePreguntaActual < preguntas.length - 1) {
        setIndicePreguntaActual(indicePreguntaActual + 1)
        setRespuestaSeleccionada(null)
      } else {
        setEstado('resultados')
      }
    }, 1000)
  }

  // Iniciar quiz
  const handleStart = () => {
    if (preguntas.length === 0) {
      setError('No se pudieron cargar las preguntas')
      return
    }
    setEstado('quiz')
    setRespuestas([])
    setPuntaje(0)
    setIndicePreguntaActual(0)
    setRespuestaSeleccionada(null)
  }

  // Reiniciar quiz
  const handleRestart = () => {
    setEstado('home')
    setRespuestas([])
    setPuntaje(0)
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