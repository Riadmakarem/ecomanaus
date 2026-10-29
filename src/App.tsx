import { HashRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import { Login } from "./pages/Login";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-eco-200 border-t-eco-600" />
      </div>
    );
  }

  if (!user) {
    // Guarda a rota pretendida para voltar após o login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* Rotas que exigem login */}
          <Route
            path="/mapa"
            element={
              <PrivateRoute>
                <Mapa />
              </PrivateRoute>
            }
          />
          <Route
            path="/denunciar"
            element={
              <PrivateRoute>
                <Denunciar />
              </PrivateRoute>
            }
          />
          <Route
            path="/denuncias"
            element={
              <PrivateRoute>
                <Denuncias />
              </PrivateRoute>
            }
          />
          <Route
            path="/ecotroca"
            element={
              <PrivateRoute>
                <EcoTroca />
              </PrivateRoute>
            }
          />
          <Route
            path="/campanhas"
            element={
              <PrivateRoute>
                <Campanhas />
              </PrivateRoute>
            }
          />
          <Route
            path="/bairros"
            element={
              <PrivateRoute>
                <Bairros />
              </PrivateRoute>
            }
          />
          <Route
            path="/escolas"
            element={
              <PrivateRoute>
                <Escolas />
              </PrivateRoute>
            }
          />
          <Route
            path="/escola/:id"
            element={
              <PrivateRoute>
                <EscolaDetalhe />
              </PrivateRoute>
            }
          />
          <Route
            path="/empresas"
            element={
              <PrivateRoute>
                <Empresas />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
