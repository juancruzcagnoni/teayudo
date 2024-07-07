import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import app from "../../js/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import AsyncSelect from 'react-select/async';
import styles from "./Informes.module.css";
import ModalConfirmacion from "../../components/modal/Modal";

const CrearInforme = () => {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [personaEvaluada, setPersonaEvaluada] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para la ventana modal de confirmación
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/perfil");
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!titulo || !subtitulo || !fecha || !descripcion || !personaEvaluada) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "informes"), {
        titulo,
        subtitulo,
        fecha,
        descripcion,
        personaEvaluada: personaEvaluada.value, // Guarda el email seleccionado
        userId: user.uid,
      });

      setSuccessMessage("Informe creado exitosamente");
      setError("");
      setTimeout(() => {
        navigate("/perfil");
      }, 3000); // Redirigir a perfil después de 3 segundos
    } catch (error) {
      console.error("Error al crear informe:", error);
      setError("Error al crear el informe. Inténtalo de nuevo más tarde.");
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmCreateInforme = () => {
    handleSubmit();
    closeModal();
  };

  const loadOptions = async (inputValue) => {
    const q = query(collection(db, "usuarios"), where("email", ">=", inputValue), where("email", "<=", inputValue + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const options = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      options.push({ label: data.email, value: data.email });
    });
    return options;
  };

  return (
    <div className="padding-page">
      <div className={styles.crearInformeContainer}>
        <a onClick={handleBack} className="backButton">
          <FontAwesomeIcon icon={faArrowLeft} />
        </a>
        <h2 className="titleSection">Crear Informe</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            openModal();
          }}
          className={styles.formContainer}
        >
          <div className="camposContainer">
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="camposContainer">
            <label>Subtítulo</label>
            <input
              type="text"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              required
            />
          </div>
          <div className={styles.camposFlex}>
            <div className="camposContainer">
              <label>Persona Evaluada</label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                onChange={setPersonaEvaluada}
                defaultOptions
                value={personaEvaluada}
                placeholder="Buscar por email"
                required
              />
            </div>
            <div className="camposContainer">
              <label>Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="camposContainer">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit" className={styles.crear}>
            Crear Informe
          </button>
        </form>
      </div>

      {showModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro que deseas crear este informe?"
          onConfirm={confirmCreateInforme}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default CrearInforme;
