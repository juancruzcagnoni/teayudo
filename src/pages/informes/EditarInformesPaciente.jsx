import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import app from "../../js/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import styles from "./Informes.module.css";
import ModalConfirmacion from "../../components/modal/Modal"; 

const EditarInformePaciente = () => {
  const { informeId } = useParams();
  const [informe, setInforme] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [personaEvaluada, setPersonaEvaluada] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [escuela, setEscuela] = useState("");
  const [grado, setGrado] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [fortalezas, setFortalezas] = useState("");
  const [desafios, setDesafios] = useState("");
  const [intervenciones, setIntervenciones] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInforme = async () => {
      const user = auth.currentUser;
      if (user) {
        const informeDocRef = doc(db, "informes", informeId);
        const docSnapshot = await getDoc(informeDocRef);
        if (docSnapshot.exists()) {
          const informeData = docSnapshot.data();
          setInforme(informeData);
          setTitulo(informeData.titulo);
          setFecha(informeData.fecha);
          setPersonaEvaluada(informeData.personaEvaluada);
          setDiagnostico(informeData.diagnostico);
          setEscuela(informeData.escuela);
          setGrado(informeData.grado);
          setObjetivos(informeData.objetivos);
          setFortalezas(informeData.fortalezas);
          setDesafios(informeData.desafios);
          setIntervenciones(informeData.intervenciones);
          setObservaciones(informeData.observaciones);
          setLoading(false);
        } else {
          console.error("Informe no encontrado");
          setLoading(false);
        }
      }
    };

    fetchInforme();
  }, [auth, db, informeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleBack = () => {
    navigate(`/ver-informe-paciente/${informeId}`);
  };

  const confirmCreateInforme = async () => {
    try {
      const informeDocRef = doc(db, "informes", informeId);
      await updateDoc(informeDocRef, {
        titulo,
        fecha,
        personaEvaluada,
        diagnostico,
        escuela,
        grado,
        objetivos,
        fortalezas,
        desafios,
        intervenciones,
        observaciones,
      });

      setSuccessMessage("Informe creado exitosamente");
      setError("");
      navigate(`/ver-informe-paciente/${informeId}`);
    } catch (error) {
      console.error("Error al actualizar el informe:", error);
      setError("Error al editar el informe. Inténtalo de nuevo más tarde.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

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

  if (!informe) {
    return <p>Informe no encontrado.</p>;
  }

  return (
    <div className="padding-page">
      <a onClick={handleBack} className="backButton">
        <FontAwesomeIcon icon={faArrowLeft} />
      </a>
      <div className={styles.editarInformeContainer}>
        <h2 className="titleSection">Editar informe</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className="camposContainer">
            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className={styles.camposFlex}>
            <div className="camposContainer" style={{ width: "60%" }}>
              <label>Persona Evaluada</label>
              <input
                type="text"
                value={personaEvaluada}
                onChange={(e) => setPersonaEvaluada(e.target.value)}
                required
              />
            </div>
            <div
              className="camposContainer"
              style={{ width: "40%", marginLeft: "0.5rem" }}
            >
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
            <label>Diagnóstico</label>
            <input
              type="text"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              required
            />
          </div>
          <div className={styles.camposFlex}>
            <div className="camposContainer" style={{ width: "60%" }}>
              <label>Escuela</label>
              <input
                type="text"
                value={escuela}
                onChange={(e) => setEscuela(e.target.value)}
                required
              />
            </div>
            <div
              className="camposContainer"
              style={{ width: "40%", marginLeft: "0.5rem" }}
            >
              <label>Grado/Año</label>
              <input
                type="text"
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="camposContainer">
            <label>Objetivos</label>
            <textarea
              value={objetivos}
              onChange={(e) => setObjetivos(e.target.value)}
              required
              style={{ height: "50px" }}
            ></textarea>
          </div>
          <div className="camposContainer">
            <label>Fortalezas en el Desempeño</label>
            <textarea
              value={fortalezas}
              onChange={(e) => setFortalezas(e.target.value)}
              required
              style={{ height: "50px" }}
            ></textarea>
          </div>
          <div className="camposContainer">
            <label>Desafíos en el Desempeño</label>
            <textarea
              value={desafios}
              onChange={(e) => setDesafios(e.target.value)}
              required
              style={{ height: "50px" }}
            ></textarea>
          </div>
          <div className="camposContainer">
            <label>Intervenciones</label>
            <textarea
              value={intervenciones}
              onChange={(e) => setIntervenciones(e.target.value)}
              required
              style={{ height: "50px" }}
            ></textarea>
          </div>
          <div className="camposContainer">
            <label>Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              required
            ></textarea>
          </div>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit" className={styles.editar}>
            Guardar cambios
          </button>
        </form>
      </div>
      {showModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro que deseas editar este informe?"
          onConfirm={confirmCreateInforme}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default EditarInformePaciente;
