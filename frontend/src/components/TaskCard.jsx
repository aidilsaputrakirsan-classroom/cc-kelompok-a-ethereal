function TaskCard({ task }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white transition-colors">{task.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mt-2 transition-colors">{task.description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">Status: {task.status}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Deadline: {task.deadline}</p>
    </div>
  );
}

export default TaskCard;