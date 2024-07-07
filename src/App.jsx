import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EditarPerfil from "./pages/perfil/EditarPerfil";
import Login from "./pages/login/Login";
import Registro from "./pages/registro/Registro";
import Comunicar from "./pages/comunicar/Comunicar";
import Perfil from "./pages/perfil/Perfil";
import Meditacion from "./pages/meditacion/Meditacion";
import Navbar from "./components/nav/Nav";
import CrearInforme from "./pages/informes/CrearInformes";
import LeerInforme from "./pages/informes/LeerInformes";
import VerInforme from "./pages/informes/VerInforme";
import EditarInforme from "./pages/informes/EditarInforme";
import app from "./js/config";
import "./App.css";
import { Oval } from "react-loader-spinner";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="loaderContainer">
        <Oval
          height={80}
          width={80}
          color="#912C8C"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#F5B60F"
          strokeWidth={5}
          strokeWidthSecondary={5}
        />
      </div>
    );
  }

  return (
    <Router>
      {user && (
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/comunicar" element={<Navbar />} />
          <Route path="/meditacion" element={<Navbar />} />
          <Route path="/perfil" element={<Navbar />} />
        </Routes>
      )}
      <Routes>
        <Route path="/" element={user ? <Comunicar /> : <Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/comunicar" element={user ? <Comunicar /> : <Login />} />
        <Route path="/meditacion" element={user ? <Meditacion /> : <Login />} />
        <Route path="/perfil" element={user ? <Perfil /> : <Login />} />
        <Route
          path="/editar-perfil"
          element={user ? <EditarPerfil /> : <Login />}
        />
        <Route
          path="/crear-informe"
          element={user ? <CrearInforme /> : <Login />}
        />
        <Route
          path="/leer-informes"
          element={user ? <LeerInforme /> : <Login />}
        />
        <Route
          path="/ver-informe/:informeId"
          element={user ? <VerInforme /> : <Login />}
        />
        <Route path="/editar-informe/:informeId" element={<EditarInforme />} />
      </Routes>
    </Router>
  );
};

export default App;
