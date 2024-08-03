import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EditarPerfil from "./pages/perfil/EditarPerfil";
import Login from "./pages/login/Login";
import Registro from "./pages/registro/Registro";
import Comunicar from "./pages/comunicar/Comunicar";
import Perfil from "./pages/perfil/Perfil";
import Meditacion from "./pages/meditacion/Meditacion";
import MeditacionDetalle from "./pages/meditacion/MeditacionDetalle";
import Navbar from "./components/nav/Nav";
import CrearInforme from "./pages/informes/CrearInformes";
import LeerInforme from "./pages/informes/LeerInformes";
import VerInforme from "./pages/informes/VerInforme";
import VerInformePaciente from "./pages/informes/VerInformePaciente";
import EditarInforme from "./pages/informes/EditarInforme";
import EditarInformePaciente from "./pages/informes/EditarInformesPaciente";
import InformesPaciente from "./pages/informes/InformesPaciente";
import app from "./js/config";
import "./App.css";
import { Oval } from "react-loader-spinner";
import Profesionales from "./pages/usuarios/Profesionales";
import Pacientes from "./pages/usuarios/Pacientes";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

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

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
      console.log('beforeinstallprompt event triggered');
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

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
        <Route path="/meditacion/:id" element={<MeditacionDetalle />} />
        <Route path="/perfil" element={user ? <Perfil deferredPrompt={deferredPrompt} showInstallButton={showInstallButton} /> : <Login />} />
        <Route path="/editar-perfil" element={user ? <EditarPerfil /> : <Login />} />
        <Route path="/crear-informe" element={user ? <CrearInforme /> : <Login />} />
        <Route path="/leer-informes" element={user ? <LeerInforme /> : <Login />} />
        <Route path="/ver-informe/:informeId" element={user ? <VerInforme /> : <Login />} />
        <Route path="/ver-informe-paciente/:informeId" element={user ? <VerInformePaciente /> : <Login />} />
        <Route path="/editar-informe/:informeId" element={<EditarInforme />} />
        <Route path="/editar-informe-paciente/:informeId" element={<EditarInformePaciente />} />
        <Route path="/profesionales" element={user ? <Profesionales /> : <Login />} />
        <Route path="/pacientes" element={user ? <Pacientes /> : <Login />} />
        <Route path="/informes/:email" element={<InformesPaciente />} />
      </Routes>
    </Router>
  );
};

export default App;
