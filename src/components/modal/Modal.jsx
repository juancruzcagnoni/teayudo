import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const ModalConfirmacion = ({ mensaje, onConfirm, onCancel }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          <p>{mensaje}</p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirmar
          </button>
          <button onClick={onCancel} className={styles.closeButton}>
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ModalConfirmacion;
