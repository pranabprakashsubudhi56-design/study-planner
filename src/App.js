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
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("order", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  const showNotification = (title, body) => {
    setAlertMsg(body);

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }

    setTimeout(() => setAlertMsg(""), 4000);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();

      for (let task of tasks) {
        if (!task.deadline || task.notified) continue;

        const diff = new Date(task.deadline) - now;
        const hours = diff / (1000 * 60 * 60);

        if (hours > 0 && hours < 1) {
          showNotification("⏰ Due Soon", task.name);

          await updateDoc(doc(db, "tasks", task.id), {
            notified: true
          });
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const toggleTheme = () => {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  const logout = async () => {
    if (window.confirm("Logout?")) {
      await signOut(auth);
    }
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

        {alertMsg && <div className="alert">🔔 {alertMsg}</div>}

        <div className="header">
          <div>
            <h1>Smart Planner</h1>
            <p>Welcome, {user.displayName}</p>
          </div>

          <div>
            <button onClick={toggleTheme}>Toggle</button>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>

        <div className="card"><Profile /></div>
        <div className="card"><TaskInput user={user} /></div>
        <div className="card"><TaskList tasks={tasks} /></div>

        <div className="row">
          <div className="card"><Progress tasks={tasks} /></div>
          <div className="card"><Timer /></div>
        </div>

        <div className="card"><ChartView tasks={tasks} /></div>
        <div className="card"><Suggestion tasks={tasks} /></div>

      </div>
    </div>
  );
}

export default App;