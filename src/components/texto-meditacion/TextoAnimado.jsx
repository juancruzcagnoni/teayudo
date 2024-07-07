import React, { useState, useEffect } from "react";
import styles from "./TextoAnimado.module.css";

const TextoAnimado = ({ show }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000); // Mostrar durante 3 segundos
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.textoAnimado}>
        <p>Cierra los ojos y relájate</p>
      </div>
    </div>
  );
};

export default TextoAnimado;
