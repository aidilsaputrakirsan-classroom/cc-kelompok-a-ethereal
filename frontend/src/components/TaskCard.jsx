function TaskCard({ task }) {
  return (
    <div style={styles.card}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Deadline: {task.deadline}</p>
    </div>
  );
}

const styles = {
  card: {
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "1rem",
    backgroundColor: "#fff",
  },
};

export default TaskCard;