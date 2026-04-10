import { useEffect, useState } from "react";
import { api } from "../services/api";
import TaskCard from "./TaskCard";

function TaskList({ token }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await api.getTasks(token);
      if (!data.error) setTasks(data);
    };
    fetchTasks();
  }, [token]);

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;