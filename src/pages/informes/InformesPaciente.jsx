import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "../../js/config";
import styles from "./Informes.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faArrowLeft, faSortAmountUp, faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { Oval } from "react-loader-spinner";

const InformesPaciente = () => {
  const { email } = useParams();
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/pacientes");
  };

  const toggleOrden = () => {
    setOrdenAscendente((prevOrden) => !prevOrden);
  };

  const ordenarInformesPorFecha = (a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return ordenAscendente ? dateA - dateB : dateB - dateA;
  };

  useEffect(() => {
    const fetchInformes = async () => {
      console.log("Email received:", email);

      if (!email) {
        console.error("El email del paciente no está definido.");
        return;
      }

      try {
        const informesQuery = query(
          collection(db, "informes"),
          where("personaEvaluada", "==", email)
        );
        const informesSnapshot = await getDocs(informesQuery);
        const informesList = informesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInformes(informesList);
      } catch (error) {
        console.error("Error al obtener informes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformes();
  }, [email, db]);

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

  const informesOrdenados = [...informes]
    .sort(ordenarInformesPorFecha)
    .filter((informe) =>
      informe.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleInformeClick = (informeId) => {
    navigate(`/ver-informe-paciente/${informeId}`, {
      state: { from: `/informes-paciente/${email}` },
    });
  };

  return (
    <div className="padding-page">
      <a onClick={handleBack} className="backButton">
        <FontAwesomeIcon icon={faArrowLeft} />
      </a>
      <div className={styles.container}>
        <h2 className="titleSection">{email}</h2>
        <div className={styles.topInformesPacientes}>
          <input
            type="text"
            placeholder="Buscar"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.ordenButtonPaciente} onClick={toggleOrden}>
            {ordenAscendente ? (
              <FontAwesomeIcon icon={faSortAmountUp} />
            ) : (
              <FontAwesomeIcon icon={faSortAmountDown} />
            )}
          </div>
        </div>
        {informesOrdenados.length > 0 ? (
          <ul className={styles.informesList}>
            {informesOrdenados.map((informe) => (
              <li key={informe.id} className={styles.informeItem} onClick={() => handleInformeClick(informe.id)}>
                <div className={styles.informeContent}>
                  <div className={styles.informeInfo}>
                    <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
                    <div>
                      <h3>{informe.titulo}</h3>
                      <p>{informe.personaEvaluada}</p>
                    </div>
                  </div>
                  <div className={styles.informeRight}>
                    <p>{format(new Date(informe.fecha), "dd/MM/yyyy")}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes informes disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default InformesPaciente;
