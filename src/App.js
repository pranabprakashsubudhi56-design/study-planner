import React, { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import Progress from "./components/Progress";
import ChartView from "./components/ChartView";
import Suggestion from "./components/Suggestion";
import Profile from "./components/Profile";
import Auth from "./components/Auth";
import "./App.css";

import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [alertMsg, setAlertMsg] = useState("");

  // 🔐 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔔 Notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // 📥 Fetch tasks
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔔 Notification
  const showNotification = (title, body) => {
    setAlertMsg(body);

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }

    setTimeout(() => setAlertMsg(""), 4000);
  };

  // ⏰ Deadline checker (FIXED: avoid spam)
  useEffect(() => {
    if (!tasks.length) return;

    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (!task.deadline || task.notified) return;

        const taskDate = new Date(task.deadline);
        const diff = taskDate - now;
        const hours = diff / (1000 * 60 * 60);

        if (hours > 0 && hours < 1) {
          showNotification(
            "⏰ Task Due Soon",
            `${task.name} is due soon!`
          );

          task.notified = true; // 🔥 prevent repeat
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  // 🌙 Theme toggle (SAVE FIXED)
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return <Auth />;

  return (
    <div className={`app-container ${theme}`}>

      {/* Sidebar */}
      <div className="sidebar">
        <h2>📚 Planner</h2>
        <p>Dashboard</p>
        <p>Tasks</p>
      </div>

      {/* Main */}
      <div className="main">

        {/* 🔔 Alert */}
        {alertMsg && (
          <div style={{
            background: "#f59e0b",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px"
          }}>
            🔔 {alertMsg}
          </div>
        )}

        {/* 🔥 HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <div>
            <h1>Smart Study Planner</h1>
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>
              Welcome, {user.displayName || "User"} 👋
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={toggleTheme}>
              {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="card">
          <Profile />
        </div>

        {/* Task Input */}
        <div className="card">
          <TaskInput user={user} tasks={tasks} />
        </div>

        {/* Task List */}
        <div className="card">
          <TaskList tasks={tasks} />
        </div>

        {/* Row */}
        <div className="row">
          <div className="card">
            <Progress tasks={tasks} />
          </div>

          <div className="card">
            <Timer />
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <ChartView tasks={tasks} />
        </div>

        {/* Suggestions */}
        <div className="card">
          <Suggestion tasks={tasks} />
        </div>

      </div>
    </div>
  );
}

export default App;