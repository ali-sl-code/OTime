import { useEffect, useState } from "react";

import "./App.css";
import flag from "./flag.svg";
import pause from "./pause-button.svg";
import play from "./play.svg";
import stop from "./stop.svg";

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> = 0;

    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent): void => {
      if (e.code === "Space") {
        setRunning((preRunning) => !preRunning);
      }
    });
  }, []);

  return (
    <div className="otime">
      <main>
        <div className="time">
          <span className="hours">
            {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:
          </span>
          <span className="minutes">
            {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
          </span>
          <span className="seconds">
            {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
          </span>
          <span className="millisecond">
            {("0" + ((time / 10) % 100)).slice(-2)}
          </span>
        </div>

        <div className="control">
          <button
          className="play"
            onClick={() => setRunning((preRunning) => !preRunning)}
          >
            <img
              src={running ? pause : play}
              alt={running ? "pause" : "play"}
            />
          </button>
          <button
          className="operation"
            onClick={() => {
              running ? alert("flag") : confirm("R u sure?") && setTime(0);
            }}
          >
            <img
              src={running ? flag : stop}
              alt={running ? "flag" : "stop"}
            />
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
