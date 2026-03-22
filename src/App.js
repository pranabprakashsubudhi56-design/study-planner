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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

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

  const showNotification = (title, body) => {
    setAlertMsg(body);

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }

    setTimeout(() => setAlertMsg(""), 4000);
  };

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
          showNotification("⏰ Task Due Soon", `${task.name} is due soon!`);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) return <Auth />;

  return (
    <div className={`app-container ${theme}`}>

      <div className="sidebar">
        <h2>📚 Planner</h2>
        <p>Dashboard</p>
        <p>Tasks</p>
      </div>

      <div className="main">

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

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h1>Smart Study Planner</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={toggleTheme}>
              {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="card">
          <Profile />
        </div>

        <div className="card">
          <TaskInput user={user} tasks={tasks} />
        </div>

        <div className="card">
          <TaskList tasks={tasks} />
        </div>

        <div className="row">
          <div className="card">
            <Progress tasks={tasks} />
          </div>

          <div className="card">
            <Timer />
          </div>
        </div>

        <div className="card">
          <ChartView tasks={tasks} />
        </div>

        <div className="card">
          <Suggestion tasks={tasks} />
        </div>

      </div>
    </div>
  );
}

export default App;