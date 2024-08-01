import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import app from "../../js/config";
import styles from "./Pacientes.module.css";
import { Oval } from "react-loader-spinner";
import profileDefault from "../../assets/profile-default.jpg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import ModalSolic from "../../components/modal-solic/ModalSolic"; // Asumiendo que tienes un componente Modal
import Alert from "../../components/alert/Alert"; // Asegúrate de ajustar la ruta según sea necesario

const Pacientes = () => {
  const [requests, setRequests] = useState({ pending: [], accepted: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // Track the loading state for individual updates
  const [showModal, setShowModal] = useState(false); // Estado para controlar la ventana modal
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const userId = auth.currentUser.uid;

      // Fetch pending requests
      const pendingQuery = query(
        collection(db, "reportRequests"),
        where("professionalId", "==", userId),
        where("status", "==", "pending")
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingList = [];
      for (const docSnapshot of pendingSnapshot.docs) {
        const requestData = docSnapshot.data();
        const patientDocRef = doc(db, "usuarios", requestData.userId);
        const patientDocSnapshot = await getDoc(patientDocRef);
        if (patientDocSnapshot.exists()) {
          const patientData = patientDocSnapshot.data();
          pendingList.push({
            id: requestData.userId,
            ...patientData,
            requestId: docSnapshot.id,
            status: "pending",
          });
        }
      }

      // Fetch accepted requests
      const acceptedQuery = query(
        collection(db, "reportRequests"),
        where("professionalId", "==", userId),
        where("status", "==", "accepted")
      );
      const acceptedSnapshot = await getDocs(acceptedQuery);
      const acceptedList = [];
      for (const docSnapshot of acceptedSnapshot.docs) {
        const requestData = docSnapshot.data();
        const patientDocRef = doc(db, "usuarios", requestData.userId);
        const patientDocSnapshot = await getDoc(patientDocRef);
        if (patientDocSnapshot.exists()) {
          const patientData = patientDocSnapshot.data();
          acceptedList.push({
            id: requestData.userId,
            ...patientData,
            requestId: docSnapshot.id,
            status: "accepted",
          });
        }
      }

      setRequests({ pending: pendingList, accepted: acceptedList });
      setLoading(false);
    };

    fetchRequests();
  }, [db, auth]);

  const handleBack = () => {
    navigate("/perfil");
  };

  const handleUpdateRequest = async (requestId, status) => {
    setUpdating(requestId); // Set the loading state for the specific update
    try {
      const requestDocRef = doc(db, "reportRequests", requestId);
      await updateDoc(requestDocRef, { status });
      setAlertMessage(`Solicitud ${status === "accepted" ? "aceptada" : "denegada"} con éxito`);
      setAlertVisible(true); // Show the alert

      setUpdating(null); // Clear the loading state for the specific update

      // Refresh the list of requests
      const userId = auth.currentUser.uid;

      // Fetch pending requests
      const pendingQuery = query(
        collection(db, "reportRequests"),
        where("professionalId", "==", userId),
        where("status", "==", "pending")
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingList = [];
      for (const docSnapshot of pendingSnapshot.docs) {
        const requestData = docSnapshot.data();
        const patientDocRef = doc(db, "usuarios", requestData.userId);
        const patientDocSnapshot = await getDoc(patientDocRef);
        if (patientDocSnapshot.exists()) {
          const patientData = patientDocSnapshot.data();
          pendingList.push({
            id: requestData.userId,
            ...patientData,
            requestId: docSnapshot.id,
            status: "pending",
          });
        }
      }

      // Fetch accepted requests
      const acceptedQuery = query(
        collection(db, "reportRequests"),
        where("professionalId", "==", userId),
        where("status", "==", "accepted")
      );
      const acceptedSnapshot = await getDocs(acceptedQuery);
      const acceptedList = [];
      for (const docSnapshot of acceptedSnapshot.docs) {
        const requestData = docSnapshot.data();
        const patientDocRef = doc(db, "usuarios", requestData.userId);
        const patientDocSnapshot = await getDoc(patientDocRef);
        if (patientDocSnapshot.exists()) {
          const patientData = patientDocSnapshot.data();
          acceptedList.push({
            id: requestData.userId,
            ...patientData,
            requestId: docSnapshot.id,
            status: "accepted",
          });
        }
      }

      setRequests({ pending: pendingList, accepted: acceptedList });
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      setAlertMessage("Error al actualizar la solicitud");
      setAlertVisible(true); // Show the alert
      setUpdating(null); // Clear the loading state in case of error
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertVisible]);

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
      <div className={styles.header}>
        <h1 className="titleSection">Pacientes</h1>
        <div className={styles.bellIconContainer} onClick={toggleModal}>
          <FontAwesomeIcon icon={faBell} className={styles.campana} />
          {requests.pending.length > 0 && (
            <div className={styles.notificationBadge}>
              {requests.pending.length}
            </div>
          )}
        </div>
      </div>

      <section>
        {requests.accepted.length > 0 ? (
          requests.accepted.map((patient, index) => (
            <div key={index} className={styles.usuario}>
              <div className={styles.usuarioImgContainer}>
                <img
                  src={patient.photoURL || profileDefault}
                  alt="Foto de perfil"
                  className={styles.usuarioImg}
                />
              </div>
              <div className={styles.usuarioInfoAccepted}>
                <div>
                  <h3>{`${patient.name} ${patient.apellido}`}</h3>
                  <p>{patient.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay pacientes con solicitudes aceptadas.</p>
        )}
      </section>
      {showModal && (
        <ModalSolic onClose={toggleModal}>
          <h2>Solicitudes</h2>
          <ul className={styles.listaPending}>
            {requests.pending.map((patient, index) => (
              <li key={index} className={styles.modalItem}>
                <div className={styles.usuarioImgContainer}>
                  <img
                    src={patient.photoURL || profileDefault}
                    alt="Foto de perfil"
                    className={styles.usuarioImg}
                  />
                </div>
                <div className={styles.modalItemInfo}>
                  <h3>{`${patient.name} ${patient.apellido}`}</h3>
                  <p>{patient.email}</p>
                  <div className={styles.modalButtonContainer}>
                    <a
                      onClick={() =>
                        handleUpdateRequest(patient.requestId, "accepted")
                      }
                      disabled={updating === patient.requestId}
                      className={styles.modalAcceptButton}
                    >
                      Aceptar
                    </a>
                    <a
                      onClick={() =>
                        handleUpdateRequest(patient.requestId, "denied")
                      }
                      disabled={updating === patient.requestId}
                      className={styles.modalDenyButton}
                    >
                      Denegar
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ModalSolic>
      )}
      {alertVisible && (
        <Alert
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </div>
  );
};

export default Pacientes;
