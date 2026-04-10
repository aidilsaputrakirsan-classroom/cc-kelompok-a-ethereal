import TaskCard from "./TaskCard";

// Fokus pada manajemen daftar
function TaskList({ tasks }) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
export default TaskList;