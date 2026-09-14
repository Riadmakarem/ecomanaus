import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Mapa } from "./pages/Mapa";
import { Denunciar } from "./pages/Denunciar";
import { Denuncias } from "./pages/Denuncias";
import { EcoTroca } from "./pages/EcoTroca";
import { Campanhas } from "./pages/Campanhas";
import { Bairros } from "./pages/Bairros";
import { Escolas, EscolaDetalhe } from "./pages/Escolas";
import { Empresas } from "./pages/Empresas";
import { Perfil } from "./pages/Perfil";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/denunciar" element={<Denunciar />} />
          <Route path="/denuncias" element={<Denuncias />} />
          <Route path="/ecotroca" element={<EcoTroca />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/bairros" element={<Bairros />} />
          <Route path="/escolas" element={<Escolas />} />
          <Route path="/escola/:id" element={<EscolaDetalhe />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}