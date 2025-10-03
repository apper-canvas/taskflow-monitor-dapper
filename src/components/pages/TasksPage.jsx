import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/molecules/TaskForm";
import FilterTabs from "@/components/molecules/FilterTabs";
import TaskList from "@/components/organisms/TaskList";
import TaskStats from "@/components/organisms/TaskStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import taskService from "@/services/taskService";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updated = await taskService.update(taskId, { 
        completed: !task.completed 
      });
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? updated : t
      ));

      if (updated.completed) {
        toast.success("Task completed! 🎉");
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleClearCompleted = async () => {
    if (!window.confirm("Are you sure you want to delete all completed tasks?")) {
      return;
    }

    try {
      const result = await taskService.clearCompleted();
      setTasks(prev => prev.filter(t => !t.completed));
      toast.success(`${result.count} completed tasks cleared`);
    } catch (err) {
      toast.error("Failed to clear completed tasks");
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter(t => !t.completed);
      case "completed":
        return tasks.filter(t => t.completed);
      default:
        return tasks;
    }
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadTasks} />
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-3 shadow-lg">
              <ApperIcon name="CheckSquare" size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Organize your day, one task at a time
          </p>
        </motion.div>

        <div className="space-y-6">
          <TaskForm onTaskAdded={handleAddTask} />

          <FilterTabs
            activeFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
          />

          <TaskList
            tasks={filteredTasks}
            filter={filter}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />

          {tasks.length > 0 && (
            <TaskStats
              taskCounts={taskCounts}
              onClearCompleted={handleClearCompleted}
            />
          )}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-slate-500"
        >
          <p>Made with ❤️ for productivity enthusiasts</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default TasksPage;