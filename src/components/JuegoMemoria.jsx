import { useState, useEffect, useRef } from "react";
import Tablero from "./Tablero";
import confetti from "canvas-confetti";
import "../css/JuegoMemoria.css";

export default function JuegoMemoria({ tarjetas }) {

  const [nivel, setNivel] = useState(1);
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorIds, setErrorIds] = useState([]);

  const [intentos, setIntentos] = useState(0);
  const [nombre, setNombre] = useState("");
  const [ranking, setRanking] = useState([]);

  // sonidos con useRef evita que se rendericen los sonidos 
  const sonidoFlip = useRef(new Audio("/sonidos/flip.mp3"));
  const sonidoFin = useRef(new Audio("/sonidos/fin.mp3"));

  const niveles = {
    1: 8,
    2: 10,
    3: 12
  };

  // Seleccionar cartas
  const selecionarCartas = (nivel) => {
    const cantidad = niveles[nivel];
    const paresNecesarios = cantidad / 2;

    const tipoNivel =
      nivel === 1 ? "numero" :
      nivel === 2 ? "animal" :
      "transporte";

    const tarjetasFiltradas = (tarjetas || [])
      .filter(t => t.tipo === tipoNivel);

    const grupos = {};

    tarjetasFiltradas.forEach(carta => {
      if (!grupos[carta.parId]) {
        grupos[carta.parId] = [];
      }
      grupos[carta.parId].push(carta);
    });

    const pares = Object.values(grupos)
      .filter(grupo => grupo.length === 2)
      .sort(() => Math.random() - 0.5)
      .slice(0, paresNecesarios);

    return pares
      .flat()
      .map(carta => ({
        ...carta,
        uid: crypto.randomUUID(),
        abierta: false,
        encontrada: false
      }))
      .sort(() => Math.random() - 0.5);
  };

  // cargar cartas
  useEffect(() => {
    if (!tarjetas) return;
    setCartas(selecionarCartas(nivel));
    setSeleccionadas([]);
  }, [nivel, tarjetas]);

  // click carta
  const handleClick = (carta) => {
    if (bloqueado || carta.abierta || carta.encontrada) return;

    sonidoFlip.current.play();

    const nuevas = cartas.map(c =>
      c.uid === carta.uid ? { ...c, abierta: true } : c
    );

    const nuevasSeleccionadas = [...seleccionadas, carta];

    setCartas(nuevas);
    setSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === 2) {
      setIntentos(prev => prev + 1);
      verificarPareja(nuevasSeleccionadas);
    }
  };

  // verificar pareja
  const verificarPareja = ([c1, c2]) => {
    setBloqueado(true);

    const esPareja = c1.parId === c2.parId;

     if (!esPareja) {
      setErrorIds([c1.uid, c2.uid]);
    }

    setTimeout(() => {
      setCartas(prev =>
        prev.map(c => {
          if (c.uid === c1.uid || c.uid === c2.uid) {
            return {
              ...c,
              abierta: esPareja,
              encontrada: esPareja
            };
          }
          return esPareja ? c : { ...c, abierta: false };
        })
      );

      setSeleccionadas([]);
      setBloqueado(false);
      setErrorIds([]);
    }, 800);
  };

  // detectar fin
  useEffect(() => {
    if (cartas.length && cartas.every(c => c.encontrada)) {

      if (nivel < 3) {
        setTimeout(() => setNivel(nivel + 1), 800);
      } else {
        sonidoFin.current.play();

        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });

        setTimeout(() => setMostrarModal(true), 500);
      }
    }
  }, [cartas]);

  // cargar ranking
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ranking")) || [];
    setRanking(data);
  }, []);

  // guardar ranking
  const guardarRanking = () => {
    if (!nombre.trim()) return alert("Ingrese su nombre");

    const nuevo = {
      nombre,
      intentos,
      fecha: new Date().toLocaleDateString()
    };

    const actualizado = [...ranking, nuevo]
      .sort((a, b) => a.intentos - b.intentos)
      .slice(0, 5);

    setRanking(actualizado);
    localStorage.setItem("ranking", JSON.stringify(actualizado));
  };

  // reiniciar el juego
  const reiniciarJuego = () => {
    setNivel(1);
    setIntentos(0);
    setSeleccionadas([]);
    setBloqueado(false);
    setCartas(selecionarCartas(1));
  }

  // borrar localStorage 
  const borrarRanking = () => {
    localStorage.removeItem("ranking");
    setRanking([]);
  }

  return (
    <>
      <div className="container text-center mt-4">
        <h2>Juego de Memoria</h2>
        <div className="mb-3 d-flex justify-content-center gap-2">
          <button 
            className="btn btn-warning"
            onClick={reiniciarJuego}
          >
            Reiniciar juego
          </button>

          <button 
            className="btn btn-danger"
            onClick={borrarRanking}
          >
            Borrar ranking
          </button>
        </div>
        <h4 className="text-primary">Nivel {nivel}</h4>

        <Tablero
          cartas={cartas}
          handleClick={handleClick}
          nivel={nivel}
          errorIds={errorIds}
        />

        {/* Ranking */}
        {ranking.length > 0 && (
          <div className="mt-4">
            <h5>🏆 Ranking</h5>
            <ul className="list-group">
              {ranking.map((r, i) => (
                <li key={i} className="list-group-item">
                  {i + 1}. {r.nombre} - {r.intentos} intentos
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {mostrarModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">

              <div className="modal-header">
                <h5 className="modal-title">¡Felicidades!</h5>
              </div>

              <div className="modal-body">
                <p>Completaste el juego en {intentos} intentos</p>

                <input
                  className="form-control"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    guardarRanking();
                    setNivel(1);
                    setIntentos(0);
                    setNombre("");
                    setMostrarModal(false);
                  }}
                >
                  Guardar y jugar otra vez
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}