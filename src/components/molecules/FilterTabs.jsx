import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterTabs = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { id: "all", label: "All Tasks", icon: "List", count: taskCounts.all },
    { id: "active", label: "Active", icon: "Circle", count: taskCounts.active },
    { id: "completed", label: "Completed", icon: "CheckCircle2", count: taskCounts.completed }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
              "whitespace-nowrap",
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-slate-50 shadow-card"
            )}
          >
            <ApperIcon name={filter.icon} size={18} />
            <span>{filter.label}</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold",
              isActive ? "bg-white/20" : "bg-slate-100 text-slate-700"
            )}>
              {filter.count}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;