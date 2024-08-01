import React from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./ModalSolic.module.css";

const ModalSolic = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <a className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </a>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ModalSolic;
