import { useState, useEffect } from "react";

export default function CuentaRegresiva({ terminar }) {

  const total = 3;
  const [numero, setNumero] = useState(total);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // progreso basado en el número actual
  const progreso = numero / total;
  const offset = circumference * progreso;

  useEffect(() => {

    if (numero === 0) {
      terminar();
      return;
    }

    const timer = setTimeout(() => {
      setNumero((n) => n - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [numero]);

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">

      <div className="progreso-circulo">

        <svg width="220" height="220">

          {/* círculo base */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#e9ecef"
            strokeWidth="12"
            fill="none"
          />

          {/* progreso */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#28a745"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />

        </svg>

        <div className="contador-numero">
          {numero}
        </div>

      </div>

      <h3 className="mt-4">¡Prepárate!</h3>

    </div>
  );
}