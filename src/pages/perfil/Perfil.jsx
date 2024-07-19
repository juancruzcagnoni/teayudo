import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../js/config";
import { Oval } from "react-loader-spinner";
import styles from "./Perfil.module.css";
import profileDefault from "../../assets/profile-default.jpg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import ModalConfirmacion from "../../components/modal/Modal";
import ModalInfo from "../../components/modal-info/ModalInfo";

const Perfil = () => {
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userType, setUserType] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // Estado para el evento beforeinstallprompt
  const auth = getAuth(app);
  const navigate = useNavigate();

  const db = getFirestore(app);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "usuarios", user.uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserName(userData.name);
          setUserSurname(userData.apellido);
          setUserType(userData.userType);
          setProfilePhoto(userData.photoURL || profileDefault);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [auth, db]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleSignOut = async () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCancelSignOut = () => {
    setShowConfirmModal(false);
  };

  const handleEditProfile = () => {
    navigate("/editar-perfil");
  };

  const handleReadReports = () => {
    navigate("/leer-informes");
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
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
      <div className={styles.topProfileSection}>
        <ModalInfo
          show={showModal}
          onClose={closeModal}
          content="Esta es la sección de tu perfil, en donde podes ver y editar tu información."
        />
        <div className={styles.perfilContainer}>
          <div className={styles.perfilHeader}>
            <div className={styles.topHeader}>
              <h1 className="titleSection">Perfil</h1>
              <a onClick={handleEditProfile} className={styles.editButton}>
                <FontAwesomeIcon icon={faEdit} className="icon" />
              </a>
            </div>
            <div className={styles.perfilImage}>
              <img src={profilePhoto} alt="Foto de perfil" />
            </div>
            <h2>{`${userName} ${userSurname}`}</h2>
            <a onClick={handleEditProfile} className={styles.changePhoto}>
              Cambiar foto
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottomProfileSection}>
        <div>
          <h3>Mi Cuenta</h3>
          <div className={styles.informesSection} onClick={handleReadReports}>
            <div className={styles.linksInformes}>
              <div className={styles.linksInformesIcon}>
                <FontAwesomeIcon icon={faFileAlt} className={styles.iconInformes} />
              </div>
              <div>
                <a>Informes</a>
              </div>
            </div>
            <span className={styles.arrowIcon}>
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
          </div>
        </div>

        <div className={styles.linksCerrarSesion} onClick={handleSignOut}>
          <a>Cerrar sesión</a>
        </div>

        {deferredPrompt && (
          <button className={styles.installButton} onClick={handleInstallClick}>
            Descargar aplicación
          </button>
        )}
      </div>

      {showConfirmModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que quieres cerrar sesión?"
          onConfirm={handleConfirmSignOut}
          onCancel={handleCancelSignOut}
        />
      )}
    </>
  );
};

export default Perfil;
