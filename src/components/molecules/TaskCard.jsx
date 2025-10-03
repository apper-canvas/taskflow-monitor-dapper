import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, onToggleComplete, onDelete }) => {
  const priorityConfig = {
    high: {
      color: "border-error",
      badge: "bg-error/10 text-error",
      label: "High"
    },
    medium: {
      color: "border-warning",
      badge: "bg-warning/10 text-warning",
      label: "Medium"
    },
    low: {
      color: "border-info",
      badge: "bg-info/10 text-info",
      label: "Low"
    }
  };

const config = priorityConfig[task.priority_c] || priorityConfig.medium;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
onDelete(task.Id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200",
        "border-l-4",
        config.color,
task.completed_c && "opacity-60"
      )}
    >
      <div className="p-4 flex items-start gap-4">
        <button
onClick={() => onToggleComplete(task.Id)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200",
            "hover:scale-110 active:scale-95",
task.completed_c
              ? "bg-success border-success"
              : "border-slate-300 hover:border-primary"
          )}
        >
{task.completed_c && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" size={16} className="text-white" />
            </motion.div>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={cn(
              "text-lg font-semibold text-slate-900 transition-all duration-300",
task.completed_c && "line-through text-slate-500"
            )}>
              {task.title_c}
            </h3>
            <span className={cn(
              "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
              config.badge
            )}>
              {config.label}
            </span>
          </div>

{task.description_c && (
            <p className={cn(
              "text-slate-600 text-sm mb-3 transition-all duration-300",
              task.completed_c && "text-slate-400"
            )}>
              {task.description_c}
            </p>
          )}

          <div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-xs text-slate-500">
              <ApperIcon name="Clock" size={14} />
              <span>
                {new Date(task.created_at_c).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })}
              </span>
              {task.completed_c && task.completed_at_c && (
                <>
                  <span>•</span>
                  <ApperIcon name="CheckCircle2" size={14} className="text-success" />
                  <span>
                    {new Date(task.completed_at_c).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;