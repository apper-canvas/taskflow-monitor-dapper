import { Routes, Route } from "react-router-dom";
import TasksPage from "@/components/pages/TasksPage";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<TasksPage />} />
      </Routes>
    </div>
  );
}

export default App;