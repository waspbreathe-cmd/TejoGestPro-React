import { useState } from "react";

/**
 * Componente PedidosPanel (HU-012 a HU-014)
 * Permite agregar consumos asociados a una cancha y calcular
 * automáticamente el valor total para el cierre de cuenta.
 */
function PedidosPanel() {
  // Catálogo base de productos y servicios de la cancha
  const catalogoProductos = [
    { id: "hora-cancha", nombre: "Hora de Cancha de Tejo", precio: 25000 },
    { id: "petaco-cerveza", nombre: "Petaco de Cerveza Nacional", precio: 68000 },
    { id: "gaseosa-litro", nombre: "Gaseosa 1.5 Litros", precio: 7500 },
    { id: "picada-mixta", nombre: "Picada Criolla Familiar", precio: 42000 },
  ];

  const [canchaActiva, setCanchaActiva] = useState("Cancha 2 - Norte");
  const [productoSeleccionado, setProductoSeleccionado] = useState("petaco-cerveza");
  const [cantidad, setCantidad] = useState(1);
  const [itemsPedido, setItemsPedido] = useState([
    { id: 101, nombre: "Hora de Cancha de Tejo", cantidad: 2, precioUnitario: 25000 },
  ]);
  const [cierreConfirmado, setCierreConfirmado] = useState(false);

  // Agrega un ítem al consumo de la cancha activa
  const handleAgregarItem = (event) => {
    event.preventDefault();
    const producto = catalogoProductos.find((p) => p.id === productoSeleccionado);
    if (!producto || cantidad < 1) return;

    const nuevoItem = {
      id: Date.now(),
      nombre: producto.nombre,
      cantidad: Number(cantidad),
      precioUnitario: producto.precio,
    };

    setItemsPedido((prev) => [...prev, nuevoItem]);
    setCantidad(1);
    setCierreConfirmado(false);
  };

  // Elimina un ítem de la lista de consumo
  const handleQuitarItem = (id) => {
    setItemsPedido((prev) => prev.filter((item) => item.id !== id));
  };

  // Cálculo dinámico del total acumulado
  const totalCuenta = itemsPedido.reduce(
    (acumulado, item) => acumulado + item.cantidad * item.precioUnitario,
    0
  );

  return (
    <section className="module-container">
      <div className="module-header">
        <h2>Pedidos y Cierre de Cuenta (HU-012 a HU-014)</h2>
      </div>

      <form className="card-form" onSubmit={handleAgregarItem}>
        <div className="form-grid">
          <select value={canchaActiva} onChange={(e) => setCanchaActiva(e.target.value)}>
            <option value="Cancha 1 - Principal">Cancha 1 - Principal</option>
            <option value="Cancha 2 - Norte">Cancha 2 - Norte</option>
            <option value="Cancha 3 - Cubierta">Cancha 3 - Cubierta</option>
          </select>

          <select
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(e.target.value)}
          >
            {catalogoProductos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre} (${prod.precio.toLocaleString("es-CO")})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="20"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Agregar Consumo
        </button>
      </form>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto / Servicio</th>
              <th>Cantidad</th>
              <th>Valor Unitario</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {itemsPedido.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>${item.precioUnitario.toLocaleString("es-CO")}</td>
                <td>${(item.cantidad * item.precioUnitario).toLocaleString("es-CO")}</td>
                <td>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleQuitarItem(item.id)}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="checkout-bar">
        <div>
          <strong>Cuenta activa ({canchaActiva}): </strong>
          <span className="total-amount">${totalCuenta.toLocaleString("es-CO")} COP</span>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setCierreConfirmado(true)}
        >
          Generar Cierre de Cuenta
        </button>
      </div>

      {cierreConfirmado && (
        <p className="status-msg">
          Cierre registrado para {canchaActiva} por un total de ${totalCuenta.toLocaleString("es-CO")} COP.
        </p>
      )}
    </section>
  );
}

export default PedidosPanel;
