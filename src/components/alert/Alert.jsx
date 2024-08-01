import React, { useEffect, useState } from 'react';
import styles from './Alert.module.css';

const Alert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`${styles.alert} ${isVisible ? styles.show : styles.hide}`}
    >
      {message}
    </div>
  );
};

export default Alert;
