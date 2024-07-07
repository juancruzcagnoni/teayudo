import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import app from "../../js/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronRight,
  faPlus,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { Oval } from "react-loader-spinner";
import styles from "./Informes.module.css";

const LeerInformes = () => {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/perfil");
  };

  const handleCreateReport = () => {
    navigate("/crear-informe");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserType(userData.userType);
        }
      }
    };

    fetchUserData();
  }, [auth, db]);

  useEffect(() => {
    const fetchInformes = async () => {
      const user = auth.currentUser;
      if (user) {
        const informesQuery = query(
          collection(db, "informes"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(informesQuery);
        const fetchedInformes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const informesEvaluadoQuery = query(
          collection(db, "informes"),
          where("personaEvaluada", "==", user.email)
        );
        const queryEvaluadoSnapshot = await getDocs(informesEvaluadoQuery);
        const fetchedInformesEvaluado = queryEvaluadoSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        const allInformes = fetchedInformes.concat(fetchedInformesEvaluado);
        setInformes(allInformes);

        setLoading(false);
      }
    };

    fetchInformes();
  }, [auth, db]);

  const handleInformeClick = (informeId) => {
    navigate(`/ver-informe/${informeId}`);
  };

  const toggleOrden = () => {
    setOrdenAscendente((prevOrden) => !prevOrden);
  };

  const ordenarInformesPorFecha = (a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    if (ordenAscendente) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  };

  const informesOrdenados = [...informes].sort(ordenarInformesPorFecha);

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
      <div className={styles.leerInformesContainer}>
        <a onClick={handleBack} className="backButton">
          <FontAwesomeIcon icon={faArrowLeft} />
        </a>
        {userType !== "niño/a" && (
          <div className={styles.createButton} onClick={handleCreateReport}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        )}
        <h2 className="titleSection">Mis Informes</h2>
        {informes.length > 0 ? (
          <div>
            <div className={styles.ordenButton} onClick={toggleOrden}>
              {ordenAscendente ? (
                <FontAwesomeIcon icon={faSortAmountUp} />
              ) : (
                <FontAwesomeIcon icon={faSortAmountDown} />
              )}
            </div>
            <ul className={styles.informesList}>
              {informesOrdenados.map((informe) => (
                <li
                  key={informe.id}
                  className={styles.informeItem}
                  onClick={() => handleInformeClick(informe.id)}
                >
                  <div className={styles.informeContent}>
                    <div className={styles.informeInfo}>
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className={styles.icon}
                      />
                      <div>
                        <h3>{informe.titulo}</h3>
                        {userType !== "niño/a" && (
                          <p>{informe.personaEvaluada}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={styles.iconChevron}>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No tienes informes disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default LeerInformes;
