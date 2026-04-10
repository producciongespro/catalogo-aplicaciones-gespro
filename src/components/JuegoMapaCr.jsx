import ProgresoJuego from "./ProgresoJuego";
import TituloJuego from "./TituloJuegos";
import MapaCostaRica from "./MapaCostaRica";

export default function JuegoMapaCr({
  juego,
  elementos,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) {
  return (
    <div className="pt-3">
      <TituloJuego titulo={juego.titulo} instrucciones={juego.instrucciones} />

      <div className="row">
        {/* provincias arrastrables */}

        <div className="col-12 d-flex justify-content-center flex-wrap gap-3 mt-5 mb-3">
          {elementos.map((elemento) => (
            <img
              key={elemento.id}
              src={`/imagenes/${elemento.imagen}`}
              className="elemento"
              draggable={false}
              onPointerDown={(e) => handlePointerDown(e, elemento)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}

              style={{
                  touchAction: "none",
                  userSelect: "none",
                  cursor: "grab"
              }}
            />
          ))}
        </div>

        {/* mapa de cr en svg */}

        <div className="col-12 d-flex justify-content-center">
            <MapaCostaRica
                areaActiva={areaActiva}
                estadoDrop={estadoDrop}
            />
        </div>

        <ProgresoJuego
          mensaje={mensaje}
          contadorJuegos={contadorJuegos}
          juegos={juegos}
        />
      </div>
    </div>
  );
}
