import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mulai animasi masuk
    const startTimer = setTimeout(() => setIsVisible(true), 10);

    // Mulai animasi keluar pada detik ke 2.5
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Hapus komponen dari DOM pada detik ke 3
    const unmountTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [onClose]);

  // Konfigurasi Gaya (Styles)
  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 1000,
      backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
      // Animasi Transisi
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.icon}>{type === 'success' ? '✅' : '❌'}</span>
      <p style={styles.text}>{message}</p>
    </div>
  );
};

export default Toast;