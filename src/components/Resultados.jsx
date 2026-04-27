import './Resultados.css'

function Resultados({ puntaje, totalPreguntas, respuestas, preguntas, onRestart }) {
  const porcentaje = Math.round((puntaje / totalPreguntas) * 100)
  
  const getMensaje = () => {
    if (porcentaje >= 80) return '¡Excelente! Dominas el tema'
    if (porcentaje >= 60) return 'Muy bien, buen desempeño'
    if (porcentaje >= 40) return 'Puedes mejorar, sigue estudiando'
    return 'Necesitas estudiar más'
  }

  const getColor = () => {
    if (porcentaje >= 80) return '#4CAF50'
    if (porcentaje >= 60) return '#2196F3'
    if (porcentaje >= 40) return '#FF9800'
    return '#f44336'
  }

  return (
    <div className="resultados-container">
      <div className="resultados-card">
        <h1>Quiz Completado</h1>
        
        <div className="score-circle" style={{ borderColor: getColor() }}>
          <div className="score-number" style={{ color: getColor() }}>
            {puntaje}/{totalPreguntas}
          </div>
          <div className="score-percentage" style={{ color: getColor() }}>
            {porcentaje}%
          </div>
        </div>
        
        <p className="resultado-mensaje" style={{ color: getColor() }}>
          {getMensaje()}
        </p>
        
        <div className="respuestas-detalle">
          <h2>Revisión de Respuestas</h2>
          {preguntas.map((preguntaData, index) => {
            const respuestaIndex = respuestas[index]
            const respuestaTexto = respuestaIndex != null ? preguntaData.opciones[respuestaIndex]?.texto : 'Sin respuesta'
            const esCorrecta = preguntaData.opciones[respuestaIndex]?.correcta
            
            return (
              <div 
                key={index} 
                className={`respuesta-item ${esCorrecta ? 'correcta' : 'incorrecta'}`}
              >
                <span className="numero-respuesta">{index + 1}</span>
                <div className="detalle-respuesta">
                  <p className="pregunta-rev">{preguntaData.pregunta}</p>
                  <p className="tu-respuesta">
                    Tu respuesta: <strong>{respuestaTexto}</strong>
                  </p>
                  <p className={`estado ${esCorrecta ? 'correcta' : 'incorrecta'}`}>
                    {esCorrecta ? '✓ Correcta' : '✗ Incorrecta'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        
        <button className="btn-restart" onClick={onRestart}>
          Intentar Nuevamente
        </button>
      </div>
    </div>
  )
}

export default Resultados
