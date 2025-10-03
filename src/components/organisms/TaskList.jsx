import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Empty from "@/components/ui/Empty";

const TaskList = ({ tasks, filter, onToggleComplete, onDelete }) => {
  if (tasks.length === 0) {
    return <Empty filter={filter} />;
  }

  return (
    <motion.div 
      layout
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;