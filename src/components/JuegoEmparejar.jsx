import { useState, useRef, useEffect } from "react";


export default function JuegoEmparejar() {
  const containerRef = useRef(null);
  const previewLineRef = useRef(null);
  const rafRef = useRef(null);

  const [juego, setJuego] = useState(null);
  const [conceptos, setConceptos] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lineas, setLineas] = useState([]);
  const [drag, setDrag] = useState(null);
  const [usadosConceptos, setUsadosConceptos] = useState(new Set());
  const [usadosRespuestas, setUsadosRespuestas] = useState(new Set());

  // cargar JSON
  useEffect(() => {
    fetch("/data/juego.json")
      .then((res) => res.json())
      .then((json) => {
        const juegoActual = json.juego.find(j => j.tipo === "emparejar");

        setJuego(juegoActual);
        setConceptos(juegoActual.conceptos);
        setRespuestas([...juegoActual.conceptos].sort(() => Math.random() - 0.5));

        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // iniciar drag
  const handlePointerDown = (e, item) => {
    if (usadosConceptos.has(item.id)) return;

    const rect = e.target.getBoundingClientRect();

    setDrag({
      item,
      x: rect.right,
      y: rect.top + rect.height / 2
    });

    previewLineRef.current.style.display = "block";
  };

  // mover
  const handlePointerMove = (e) => {
    if (!drag || !previewLineRef.current) return;
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();

      previewLineRef.current.setAttribute("x1", drag.x - rect.left);
      previewLineRef.current.setAttribute("y1", drag.y - rect.top);
      previewLineRef.current.setAttribute("x2", e.clientX - rect.left);
      previewLineRef.current.setAttribute("y2", e.clientY - rect.top);

      rafRef.current = null;
    });
  };

  // soltar
  const handlePointerUp = (target, e) => {
    if (!drag) return;
    if (usadosRespuestas.has(target.id)) return;

    const rect = containerRef.current.getBoundingClientRect();
    const targetRect = e.target.getBoundingClientRect();

    const esCorrecto = drag.item.id === target.id;

    setLineas((prev) => [
      ...prev,
      {
        x1: drag.x - rect.left,
        y1: drag.y - rect.top,
        x2: targetRect.left - rect.left,
        y2: targetRect.top + targetRect.height / 2 - rect.top,
        correcto: esCorrecto
      }
    ]);

    setUsadosConceptos((prev) => new Set(prev).add(drag.item.id));
    setUsadosRespuestas((prev) => new Set(prev).add(target.id));

    setDrag(null);
    previewLineRef.current.style.display = "none";
  };

  if (loading || !juego) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div
  ref={containerRef}
  className="container py-4 position-relative"
  onPointerMove={handlePointerMove}
  style={{ touchAction: "none" }}
>
  <div className="game-container">

    {/* HEADER */}
    <div className="text-center mb-4">
      <div className="game-title">{juego.titulo}</div>
      <div className="game-subtitle">{juego.instrucciones}</div>
    </div>

    {/* SVG */}
    <svg className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: "none" }}>
      {lineas.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.correcto ? "#28a745" : "#dc3545"}
          strokeWidth="4"
        />
      ))}

      <line
        ref={previewLineRef}
        stroke="#999"
        strokeDasharray="5,5"
        strokeWidth="3"
        style={{ display: "none" }}
      />
    </svg>

    <div className="row justify-content-center">
      
      {/* CONCEPTOS */}
      <div className="col-5 col-md-4">
        {conceptos.map((item) => {
          const usado = usadosConceptos.has(item.id);

          return (
            <div
              key={item.id}
              className={`card game-card p-3 mb-3 text-center shadow-sm 
              ${usado ? "disabled" : ""}`}
              onPointerDown={(e) => handlePointerDown(e, item)}
            >
              {item.concepto}
            </div>
          );
        })}
      </div>

      <div className="col-2 d-none d-md-block"></div>

      {/* RESPUESTAS */}
      <div className="col-5 col-md-4">
        {respuestas.map((item) => {
          const usado = usadosRespuestas.has(item.id);

          // buscar si fue correcto o incorrecto
          const conexion = lineas.find(l => l.to === item.id);

          let estado = "";
          if (conexion) {
            estado = conexion.correcto ? "correct" : "incorrect";
          }

          return (
            <div
              key={item.id}
              className={`card game-card p-3 mb-3 text-center shadow-sm 
              ${usado ? "disabled" : ""} ${estado}`}
              onPointerUp={(e) => handlePointerUp(item, e)}
            >
              {item.respuesta}
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
  );
}