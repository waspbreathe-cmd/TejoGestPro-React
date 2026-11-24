import { useState } from "react";
import Navbar from "./components/Navbar";
import CanchasBoard from "./components/CanchasBoard";
import ClientesModule from "./components/ClientesModule";
import PedidosPanel from "./components/PedidosPanel";
import "./App.css";

/**
 * Componente principal App (AppLayout)
 * Orquesta la navegación entre los módulos de TEJOGEST PRO
 * aplicando flujo unidireccional de datos y renderizado condicional.
 */
function App() {
  const [activeTab, setActiveTab] = useState("canchas");

  return (
    <div className="app-shell">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="main-content">
        {activeTab === "canchas" && <CanchasBoard />}
        {activeTab === "clientes" && <ClientesModule />}
        {activeTab === "pedidos" && <PedidosPanel />}
      </main>

      <footer className="app-footer">
        <p>TEJOGEST PRO — Canchas de Tejo Don Uriel | SENA ADSO Ficha 3336095</p>
      </footer>
    </div>
  );
}

export default App;
