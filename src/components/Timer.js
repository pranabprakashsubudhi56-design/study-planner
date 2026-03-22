import React, { useState, useRef } from "react";

function Timer() {
  const [time, setTime] = useState(1500);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTime(1500);
  };

  return (
    <div>
      <h2>⏳ {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}{time % 60}</h2>
      <button onClick={start}>Start</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Timer;