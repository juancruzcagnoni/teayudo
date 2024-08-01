import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc
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
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";

const Pacientes = () => {
  const [requests, setRequests] = useState({ pending: [], accepted: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // Track the loading state for individual updates
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
          pendingList.push({ id: requestData.userId, ...patientData, requestId: docSnapshot.id });
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
          acceptedList.push({ id: requestData.userId, ...patientData, requestId: docSnapshot.id });
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
      alert(`Solicitud ${status === 'accepted' ? 'aceptada' : 'denegada'} con éxito`);
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
          pendingList.push({ id: requestData.userId, ...patientData, requestId: docSnapshot.id });
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
          acceptedList.push({ id: requestData.userId, ...patientData, requestId: docSnapshot.id });
        }
      }

      setRequests({ pending: pendingList, accepted: acceptedList });
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      alert("Error al actualizar la solicitud");
      setUpdating(null); // Clear the loading state in case of error
    }
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
      <h1 className="titleSection">Pacientes</h1>
      <section>
        <h2>Solicitudes Pendientes</h2>
        {requests.pending.length > 0 ? (
          requests.pending.map((patient, index) => (
            <div key={index} className={styles.usuario}>
              <div className={styles.usuarioImgContainer}>
                <img
                  src={patient.photoURL || profileDefault}
                  alt="Foto de perfil"
                  className={styles.usuarioImg}
                />
              </div>
              <div className={styles.usuarioInfo}>
                <h2>{`${patient.name} ${patient.apellido}`}</h2>
                <p>{patient.email}</p>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => handleUpdateRequest(patient.requestId, 'accepted')}
                    disabled={updating === patient.requestId}
                    className={styles.acceptButton}
                  >
                    {updating === patient.requestId ? 'Aceptando...' : 'Aceptar'}
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(patient.requestId, 'denied')}
                    disabled={updating === patient.requestId}
                    className={styles.denyButton}
                  >
                    {updating === patient.requestId ? 'Denegando...' : 'Denegar'}
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay pacientes con solicitudes pendientes.</p>
        )}
      </section>
      <section>
        <h2>Solicitudes Aceptadas</h2>
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
              <div className={styles.usuarioInfo}>
                <h2>{`${patient.name} ${patient.apellido}`}</h2>
                <p>{patient.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay pacientes con solicitudes aceptadas.</p>
        )}
      </section>
    </div>
  );
};

export default Pacientes;
