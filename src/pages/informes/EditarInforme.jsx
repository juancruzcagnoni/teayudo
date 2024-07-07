import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import app from "../../js/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import styles from "./Informes.module.css";

const EditarInforme = () => {
  const { informeId } = useParams();
  const [informe, setInforme] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [personaEvaluada, setPersonaEvaluada] = useState("");
  const [loading, setLoading] = useState(true);
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
          setDescripcion(informeData.descripcion);
          setPersonaEvaluada(informeData.personaEvaluada);
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
    try {
      const informeDocRef = doc(db, "informes", informeId);
      await updateDoc(informeDocRef, {
        titulo,
        fecha,
        descripcion,
        personaEvaluada,
      });
      navigate(`/ver-informe/${informeId}`);
    } catch (error) {
      console.error("Error al actualizar el informe:", error);
    }
  };

  const handleBack = () => {
    navigate(`/ver-informe/${informeId}`);
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
            <div className="camposContainer">
              <label>Persona Evaluada</label>
              <input
                type="text"
                value={personaEvaluada}
                onChange={(e) => setPersonaEvaluada(e.target.value)}
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
          <button type="submit" className={styles.editar}>
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarInforme;
