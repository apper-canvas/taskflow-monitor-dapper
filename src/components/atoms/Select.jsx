import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "transition-all duration-200 cursor-pointer",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;