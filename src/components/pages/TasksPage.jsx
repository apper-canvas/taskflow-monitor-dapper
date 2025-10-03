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
import { useSelector, useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../../App';

const TasksPage = () => {
const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

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
    const task = tasks.find(t => t.Id === taskId);
    if (!task) return;

    try {
      const updated = await taskService.update(taskId, { 
        completed: !task.completed_c 
      });
      
      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updated : t
      ));

      if (updated.completed_c) {
        toast.success("Task completed! 🎉");
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

const handleDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
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
      setTasks(prev => prev.filter(t => !t.completed_c));
      toast.success(`${result.count} completed tasks cleared`);
    } catch (err) {
      toast.error("Failed to clear completed tasks");
    }
  };

const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter(t => !t.completed_c);
      case "completed":
        return tasks.filter(t => t.completed_c);
      default:
        return tasks;
    }
  };

const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed_c).length,
    completed: tasks.filter(t => t.completed_c).length
  };

  if (!isAuthenticated) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

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
<div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.firstName || 'User'}</h1>
              <p className="text-slate-600">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Logout
            </button>
          </div>

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