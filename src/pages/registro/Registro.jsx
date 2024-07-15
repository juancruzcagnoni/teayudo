import React, { useState } from "react";
import app from "../../js/config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import validator from "https://cdn.skypack.dev/validator";
import styles from "./Registro.module.css";

const Registro = ({ onVolverAtras, onIniciarSesion }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState(""); // Estado para el apellido
  const [profileImage, setProfileImage] = useState(null);
  const [userType, setUserType] = useState(""); // Estado para el tipo de usuario
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(email)) {
      setRegistrationError("El email no es válido.");
      return;
    }

    if (!userType) {
      setRegistrationError("Por favor, selecciona si eres Ayudante o Niño");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "usuarios", user.uid);
      await setDoc(userDocRef, {
        name,
        apellido, // Almacenar el apellido
        email,
        userType, // Almacenar el tipo de usuario
        role: "client",
      });

      if (profileImage) {
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, profileImage);
      }

      console.log("Usuario registrado:", user);

      setRegistrationSuccess(true);
      setRegistrationError("");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      let errorMessage = "";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "El mail ya está en uso.";
          break;
        case "auth/invalid-email":
          errorMessage = "El email no es válido.";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña debe ser de al menos 6 caracteres.";
          break;
        default:
          errorMessage = "Error al registrar el usuario, pruebe de nuevo.";
      }

      setRegistrationError(errorMessage);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="formContainer">
        <div className="topSection">
          <a onClick={onVolverAtras} className="backButton">
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
        </div>
        <h2 className="titleSection">Crea tu cuenta</h2>
        <div className="middleSection">
          <div className="camposContainer">
            <label>Nombre *</label>
            <input
              placeholder="Nombre"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              />
          </div>
          <div className="camposContainer">
            <label>Apellido *</label>
            <input
              placeholder="Apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              />
          </div>
          <div className="camposContainer">
            <label>Email *</label>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
          </div>
          <div className="camposContainer">
            <label>Contraseña *</label>
            <input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
          </div>
          <div className="camposContainer">
            <label>Tipo de Usuario *</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="profesional">Profesional</option>
              <option value="niño/a">Niño/a</option>
            </select>
          </div>
          {registrationError && <div className="error">{registrationError}</div>}
          {registrationSuccess && <div className="succes">Registro exitoso. ¡Bienvenido!</div>}
          <p className="redirect">
            ¿Ya tienes cuenta?{" "}
            <a href="#" onClick={onIniciarSesion}>
              Inicia sesión
            </a>
          </p>
        </div>

        <div className="bottomSection">
          <button type="submit" className={styles.registrar}>
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registro;
