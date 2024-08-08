import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
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
import Profesionales from "./pages/usuarios/Profesionales";
import Pacientes from "./pages/usuarios/Pacientes";
import ProtectedRoute from "./components/ProtectedRoute";
import app from "./js/config";
import "./App.css";
import { Oval } from "react-loader-spinner";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const uid = authUser.uid;

        try {
          const userDoc = doc(db, "usuarios", uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userType = userData.userType;

            setUser({ ...authUser, userType });
          } else {
            console.log("No such document!");
            setUser(null);
          }
        } catch (error) {
          console.error("Error getting document:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
      console.log("beforeinstallprompt event triggered");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
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
      {user && <Navbar />}
      <Routes>
        {/* Rutas para todos */}
        <Route path="/" element={user ? <Comunicar /> : <Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/comunicar" element={user ? <Comunicar /> : <Login />} />
        <Route path="/meditacion" element={user ? <Meditacion /> : <Login />} />
        <Route path="/meditacion/:id" element={<MeditacionDetalle />} />
        <Route
          path="/perfil"
          element={
            <Perfil
              deferredPrompt={deferredPrompt}
              showInstallButton={showInstallButton}
            />
          }
        />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        {/* Rutas para profesionales */}
        <Route
          path="/crear-informe"
          element={
            <ProtectedRoute user={user} allowedRoles={["profesional"]}>
              <CrearInforme />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ver-informe-paciente/:informeId"
          element={
            <ProtectedRoute user={user} allowedRoles={["profesional"]}>
              <VerInformePaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-informe/:informeId"
          element={
            <ProtectedRoute user={user} allowedRoles={["profesional"]}>
              <EditarInforme />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-informe-paciente/:informeId"
          element={
            <ProtectedRoute user={user} allowedRoles={["profesional"]}>
              <EditarInformePaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute user={user} allowedRoles={["profesional"]}>
              <Pacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/informes/:email"
          element={
            <ProtectedRoute user={user} allowedRoles={["profesional"]}>
              <InformesPaciente />
            </ProtectedRoute>
          }
        />

        {/* Rutas para pacientes */}
        <Route
          path="/profesionales"
          element={
            <ProtectedRoute user={user} allowedRoles={["niño/a"]}>
              <Profesionales />
            </ProtectedRoute>
          }
        />

        {/* Rutas para pacientes y profesionales */}
        <Route
          path="/leer-informes"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["niño/a", "profesional"]}
            >
              <LeerInforme />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ver-informe/:informeId"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["niño/a", "profesional"]}
            >
              <VerInforme />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acceso-denegado"
          element={
            <div className="acceso-denegado">
              <p>Acceso denegado</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
