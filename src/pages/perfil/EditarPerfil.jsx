import React, { useState, useEffect } from "react";
import {
  getAuth,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  sendEmailVerification,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import app from "../../js/config";
import { useNavigate } from "react-router-dom";
import styles from "./EditarPerfil.module.css";
import { Oval } from "react-loader-spinner";
import ModalConfirmacion from "../../components/modal/Modal";
import profileDefault from "../../assets/profile-default.jpg";

const EditarPerfil = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState(""); // Estado para el apellido
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "usuarios", user.uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setName(userData.name || "");
            setSurname(userData.apellido || ""); // Obtener y establecer el apellido
            setEmail(user.email || "");
            setProfileImageUrl(userData.photoURL || profileDefault);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, db]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    setUpdating(true);

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      if (name) {
        await updateProfile(user, { displayName: `${name} ${surname}` });
        const userDocRef = doc(db, "usuarios", user.uid);
        await updateDoc(userDocRef, { name, apellido: surname });
      }

      if (newEmail && newEmail !== user.email) {
        await reauthenticateWithCredential(user, credential);
        await sendEmailVerification(user);
        setMessage("Se ha enviado un correo de verificación. Por favor verifica tu nuevo correo electrónico.");
        setUpdating(false);
        return;
      }

      if (newPassword) {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      }

      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, profileImage);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL });
        const userDocRef = doc(db, "usuarios", user.uid);
        await updateDoc(userDocRef, { photoURL });
      } else if (removeProfileImage) {
        const photoURL = "";
        await updateProfile(user, { photoURL });
        const userDocRef = doc(db, "usuarios", user.uid);
        await updateDoc(userDocRef, { photoURL });
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await deleteObject(storageRef).catch((error) => {
          console.log("Error eliminando la foto de perfil:", error);
        });
      }

      setMessage("Perfil actualizado exitosamente");
      setTimeout(() => {
        setMessage("");
        navigate("/perfil");
      }, 3000);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setMessage("Por favor, vuelva a iniciar sesión para realizar esta operación.");
      } else {
        console.error("Error al actualizar perfil:", error);
        setMessage(`Error al actualizar perfil: ${error.message}`);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  const handleBack = () => {
    navigate("/perfil");
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveProfileImage = () => {
    setShowDeleteImageModal(true);
  };

  const handleConfirmRemoveProfileImage = () => {
    setRemoveProfileImage(true);
    setProfileImage(null);
    setProfileImageUrl(profileDefault);
    setShowDeleteImageModal(false);
  };

  const handleCancelRemoveProfileImage = () => {
    setShowDeleteImageModal(false);
  };

  if (loading || updating) {
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
      <div className={styles.container}>
        <a onClick={handleBack} className="backButton">
          <FontAwesomeIcon icon={faArrowLeft} />
        </a>
        <h1 className="titleSection">Editar Perfil</h1>
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <div className={styles.imageContainerEdit}>
            {profileImageUrl && (
              <div className={styles.profileImagePreview}>
                <img src={profileImageUrl} alt="Foto de perfil actual" />
                <a
                  type="button"
                  onClick={handleRemoveProfileImage}
                  className={styles.removeImageIcon}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </a>
              </div>
            )}
            <label htmlFor="profileImageInput" className={styles.addPhotoText}>
              Agregar
            </label>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="camposContainer">
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="camposContainer">
            <label>Apellido</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="camposContainer">
            <label>Contraseña actual</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="camposContainer">
            <label>Contraseña nueva</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          {message && (
            <p className={message.includes("Error") ? "error" : "success"}>
              {message}
            </p>
          )}
          <button type="submit" className={styles.actualizar}>
            Actualizar perfil
          </button>
        </form>
      </div>
      {showConfirmModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que quieres actualizar tu perfil?"
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
      {showDeleteImageModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que quieres eliminar la foto de perfil?"
          onConfirm={handleConfirmRemoveProfileImage}
          onCancel={handleCancelRemoveProfileImage}
        />
      )}
    </div>
  );
};

export default EditarPerfil;
