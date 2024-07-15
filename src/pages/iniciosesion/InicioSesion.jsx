import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import validator from "https://cdn.skypack.dev/validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import app from "../../js/config";
import styles from "./InicioSesion.module.css";

const InicioSesion = ({ onVolverAtras, onRegistrarse }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setLoginError("");
    setSuccessMessage("");

    if (!validator.isEmail(email)) {
      setLoginError("El email no es valido");
      return;
    }

    if (!validator.isLength(password, { min: 6 })) {
      setLoginError("La contraseña debe ser de al menos 6 caracteres");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Inicio de sesión exitoso:", user);

      const userDocRef = doc(db, "usuarios", user.uid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userRole = userData.role;

        if (userRole === "admin") {
        } else if (userRole === "client") {
        }
      }

      setLoginError("");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      let errorMessage = "";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage =
            "Usuario no encontrado. Verifique su email y contraseña.";
          break;
        case "auth/invalid-password":
          errorMessage = "Contraseña incorrecta. Verifique su contraseña.";
          break;
        default:
          errorMessage = "Error al iniciar sesión. Revise sus credenciales.";
      }

      setLoginError(errorMessage);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="formContainer">
        <div>
          <div className="topSection">
            <a onClick={onVolverAtras} className="backButton">
              <FontAwesomeIcon icon={faArrowLeft} />
            </a>
          </div>
          <h2 className="titleSection">¡Qué bueno verte otra vez!</h2>
        </div>
        <div className="middleSection">
          <div className="camposContainer">
            <label>Email</label>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
          </div>
          <div className="camposContainer">
            <label>Contraseña</label>
            <input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && <div className="error">{loginError}</div>}
          {successMessage && <div className="succes">{successMessage}</div>}
          <p className="redirect">
            ¿No tenes cuenta?{" "}
            <a href="#" onClick={onRegistrarse}>
              Registrate.
            </a>
          </p>
        </div>

        <div className="bottomSection">
          <button className={styles.ingresar} type="submit">
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default InicioSesion;
