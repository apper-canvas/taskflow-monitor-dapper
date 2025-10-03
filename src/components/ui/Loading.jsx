import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-4">
      {[1, 2, 3].map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white rounded-xl p-4 shadow-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;