import React from "react";
import styles from "./ModalInfo.module.css";

const ModalInfo = ({ show, onClose, content }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{content}</p>
        <button onClick={onClose} className={styles.closeButton}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalInfo;
