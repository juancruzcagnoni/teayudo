import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../js/config";
import { Oval } from "react-loader-spinner";
import styles from "./Meditacion.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ModalInfo from "../../components/modal-info/ModalInfo";
import MeditacionImagen from "../../assets/meditation-svgrepo-com.svg";

const Meditacion = () => {
  const [meditaciones, setMeditaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duraciones, setDuraciones] = useState({});
  const [showModal, setShowModal] = useState(false);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchMeditaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "meditaciones"));
        const meditacionesData = querySnapshot.docs.map((doc) => doc.data());
        setMeditaciones(meditacionesData);
        setLoading(false);
        calculateDurations(meditacionesData);
      } catch (error) {
        console.error("Error al obtener las meditaciones:", error);
        setLoading(false);
      }
    };

    fetchMeditaciones();
  }, [db]);

  const calculateDurations = (meditacionesData) => {
    meditacionesData.forEach((meditacion, index) => {
      const audio = new Audio(meditacion.sonido);
      audio.addEventListener("loadedmetadata", () => {
        setDuraciones((prevDuraciones) => ({
          ...prevDuraciones,
          [index]:
            Math.floor(audio.duration / 60) +
            ":" +
            ("0" + Math.floor(audio.duration % 60)).slice(-2), // Convertir a minutos y segundos
        }));
      });
    });
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
    <>
      <button onClick={openModal} className="infoButton">
        <FontAwesomeIcon icon={faInfoCircle} size="2x" />
      </button>
      <ModalInfo
        show={showModal}
        onClose={closeModal}
        content="Esta es la sección de meditación, donde podes relajarte con sonidos relajantes."
      />
      <div className={styles.meditacionHeader}>
        <div>
          <h1>Meditación</h1>
          <p>Buen momento para relajarnos. Elegí la que más te guste.</p>
        </div>
        <div className={styles.meditacionImagenContainer}>
          <img src={MeditacionImagen} alt="" />
        </div>
      </div>
      <div className="padding-page">
        <div className={styles.container}>
          <div>
            {meditaciones.map((meditacion, index) => (
              <div
                key={index}
                className={styles.meditacionItem}
                onClick={() => navigate(`/meditacion/${index}`)}
              >
                <div className={styles.meditacionItemLeft}>
                  <div>
                    <img
                      src={meditacion.imagen}
                      alt={meditacion.titulo}
                      className={styles.meditacionImagen}
                    />
                  </div>
                  <div className={styles.meditacionItemText}>
                    <p className={styles.meditacionTitulo}>
                      {meditacion.titulo}
                    </p>
                  </div>
                  <div className={styles.duracionContainer}>
                    <p className={styles.duracion}>{duraciones[index]} min</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Meditacion;
