import React, { useState, useEffect, useRef } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { GoArrowUp, GoArrowDown } from "https://esm.sh/react-icons/go";
import { BsFillSkipStartFill } from "https://esm.sh/react-icons/bs";
import { MdRestartAlt } from "https://esm.sh/react-icons/md";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeLeft(sessionLength * 60); 
  }, [sessionLength]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            audioRef.current.play(); // Executar o áudio quando o tempo chegar a 00:00

            // Se o tempo acabou, alternar entre sessão e pausa
            if (isSession) {
              setSessionLength((prevLength) => {
                setIsSession(false);
                return prevLength;
              });
              return breakLength * 60;
            } else {
              setSessionLength((prevLength) => {
                setIsSession(true);
                return prevLength;
              });
              return sessionLength * 60;
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, sessionLength, breakLength, isSession]);

  const incrementLength = (setter) => {
    setter((prevValue) => (prevValue < 60 ? prevValue + 1 : prevValue));
  };

  const decrementLength = (setter) => {
    setter((prevValue) => (prevValue > 1 ? prevValue - 1 : prevValue));
  };

  const reset = () => {
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(sessionLength * 60);

    if (!audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div id="main-body">
      <h1>Pomodoro Timer</h1>
      <div className="labels">
        <label id="break-label">Break Length</label>
        <label id="session-label">Session Length</label>
      </div>
      <div>
        <button id="break-increment" onClick={() => incrementLength(setBreakLength)}>
          <GoArrowUp />
        </button>
        <span id="break-length">{breakLength}</span>
        <button id="break-decrement" onClick={() => decrementLength(setBreakLength)}>
          <GoArrowDown />
        </button>
        <button id="session-increment" onClick={() => incrementLength(setSessionLength)}>
          <GoArrowUp />
        </button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-decrement" onClick={() => decrementLength(setSessionLength)}>
          <GoArrowDown />
        </button>
      </div>
      <div id="session-time">
        <label id="timer-label">{isSession ? "Session" : "Break"}</label>
        <br />
        <label id="time-left">{formatTime(timeLeft)}</label>
      </div>
      <div id="start-stop">
        <button id="start_stop" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button id="reset" onClick={reset}>
          <MdRestartAlt />
        </button>
      </div>
      <audio id="beep" ref={audioRef}>
        <source src="https://s3-us-west-1.amazonaws.com/benjaminadk/Data+synth+beep+high+and+sweet.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#box"));