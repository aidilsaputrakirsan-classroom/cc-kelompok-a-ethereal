import { useState, useEffect } from "react"

function Toast({ message, type = "success", onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animasi masuk
    const startTimer = setTimeout(() => setIsVisible(true), 10)

    // Animasi keluar
    const exitTimer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    // Hapus dari DOM
    const unmountTimer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(exitTimer)
      clearTimeout(unmountTimer)
    }
  }, [onClose])

  const styles = {
    container: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "12px 16px",
      borderRadius: "10px",
      color: "white",
      boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      zIndex: 1000,
      backgroundColor: type === "success" ? "#22c55e" : "#ef4444",
      transition: "opacity 0.4s ease, transform 0.4s ease",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(20px)",
      maxWidth: "300px",
      wordBreak: "break-word",
      pointerEvents: "auto",
    },

    icon: {
      fontSize: "18px",
    },

    text: {
      margin: 0,
      fontSize: "14px",
      flex: 1,
    },

    closeBtn: {
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      marginLeft: "5px",
    },
  }

  return (
    <div style={styles.container}>
      <span style={styles.icon}>
        {type === "success" ? "✅" : "❌"}
      </span>

      <p style={styles.text}>{message}</p>

      <button onClick={onClose} style={styles.closeBtn}>
        ✕
      </button>
    </div>
  )
}

export default Toast