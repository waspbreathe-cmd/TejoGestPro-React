import { useState } from "react";

/**
 * Componente CanchasBoard (HU-001 a HU-007)
 * Muestra el estado en tiempo real de las canchas de tejo
 * y permite registrar reservas controladas sin cruces de horario.
 */
function CanchasBoard() {
  // Estado inicial de las canchas del establecimiento
  const [canchas, setCanchas] = useState([
    { id: 1, nombre: "Cancha 1 - Principal", tipo: "Tejo Tradicional", estado: "Disponible", reservaActual: "" },
    { id: 2, nombre: "Cancha 2 - Norte", tipo: "Tejo Tradicional", estado: "Ocupada", reservaActual: "Carlos Gómez (19:00 - 21:00)" },
    { id: 3, nombre: "Cancha 3 - Cubierta", tipo: "Minitejo", estado: "Disponible", reservaActual: "" },
    { id: 4, nombre: "Cancha 4 - Sur", tipo: "Tejo Tradicional", estado: "Mantenimiento", reservaActual: "Arreglo de greda" },
  ]);

  const [canchaId, setCanchaId] = useState("1");
  const [clienteReserva, setClienteReserva] = useState("");
  const [franjaHoraria, setFranjaHoraria] = useState("20:00 - 22:00");
  const [alerta, setAlerta] = useState("");

  // Registra una reserva en la cancha seleccionada mediante onSubmit
  const handleCrearReserva = (event) => {
    event.preventDefault();

    if (!clienteReserva.trim()) {
      setAlerta("Ingrese el nombre del cliente titular para reservar.");
      return;
    }

    const canchaSeleccionada = canchas.find((c) => c.id === Number(canchaId));
    if (!canchaSeleccionada || canchaSeleccionada.estado !== "Disponible") {
      setAlerta("La cancha seleccionada no está disponible en este momento.");
      return;
    }

    setCanchas((prev) =>
      prev.map((cancha) =>
        cancha.id === Number(canchaId)
          ? {
              ...cancha,
              estado: "Ocupada",
              reservaActual: `${clienteReserva} (${franjaHoraria})`,
            }
          : cancha
      )
    );

    setClienteReserva("");
    setAlerta(`Reserva confirmada en ${canchaSeleccionada.nombre}.`);
  };

  // Libera una cancha ocupada mediante evento onClick
  const handleLiberarCancha = (id) => {
    setCanchas((prev) =>
      prev.map((cancha) =>
        cancha.id === id
          ? { ...cancha, estado: "Disponible", reservaActual: "" }
          : cancha
      )
    );
    setAlerta("Cancha liberada y disponible para nuevo turno.");
  };

  return (
    <section className="module-container">
      <div className="module-header">
        <h2>Disponibilidad y Reservas de Canchas (HU-001 a HU-007)</h2>
      </div>

      {/* Formulario de asignación rápida de reserva */}
      <form className="card-form" onSubmit={handleCrearReserva}>
        <div className="form-grid">
          <select value={canchaId} onChange={(e) => setCanchaId(e.target.value)}>
            {canchas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.estado})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Nombre del cliente titular *"
            value={clienteReserva}
            onChange={(e) => setClienteReserva(e.target.value)}
          />

          <select value={franjaHoraria} onChange={(e) => setFranjaHoraria(e.target.value)}>
            <option value="18:00 - 20:00">18:00 - 20:00</option>
            <option value="20:00 - 22:00">20:00 - 22:00</option>
            <option value="22:00 - 00:00">22:00 - 00:00</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Confirmar Reserva
        </button>
      </form>

      {alerta && <p className="status-msg">{alerta}</p>}

      {/* Tablero de tarjetas por cancha */}
      <div className="cards-grid">
        {canchas.map((cancha) => (
          <article key={cancha.id} className="cancha-card">
            <div className="card-top">
              <h3>{cancha.nombre}</h3>
              <span className={`pill pill-${cancha.estado.toLowerCase()}`}>
                {cancha.estado}
              </span>
            </div>
            <p className="card-sub">{cancha.tipo}</p>
            <p className="card-detail">
              {cancha.reservaActual ? `Detalle: ${cancha.reservaActual}` : "Sin turno asignado"}
            </p>
            {cancha.estado === "Ocupada" && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleLiberarCancha(cancha.id)}
              >
                Finalizar Turno
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default CanchasBoard;
