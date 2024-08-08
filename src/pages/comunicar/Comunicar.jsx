import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../js/config";
import styles from "./Comunicar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Oval } from "react-loader-spinner";
import ModalInfo from "../../components/modal-info/ModalInfo";
import Logo from "../../assets/logo192x192.png"

const Comunicar = () => {
  const [botones, setBotones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchBotones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "botones"));
        const botonesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          favorito: favoritos.includes(doc.id),
        }));
        setBotones(botonesData);

        const categoriasData = Array.from(
          new Set(
            botonesData.map((boton) =>
              boton.categoria ? boton.categoria.trim().toLowerCase() : ""
            )
          )
        ).filter((categoria) => categoria);
        const categoriasCapitalizadas = categoriasData.map((categoria) => {
          if (categoria) {
            return categoria.charAt(0).toUpperCase() + categoria.slice(1);
          }
          return categoria;
        });

        setCategorias(["Todos", ...categoriasCapitalizadas]);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los botones:", error);
        setLoading(false);
      }
    };

    fetchBotones();
  }, [db, favoritos]);

  useEffect(() => {
    if (!user) return;

    const fetchFavoritos = async () => {
      try {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userFavs = userData.botonesFavoritos || [];
          setFavoritos(userFavs);
        }
      } catch (error) {
        console.error("Error al obtener los favoritos:", error);
      }
    };

    fetchFavoritos();
  }, [user, db]);

  const handleButtonClick = (sonidoUrl) => {
    const audio = new Audio(sonidoUrl);
    audio.play();
  };

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const toggleFavorito = async (botonId) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        let favoritos = userData.botonesFavoritos || [];

        if (favoritos.includes(botonId)) {
          favoritos = favoritos.filter((id) => id !== botonId);
        } else {
          favoritos.push(botonId);
        }

        await updateDoc(userDocRef, { botonesFavoritos: favoritos });

        setFavoritos(favoritos);
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  const mostrarFavoritosHandler = () => {
    setMostrarFavoritos(!mostrarFavoritos);
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

  let botonesFiltrados = botones.filter((boton) =>
    categoriaSeleccionada === "Todos"
      ? true
      : boton.categoria &&
        boton.categoria.trim().toLowerCase() ===
          categoriaSeleccionada.trim().toLowerCase()
  );

  if (mostrarFavoritos) {
    botonesFiltrados = botonesFiltrados.filter((boton) => boton.favorito);
  }

  return (
    <div className="padding-page">
      <a onClick={openModal} className="infoButton">
        <img src={Logo} alt="" />
      </a>
      <ModalInfo
        show={showModal}
        onClose={closeModal}
        content="Esta es la sección de comunicación, en donde podes comunicarte con las personas mediante botones que emiten sonido."
      />

      <div className={styles.header}>
        <div className={styles.favoritoMostrarContainer}>
          <h1 className="titleSection">Comunicar</h1>
          <button
            className={styles.favoritoMostrar}
            onClick={mostrarFavoritosHandler}
          >
            <p>Favoritos</p>
            <FontAwesomeIcon
              icon={faStar}
              style={{ width: "20px", height: "20px" }}
            />
          </button>
        </div>
        <div className={styles.categorias}>
          {categorias.map((categoria, index) => (
            <button
              key={index}
              className={styles.categoriaBoton}
              onClick={() => handleCategoriaClick(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.container}>
        {botonesFiltrados.map((boton, index) => (
          <div key={index} className={styles.item}>
            <a onClick={() => handleButtonClick(boton.sonido)}>
              <p>{boton.texto}</p>
              <img src={boton.imagen} alt={boton.texto} />
            </a>
            <button
              className={styles.favoritoButton}
              onClick={() => toggleFavorito(boton.id)}
            >
              <FontAwesomeIcon
                icon={boton.favorito ? faStar : farStar}
                style={{ width: "20px", height: "20px" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comunicar;
