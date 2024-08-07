import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import app from "../../js/config";
import styles from "./Profesionales.module.css";
import { Oval } from "react-loader-spinner";
import profileDefault from "../../assets/profile-default.jpg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import ModalConfirmacion from "../../components/modal/Modal";
import Alert from "../../components/alert/Alert";
import ModalInfo from "../../components/modal-info/ModalInfo";
import Logo from "../../assets/logo192x192.png";

const Profesionales = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showModalInfo, setShowModalInfo] = useState(false);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const openModal = () => {
    setShowModalInfo(true);
  };

  const closeModal = () => {
    setShowModalInfo(false);
  };

  useEffect(() => {
    const fetchProfessionals = async () => {
      const q = query(
        collection(db, "usuarios"),
        where("userType", "==", "profesional")
      );
      const querySnapshot = await getDocs(q);
      const professionalList = [];
      querySnapshot.forEach((doc) => {
        professionalList.push({ id: doc.id, ...doc.data() });
      });
      setProfessionals(professionalList);
      setLoading(false);
    };

    const fetchPendingRequests = async () => {
      const userId = auth.currentUser.uid;
      const q = query(
        collection(db, "reportRequests"),
        where("userId", "==", userId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const requestsList = [];
      querySnapshot.forEach((doc) => {
        requestsList.push(doc.data().professionalId);
      });
      setPendingRequests(requestsList);
    };

    const fetchAcceptedRequests = async () => {
      const userId = auth.currentUser.uid;
      const q = query(
        collection(db, "reportRequests"),
        where("userId", "==", userId),
        where("status", "==", "accepted")
      );
      const querySnapshot = await getDocs(q);
      const requestsList = [];
      querySnapshot.forEach((doc) => {
        requestsList.push(doc.data().professionalId);
      });
      setAcceptedRequests(requestsList);
    };

    fetchProfessionals();
    fetchPendingRequests();
    fetchAcceptedRequests();
  }, [db, auth]);

  const handleBack = () => {
    navigate("/perfil");
  };

  const handleRequestReport = (professionalId) => {
    const hasPendingRequest = pendingRequests.includes(professionalId);
    const hasAcceptedRequest = acceptedRequests.includes(professionalId);
    if (hasPendingRequest) {
      setAlertMessage("La solicitud está pendiente");
      setAlertVisible(true);
    } else if (hasAcceptedRequest) {
      setAlertMessage("El profesional ya puede crear informes");
      setAlertVisible(true);
    } else {
      setSelectedProfessional(professionalId);
      setShowConfirmModal(true);
    }
  };

  const confirmRequest = async () => {
    setRequesting(selectedProfessional);
    try {
      const requestData = {
        professionalId: selectedProfessional,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        status: "pending",
      };
      await addDoc(collection(db, "reportRequests"), requestData);
      setAlertMessage("Solicitud de informe enviada con éxito");
      setAlertVisible(true);
    } catch (error) {
      console.error("Error al enviar la solicitud de informe:", error);
      setAlertMessage("Error al enviar la solicitud de informe");
      setAlertVisible(true);
    }
    setRequesting(null);
    setShowConfirmModal(false);
  };

  const cancelRequest = () => {
    setShowConfirmModal(false);
    setSelectedProfessional(null);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertVisible]);

  const filteredProfessionals = professionals
    .filter((professional) =>
      filterType ? professional.profession === filterType : true
    )
    .filter(
      (professional) =>
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    <>
      <div className="padding-page">
        <a onClick={openModal} className="infoButton">
          <img src={Logo} alt="" srcset="" />
        </a>
        <ModalInfo
          show={showModalInfo}
          onClose={closeModal}
          content="Esta es la sección en donde podes ver a todos los profesionales de la aplicación y podes enviarles solicitudes de informes."
        />
        <a onClick={handleBack} className="backButton">
          <FontAwesomeIcon icon={faArrowLeft} />
        </a>
        <div className={styles.container}>
          <h1 className="titleSection">Profesionales</h1>
          <div className={styles.filtersContainer}>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Seleccionar profesión...</option>
              <option value="profesor">Profesor</option>
              <option value="psicologo">Psicólogo</option>
              <option value="terapeuta">Terapeuta</option>
              <option value="psicopedagogo">Psicopedagogo</option>
              <option value="pediatra">Pediatra</option>
              <option value="pedagogo">Pedagogo</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          {filteredProfessionals.map((professional, index) => (
            <div key={index} className={styles.usuario}>
              <div className={styles.profesionalLeft}>
                <div className={styles.usuarioImgContainer}>
                  <img
                    src={professional.photoURL || profileDefault}
                    alt="Foto de perfil"
                    className={styles.usuarioImg}
                  />
                </div>
                <div className={styles.usuarioInfo}>
                  <h2>{`${professional.name} ${professional.apellido}`}</h2>
                  <p className="capitalized">{professional.profession}</p>
                </div>
              </div>
              <div className={styles.informeButton}>
                <a
                  onClick={() => handleRequestReport(professional.id)}
                  disabled={requesting === professional.id}
                  className={styles.requestButton}
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showConfirmModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que querés enviar una solicitud de informe a este profesional?"
          onConfirm={confirmRequest}
          onCancel={cancelRequest}
        />
      )}
      {alertVisible && <Alert message={alertMessage} onClose={closeAlert} />}
    </>
  );
};

export default Profesionales;
