import { FaPlay } from "react-icons/fa";
export default function PantallaInicio({iniciar}) {


    const handleIniciarJuego = ()=>{
        const audio = new Audio("/sonidos/click.mp3")
        audio.play();
        setTimeout(() => {
            iniciar();
        }, 300); // pequeño retraso para que se escuche el click
    }

    return (
      <div className="row">
        <div className="col-12">
          <div className="inicio-bg d-flex justify-content-center align-items-center">

            <div className="inicio-card shadow-lg text-center">

              <img
                src="/imagenes/robot.png"
                className="robot-img"
                alt="robot"
              />

              <div className="p-4 mt-4">

                <p className="text-muted">
                  ¡Aprende jugando!
                </p>

                <h2 className="fw-bold">
                  ¿Comencemos a jugar?
                </h2>

                <button
                  className="btn btn-success btn-lg mt-3 inicio-btn"
                  onClick={handleIniciarJuego}
                >
                  <FaPlay /> Iniciar juego
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>
  );
}
