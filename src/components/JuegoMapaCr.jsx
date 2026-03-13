import ProgresoJuego from "./ProgresoJuego";
import TituloJuego from "./TituloJuegos";
import MapaCostaRica from "./MapaCostaRica";

export default function JuegoMapaCr({
  juego,
  elementos,
  handleOnDragStart,
  handleOnDrop,
  handlePermitirDrop,
  mensaje,
  contadorJuegos,
  juegos,
  areaActiva,
  estadoDrop,
}) {
  return (
    <div className="pt-3">
      <TituloJuego titulo={juego.titulo} instrucciones={juego.instrucciones} />

      <div className="row">
        {/* provincias arrastrables */}

        <div className="col-12 d-flex justify-content-center flex-wrap gap-3 mt-5 mb-5">
          {elementos.map((elemento) => (
            <img
              key={elemento.id}
              src={`/imagenes/${elemento.imagen}`}
              className="elemento"
              draggable
              onDragStart={(e) => handleOnDragStart(e, elemento)}
            />
          ))}
        </div>

        {/* mapa de cr en svg */}

        <div className="col-12 d-flex justify-content-center">
            <MapaCostaRica
                handleOnDrop={handleOnDrop}
                handlePermitirDrop={handlePermitirDrop}
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
