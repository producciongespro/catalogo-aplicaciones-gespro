import './Pregunta.css'

function Pregunta({ preguntaData, numeroPregunta, totalPreguntas, onAnswer, respuestaSeleccionada }) {
  const { pregunta, opciones } = preguntaData

  return (
    <div className="pregunta-container">
      <div className="progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(numeroPregunta / totalPreguntas) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">Pregunta {numeroPregunta} de {totalPreguntas}</p>
      </div>

      <div className="pregunta-card">
        <h2 className="pregunta-texto">{pregunta}</h2>
        
        <div className="opciones">
          {opciones.map((opcion, index) => (
            <button
              key={index}
              className={`opcion ${
                respuestaSeleccionada === index ? 'seleccionada' : ''
              }`}
              onClick={() => onAnswer(index)}
            >
              <span className="opcion-letra">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="opcion-texto">{opcion.texto}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pregunta
