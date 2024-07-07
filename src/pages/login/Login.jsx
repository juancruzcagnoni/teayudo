import React, { useState } from "react";
import InicioSesion from "../iniciosesion/InicioSesion";
import Registro from "../registro/Registro";
import logo from "../../assets/logo.svg"; 
import styles from "./Login.module.css";

const Login = () => {
  const [mostrarInicioSesion, setMostrarInicioSesion] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const handleClickIniciarSesion = () => {
    setMostrarInicioSesion(true);
    setMostrarRegistro(false);
  };

  const handleClickRegistrarse = () => {
    setMostrarRegistro(true);
    setMostrarInicioSesion(false);
  };

  const handleVolverAtras = () => {
    setMostrarInicioSesion(false);
    setMostrarRegistro(false);
  };

  return (
    <div className="">
      {mostrarInicioSesion ? (
        <InicioSesion onVolverAtras={handleVolverAtras} onRegistrarse={handleClickRegistrarse} />
      ) : mostrarRegistro ? (
        <Registro onVolverAtras={handleVolverAtras} onIniciarSesion={handleClickIniciarSesion} />
      ) : (
        <div className={styles.loginContent}>
          <img src={logo} alt="Logo" className={styles.loginLogo} />
          <div className={styles.bottom}>
            <div className={styles.loginText}>
              <h1>Bienvenido a <span className={styles.spanTitle}>TEAYUDO</span></h1>
              <p>
                Sumate con nosotros para impactar en la vida de niños con 
                <span className={styles.spanText}> Trastornos en el Espectro Autista</span>
              </p>
            </div>
            <div className={styles.loginButtons}>
              <button onClick={handleClickIniciarSesion}>Iniciar Sesión</button>
              <button onClick={handleClickRegistrarse} className={styles.registro}>Registrarse</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
