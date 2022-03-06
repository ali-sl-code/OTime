import { useEffect, useState } from "react";
import axios from 'axios'

import "./App.css";
import pause from "./pause-button.svg";
import play from "./play.svg";
import stop from "./stop.svg";

type List = {
  lable: string | undefined;
  timespan:
    | {
        start: string | undefined;
        end: string | undefined;
      }
    | undefined;
  timeperiod: string | undefined;
}[];

function App() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [list, setList] = useState<List | undefined>([]);
  const [loading, setLoading] = useState(false)

  const addList = (val: List): void => {
    setList((prevList) => [...prevList!, ...val]);
  };

  const setEnd = (): void => {
    const index = list!.length - 1
    const timeString = `${("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:${("0" + Math.floor((time / 60000) % 60)).slice(-2)}:${("0" + Math.floor((time / 1000) % 60)).slice(-2)}`

    list!.length !== 0 &&
      setList((prevList) => {
        const newList = prevList;
        newList![index].timespan!.end = getDate();
        newList![index].timeperiod = timeString;
        return [...newList!];
      });
  };

  const setLable = (index: number, lable: string): void => {
    setList((prevList) => {
      const newList = prevList;
      newList![index].lable = lable;
      return [...newList!];
    });
  };

  const reset = (): void => {
    setTime(0)
    setRunning(false)
    setList([])
  }

  const getDate = (): string => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
  };

  const fetchData = async (type: 'json' | 'csv'): Promise<void> => {
    setLoading(true)
    const res = await axios.post(`http://localhost:3001/${type}`, { list });
    if (res.status === 200) {
      setLoading(false)
    }
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> = 0;

    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);

      const now: string = getDate();
      addList([
        {
          lable: "",
          timespan: {
            start: now,
            end: "...",
          },
          timeperiod: "...",
        },
      ]);
    } else if (!running) {
      clearInterval(interval);

      const now: string = getDate();
      setEnd();
    }

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent): void => {
      if (e.code === "Escape") {
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
              confirm("R u sure?") && reset();
            }}
          >
            <img src={stop} alt={"stop"} />
          </button>
        </div>

        <div className="list">
          <div className="export">
            <button className="json" onClick={() => fetchData("json")}>
              JSON
            </button>
            <button className="csv" onClick={() => fetchData("csv")}
            disabled={loading}>
              CSV
            </button>
          </div>
          {list!.length !== 0 &&
            list!.map((value, index) => (
              <div className="item" key={index}>
                <span className="order">{index + 1}</span>
                <span className="lable">
                  <input
                    type="text"
                    id="lable-1"
                    defaultValue={value.lable}
                    onChange={(e) => setLable(index, e.target.value)}
                  />
                </span>
                <div className="timespan">
                  <span className="timespan-start">
                    {value.timespan!.start}
                  </span>
                  <span>{" to "}</span>
                  <span className="timespan-end">{value.timespan!.end}</span>
                </div>
                <span className="timeperiod">{value.timeperiod}</span>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default App;
