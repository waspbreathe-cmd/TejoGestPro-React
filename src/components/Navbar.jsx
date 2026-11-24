/**
 * Componente Navbar
 * Renderiza la cabecera institucional de TEJOGEST PRO (Canchas de Tejo Don Uriel)
 * y permite alternar entre los módulos operativos mediante estado activo.
 */
function Navbar({ activeTab, onSelectTab }) {
  // Opciones principales del menú alineadas con los requerimientos funcionales
  const menuItems = [
    { id: "canchas", label: "Canchas y Reservas" },
    { id: "clientes", label: "Gestión de Clientes" },
    { id: "pedidos", label: "Pedidos y Cierre" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>TEJOGEST PRO</h1>
        <span>Canchas de Tejo Don Uriel</span>
      </div>

      <nav className="navbar-menu" aria-label="Navegación principal">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
            onClick={() => onSelectTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
