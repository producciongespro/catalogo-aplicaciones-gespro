import './Home.css'

function Home({ onStart }) {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Quiz de conocimientos b&aacute;sicos en matem&aacute;ticas</h1>
        <p className="subtitle">Pon a prueba tus conocimientos</p>
        
        <div className="home-content">
          <p>
            Bienvenido a nuestro quiz interactivo de matem&aacute;ticas b&aacute;sicas. Responde las siguientes 5 preguntas sobre 
            diferentes temas y obt&eacute;n tu puntuaci&oacute;n final.
          </p>
          
          <div className="features">
            <h2>Lo que encontrar&aacute;s:</h2>
            <ul>
              <li>✓ 5 preguntas b&aacute;sicas de matem&eacute;ticas de m&uacute;ltiple opci&oacute;n</li>
              <li>✓ 4 opciones por pregunta</li>
              <li>✓ Retroalimentaci&oacute;n inmediata</li>
              <li>✓ Puntuaci&oacute;n final</li>
            </ul>
          </div>
        </div>
        
        <button className="btn-start" onClick={onStart}>
          Comenzar Quiz
        </button>
      </div>
    </div>
  )
}

export default Home
