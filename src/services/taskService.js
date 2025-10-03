const STORAGE_KEY = "taskflow_tasks";

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getTasks = () => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

const taskService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getTasks();
  },

  create: async (taskData) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const tasks = getTasks();
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  },

  update: async (id, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates
    };

    if (updates.completed !== undefined && updates.completed) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (updates.completed !== undefined && !updates.completed) {
      updatedTask.completedAt = null;
    }

    tasks[taskIndex] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const tasks = getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
    return { success: true };
  },

  clearCompleted: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const tasks = getTasks();
    const activeTasks = tasks.filter(task => !task.completed);
    saveTasks(activeTasks);
    return { success: true, count: tasks.length - activeTasks.length };
  }
};

export default taskService;