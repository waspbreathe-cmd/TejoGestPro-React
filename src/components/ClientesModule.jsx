import { useState, useEffect } from "react";

/**
 * Componente ClientesModule (HU-010)
 * Gestiona el registro, consulta y eliminación de clientes.
 * Consume la API REST de Spring Boot en http://localhost:8080/clientes
 * con respaldo en estado local para garantizar continuidad operativa.
 */
function ClientesModule() {
  const apiUrl = "http://localhost:8080/clientes";

  // Estado del listado de clientes y estado de conexión con el backend
  const [clientes, setClientes] = useState([
    { id: 1, documento: "1022456789", nombre: "Carlos Andrés Gómez", telefono: "3104567890", correo: "carlos.gomez@correo.com" },
    { id: 2, documento: "80123456", nombre: "Sandra Milena Ruiz", telefono: "3159876543", correo: "sandra.ruiz@correo.com" },
  ]);
  const [backendConectado, setBackendConectado] = useState(false);

  // Estado controlado del formulario de registro
  const [formData, setFormData] = useState({
    documento: "",
    nombre: "",
    telefono: "",
    correo: "",
  });
  const [mensaje, setMensaje] = useState("");

  // Consulta inicial de clientes al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setClientes(data);
          setBackendConectado(true);
        }
      } catch {
        setBackendConectado(false);
      }
    };

    cargarClientes();
  }, []);

  // Maneja cambios en los inputs controlados mediante evento onChange
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Procesa el envío del formulario mediante evento onSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.documento.trim() || !formData.nombre.trim() || !formData.telefono.trim()) {
      setMensaje("Por favor complete documento, nombre y teléfono.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const nuevoCliente = await response.json();
        setClientes((prev) => [...prev, nuevoCliente]);
        setBackendConectado(true);
        setMensaje("Cliente registrado en base de datos Spring Boot.");
      } else {
        throw new Error("Respuesta no válida del servidor");
      }
    } catch {
      // Registro en memoria local si el servidor backend no está encendido
      const clienteLocal = {
        id: Date.now(),
        ...formData,
      };
      setClientes((prev) => [...prev, clienteLocal]);
      setMensaje("Cliente registrado en modo local (Spring Boot desconectado).");
    }

    setFormData({ documento: "", nombre: "", telefono: "", correo: "" });
  };

  // Elimina un cliente por identificador mediante evento onClick
  const handleEliminarCliente = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    } catch {
      // Continúa con actualización local si no hay conexión
    }
    setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    setMensaje("Registro de cliente eliminado.");
  };

  return (
    <section className="module-container">
      <div className="module-header">
        <h2>Gestión de Clientes (HU-010)</h2>
        <span className={`badge ${backendConectado ? "badge-ok" : "badge-warn"}`}>
          {backendConectado ? "API Spring Boot Conectada" : "Modo Local Activo"}
        </span>
      </div>

      {/* Formulario controlado de registro */}
      <form className="card-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            name="documento"
            placeholder="Documento de identidad *"
            value={formData.documento}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo *"
            value={formData.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono de contacto *"
            value={formData.telefono}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn-primary">
          Registrar Cliente
        </button>
      </form>

      {mensaje && <p className="status-msg">{mensaje}</p>}

      {/* Tabla de clientes registrados */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.documento}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo || "No registrado"}</td>
                <td>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleEliminarCliente(cliente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ClientesModule;
