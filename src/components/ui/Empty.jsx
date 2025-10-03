import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ filter }) => {
  const getEmptyMessage = () => {
    switch (filter) {
      case "active":
        return {
          icon: "CheckCircle2",
          title: "All caught up!",
          message: "You've completed all your tasks. Time to add some new ones!"
        };
      case "completed":
        return {
          icon: "ListTodo",
          title: "No completed tasks yet",
          message: "Start checking off tasks to see them here."
        };
      default:
        return {
          icon: "Sparkles",
          title: "Ready to get things done?",
          message: "Add your first task above to start organizing your day!"
        };
    }
  };

  const emptyState = getEmptyMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-full p-8 mb-6"
      >
        <ApperIcon name={emptyState.icon} size={64} className="text-primary" />
      </motion.div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{emptyState.title}</h3>
      <p className="text-slate-600 text-center max-w-md">{emptyState.message}</p>
    </motion.div>
  );
};

export default Empty;