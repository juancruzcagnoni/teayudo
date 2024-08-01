import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../js/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import styles from "./MeditacionDetalle.module.css";

const MeditacionDetalle = () => {
  const { id } = useParams();
  const [meditacion, setMeditacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/meditacion");
  };

  useEffect(() => {
    const fetchMeditaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "meditaciones"));
        const meditacionesData = querySnapshot.docs.map((doc) => doc.data());
        setMeditacion(meditacionesData[id]);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la meditación:", error);
        setLoading(false);
      }
    };

    fetchMeditaciones();
  }, [db, id]);

  const handlePlayPauseClick = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
      } else {
        currentAudio.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      const audio = new Audio(meditacion.sonido);
      audioRef.current = audio;
      setCurrentAudio(audio);
      audio.play();
      setIsPlaying(true);
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setCurrentTime(time);
    if (currentAudio) {
      currentAudio.currentTime = time;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

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

  if (!meditacion) {
    return <p>Meditación no encontrada</p>;
  }

  return (
    <div className="padding-page">
      <a onClick={handleBack} className="backButton">
        <FontAwesomeIcon icon={faArrowLeft} />
      </a>
      <div className={styles.imageContainerMeditacion}>
        <img src={meditacion.imagen} alt={meditacion.titulo} />
      </div>
      <div className={styles.containerMeditacionText}>
        <p>Usá tu respiración</p>
        <h1>{meditacion.titulo}</h1>
      </div>
      <div className={styles.audioControl}>
        <div className={styles.playContainer}>
          <a onClick={handlePlayPauseClick} className={styles.playPauseButton}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </a>
        </div>
        <div className={styles.timeSlider}>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleTimeChange}
          />
          <div className={styles.timeLabels}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditacionDetalle;
