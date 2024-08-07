import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import app from "../../js/config";
import { Oval } from "react-loader-spinner";
import styles from "./Informes.module.css";
import ModalConfirmacion from "../../components/modal/Modal";

const VerInforme = () => {
  const { informeId } = useParams();
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const [creadorInforme, setCreadorInforme] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleBack = () => {
    navigate(`/informes/${informe?.personaEvaluada}`);
  };

  useEffect(() => {
    const fetchInforme = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserType(userData.userType);
        }

        const informeDocRef = doc(db, "informes", informeId);
        const docSnapshot = await getDoc(informeDocRef);
        if (docSnapshot.exists()) {
          const informeData = docSnapshot.data();
          setInforme(informeData);

          const creadorDocRef = doc(db, "usuarios", informeData.userId);
          const creadorDocSnapshot = await getDoc(creadorDocRef);
          if (creadorDocSnapshot.exists()) {
            const creadorData = creadorDocSnapshot.data();
            setCreadorInforme(`${creadorData.name} ${creadorData.apellido}`);
          }

          setLoading(false);
        } else {
          console.error("Informe no encontrado");
          setLoading(false);
        }
      }
    };

    fetchInforme();
  }, [auth, db, informeId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(informe.titulo, 10, 20);
  
    const tableRows = [
      ["Fecha", new Date(informe.fecha).toLocaleDateString()],
      ["Persona evaluada", informe.personaEvaluada],
      ["Diagnóstico", informe.diagnostico],
      ["Escuela", informe.escuela],
      ["Grado/Año", informe.grado],
      ["Objetivos", informe.objetivos],
      ["Fortalezas en el desempeño", informe.fortalezas],
      ["Desafíos en el desempeño", informe.desafios],
      ["Intervenciones", informe.intervenciones],
      ["Observaciones", informe.observaciones],
    ];
  
    doc.autoTable({
      head: [["Campo", "Valor"]],
      body: tableRows,
      startY: 30,
    });
  
    doc.save(`${informe.titulo}.pdf`);
  };  

  const handleDeleteInforme = async () => {
    try {
      await deleteDoc(doc(db, "informes", informeId));
      navigate("/leer-informes");
    } catch (error) {
      console.error("Error al eliminar el informe:", error);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const openDownloadModal = () => {
    setShowDownloadModal(true);
  };

  const closeDownloadModal = () => {
    setShowDownloadModal(false);
  };

  const confirmDownloadPDF = () => {
    handleDownloadPDF();
    closeDownloadModal();
  };

  const handleEditInforme = () => {
    navigate(`/editar-informe-paciente/${informeId}`);
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

  return (
    <div className="padding-page">
      <a onClick={handleBack} className="backButton">
        <FontAwesomeIcon icon={faArrowLeft} />
      </a>
      <div className={styles.container}>
        <h2 className="titleSection">{informe.titulo}</h2>
        <div className={styles.verInformeContainer}>
        <table className={styles.informeTable}>
          <tbody>
            <tr>
              <td className={styles.tableHeaderTitulo}>{informe.titulo}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Fecha</td>
              <td>{new Date(informe.fecha).toLocaleDateString()}</td>
            </tr>
            {userType === "niño/a" && (
              <tr className={styles.columnInforme}>
                <td className={styles.tableHeader}>Creado por</td>
                <td>{creadorInforme}</td>
              </tr>
            )}
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Niño/a</td>
              <td>{informe.personaEvaluada}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Diagnóstico</td>
              <td>{informe.diagnostico}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Escuela</td>
              <td>{informe.escuela}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Grado/Año</td>
              <td>{informe.grado}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Objetivos</td>
              <td>{informe.objetivos}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Fortalezas en el desempeño</td>
              <td>{informe.fortalezas}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Desafíos en el desempeño</td>
              <td>{informe.desafios}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Intervenciones</td>
              <td>{informe.intervenciones}</td>
            </tr>
            <tr className={styles.columnInforme}>
              <td className={styles.tableHeader}>Observaciones</td>
              <td>{informe.observaciones}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.informeHeader}>
          <div className={styles.buttonsContainer}>
            <button
              onClick={openDownloadModal}
              className={styles.downloadButton}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
            {userType !== "niño/a" && (
              <>
                <button
                  onClick={handleEditInforme}
                  className={styles.editButton}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={openDeleteModal}
                  className={styles.deleteButton}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
        {showDeleteModal && (
          <ModalConfirmacion
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            message="¿Estás seguro de que deseas eliminar este informe?"
          />
        )}
        {showDownloadModal && (
          <ModalConfirmacion
            isOpen={showDownloadModal}
            onClose={() => setShowDownloadModal(false)}
            message="Informe descargado exitosamente."
          />
        )}
      </div>
    </div>
  );
};

export default VerInforme;
