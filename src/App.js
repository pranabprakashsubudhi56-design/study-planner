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
  const [theme, setTheme] = useState("dark");
  const [alertMsg, setAlertMsg] = useState("");

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔔 Ask notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // 📥 Fetch tasks (with order)
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

  // 🔔 Notification function
  const showNotification = (title, body) => {
    setAlertMsg(body);

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
      });
    }

    setTimeout(() => setAlertMsg(""), 4000);
  };

  // ⏰ Deadline checker
  useEffect(() => {
    if (!tasks.length) return;

    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (!task.deadline) return;

        const taskDate = new Date(task.deadline);
        const diff = taskDate - now;
        const hours = diff / (1000 * 60 * 60);

        if (hours > 0 && hours < 1) {
          showNotification(
            "⏰ Task Due Soon",
            `${task.name} is due in less than 1 hour!`
          );
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  // 🌙 Theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🔐 Show login if not logged in
  if (!user) {
    return <Auth />;
  }

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

        {/* 🔔 In-app notification */}
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

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1>Smart Study Planner</h1>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* Theme */}
        <button onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>

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

        {/* Suggestion */}
        <div className="card">
          <Suggestion tasks={tasks} />
        </div>

      </div>
    </div>
  );
}

export default App;