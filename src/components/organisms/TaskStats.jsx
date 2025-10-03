import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const TaskStats = ({ taskCounts, onClearCompleted }) => {
  const completionPercentage = taskCounts.all > 0
    ? Math.round((taskCounts.completed / taskCounts.all) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Your Progress</h3>
          <p className="text-sm text-slate-600">
            {taskCounts.completed} of {taskCounts.all} tasks completed
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {completionPercentage}%
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{taskCounts.all}</div>
          <div className="text-xs text-slate-600">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{taskCounts.active}</div>
          <div className="text-xs text-slate-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{taskCounts.completed}</div>
          <div className="text-xs text-slate-600">Done</div>
        </div>
      </div>

      {taskCounts.completed > 0 && (
        <Button
          variant="danger"
          className="w-full"
          onClick={onClearCompleted}
        >
          <ApperIcon name="Trash2" size={16} />
          Clear Completed Tasks
        </Button>
      )}
    </motion.div>
  );
};

export default TaskStats;