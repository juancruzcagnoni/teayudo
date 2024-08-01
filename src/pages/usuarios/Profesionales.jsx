import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
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
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";

const Profesionales = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null); // Track the loading state for individual requests
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

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

    fetchProfessionals();
  }, [db]);

  const handleBack = () => {
    navigate("/perfil");
  };

  const handleRequestReport = async (professionalId) => {
    setRequesting(professionalId); // Set the loading state for the specific request
    try {
      const requestData = {
        professionalId: professionalId,
        userId: auth.currentUser.uid, // Add the ID of the user sending the request
        timestamp: serverTimestamp(),
        status: 'pending',
      };
      await addDoc(collection(db, "reportRequests"), requestData);
      alert("Solicitud de informe enviada con éxito");
    } catch (error) {
      console.error("Error al enviar la solicitud de informe:", error);
      alert("Error al enviar la solicitud de informe");
    }
    setRequesting(null); // Clear the loading state for the specific request
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
      <h1 className="titleSection">Profesionales</h1>
      {professionals.map((professional, index) => (
        <div key={index} className={styles.usuario}>
          <div className={styles.usuarioImgContainer}>
            <img
              src={professional.photoURL || profileDefault}
              alt="Foto de perfil"
              className={styles.usuarioImg}
            />
          </div>
          <div className={styles.usuarioInfo}>
            <h2>{`${professional.name} ${professional.apellido}`}</h2>
            <p>{professional.email}</p>
            <button
              onClick={() => handleRequestReport(professional.id)}
              disabled={requesting === professional.id}
              className={styles.requestButton}
            >
              {requesting === professional.id ? 'Solicitando...' : 'Solicitar Informe'}
              <FontAwesomeIcon icon={faFileAlt} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profesionales;
