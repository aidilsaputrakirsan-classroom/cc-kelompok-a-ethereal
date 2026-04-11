import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { Button } from "./ui/Button";

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend (matches your README structure)
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/items", { // Using /items per your README CRUD tests
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      // Ensure we handle the "items" array in your response example
      setTasks(data.items || []); 
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await fetch(`http://localhost:8000/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading tasks...</div>;

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-bold text-gray-700">Recent Tasks</h2>
        <div className="w-32">
          <Button variant="primary" onClick={() => alert("Add Task Modal placeholder")}>
            + Add Task
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">No tasks found.</p>
            <p className="text-sm">Click "Add Task" to get started with your team.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;