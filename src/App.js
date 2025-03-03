import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestScreen from './pages/QuestScreen';
import WorkoutPlan from './pages/WorkoutPlan';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    // Request notification permission on app load
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          toast.success("Notifications enabled!");
        } else {
          toast.warn("Notifications not enabled.");
        }
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestScreen />} />
        <Route path="/workout" element={<WorkoutPlan />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={5000} />
    </Router>
  );
}

export default App;
