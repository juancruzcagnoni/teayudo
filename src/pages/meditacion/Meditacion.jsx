import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../js/config";
import { Oval } from "react-loader-spinner";
import styles from "./Meditacion.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ModalInfo from "../../components/modal-info/ModalInfo";
import TextoAnimado from "../../components/texto-meditacion/TextoAnimado"; // Importar el componente
import MeditacionImagen from "../../assets/meditation-svgrepo-com.svg";

const Meditacion = () => {
  const [meditaciones, setMeditaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTextoAnimado, setShowTextoAnimado] = useState(false); // Estado para mostrar el texto animado

  const db = getFirestore(app);

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
      } catch (error) {
        console.error("Error al obtener las meditaciones:", error);
        setLoading(false);
      }
    };

    fetchMeditaciones();
  }, [db]);

  const handleButtonClick = (sonidoUrl, index) => {
    if (currentAudio && currentAudioIndex === index) {
      if (isPlaying) {
        currentAudio.pause();
        setShowTextoAnimado(false); // Ocultar texto animado al pausar
      } else {
        currentAudio.play();
        setShowTextoAnimado(true); // Mostrar texto animado al reproducir
      }
      setIsPlaying(!isPlaying);
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }
      const audio = new Audio(sonidoUrl);
      setCurrentAudio(audio);
      setCurrentAudioIndex(index);
      audio.play();
      setIsPlaying(true);
      setShowTextoAnimado(true); // Mostrar texto animado al comenzar la reproducción
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
    <>
      <button onClick={openModal} className="infoButton">
        <FontAwesomeIcon icon={faInfoCircle} size="2x" />
      </button>
      <ModalInfo
        show={showModal}
        onClose={closeModal}
        content="Esta es la sección de meditación, donde puedes relajarte con sonidos relajantes."
      />
      {/* <TextoAnimado show={showTextoAnimado} />{" "} */}
      {/* Mostrar el componente TextoAnimado */}
      <div className={styles.meditacionHeader}>
        <div>
          <h1>Meditación</h1>
          <p>
            Buen momento para relajarnos! Elegí la que mas te guste.
          </p>
        </div>
        <div className={styles.meditacionImagenContainer}>
          <img src={MeditacionImagen} alt="" />
        </div>
      </div>
      <div className="padding-page">
        <div className={styles.container}>
          <div>
            {meditaciones.map((meditacion, index) => (
              <div key={index} className={styles.meditacionItem}>
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
                </div>
                <div>
                  <a
                    onClick={() => handleButtonClick(meditacion.sonido, index)}
                    className={styles.playPauseButton}
                  >
                    <FontAwesomeIcon
                      icon={
                        isPlaying && currentAudioIndex === index
                          ? faPause
                          : faPlay
                      }
                    />
                  </a>
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
