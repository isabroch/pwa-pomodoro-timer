import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion } from "framer-motion";

// initialize duration formatting plugin for moment library
momentDurationFormatSetup(moment);

const TimerInput = ({ phase: { name, duration }, setDuration, isActive }) => {
  const [value, setValue] = useState(duration);

  const changeValue = (e) => {
    const updateValue = parseInt(e.target.value);
    setValue(updateValue);
    setDuration(updateValue);
  };

  // disable current input when timer is active and currently on that phase

  return (
    <div className="inputOption">
      <input
        type="number"
        name={name.toLowerCase()}
        id={name.toLowerCase()}
        min="0"
        value={value}
        onChange={changeValue}
        disabled={isActive}
      />
      <label htmlFor={name.toLowerCase()}>{name}</label>
    </div>
  );
};

const Timer = ({
  phases,
  isActive,
  setIsActive,
  currentPhase,
  setCurrentPhase,
}) => {
  const [timePassed, setTimePassed] = useState(0);
  const [duration, setDuration] = useState(0);

  function nextPhase() {
    // loop back to first phase if currently on last phase
    let newPhase = currentPhase === phases.length - 1 ? 0 : currentPhase + 1;
    setCurrentPhase(newPhase);
  }

  function reset() {
    setTimePassed(0);
    setIsActive(false);
  }

  function toggle() {
    setIsActive((isActive) => !isActive);
  }

  // toggle counting based on active state
  // TODO: Change interval back to 1000ms - currently 10ms for faster testing!
  function handleTimer() {
    let timer = null;

    if (isActive) {
      timer = setInterval(() => {
        setTimePassed((timePassed) => {
          // stop timer at 0
          if (timePassed === duration) {
            setIsActive(false);
            clearInterval(timer);
            return timePassed;
          }

          // else continue timer
          return timePassed + 1;
        });
      }, 10);
    } else if (!isActive) {
      clearInterval(timer);
    }

    return () => {
      // Remove any intervals when component unmounts
      clearInterval(timer);
    };
  }

  useEffect(handleTimer, [isActive]);

  // change duration based on active phase;
  useEffect(() => {
    setDuration(
      moment.duration(phases[currentPhase].duration, "minutes").asSeconds()
    );
  }, [currentPhase, phases]);

  const styles = css`
    .buttons {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;

      .button {
        margin: 5px;
        font-size: 1rem;
        padding: 5px 0;
        box-sizing: border-box;
        max-width: 100%;

        &-primary {
          flex-grow: 5;
          flex-basis: 30ch;
        }
        &-secondary {
          flex-grow: 1;
          flex-basis: 10ch;
        }
      }
    }

    .timer {
      width: 100%;
      height: 0;
      margin: 1em 0;
      position: relative;
      padding-top: 100%;
    }

    svg,
    .labels {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .circle {
      fill: none;
      stroke: none;
    }

    .time {
      stroke-width: 4.5px;
      transition: stroke 0.2s;

      &Elapsed {
        transform-origin: center;
        stroke-width: 5px;
        stroke: #e9e9e9;
        transform: rotate(90deg);
      }
    }

    .labels {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 2rem;
    }
  `;

  // TODO: When time elapses, trigger notification to change phase!
  return (
    <div css={styles}>
      <div className="timer">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="circle">
            <motion.circle
              className="time"
              cx="50"
              cy="50"
              r="45"
              style={{ stroke: phases[currentPhase].color }}
            />
            <motion.path
              className="timeElapsed"
              d="M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: timePassed / duration || 0 }}
            ></motion.path>
          </g>
        </svg>
        <div className="labels">
          <span className="label label-time">
            {moment
              .duration(duration, "seconds")
              .subtract(timePassed, "seconds")
              .format("hh:*mm:ss")}
          </span>
          <span className="label label-name">{phases[currentPhase].name}</span>
        </div>
      </div>

      <div className="buttons">
        <button className="button button-primary" onClick={toggle}>
          {timePassed === 0 && !isActive
            ? "Start"
            : isActive
            ? "Pause"
            : "Resume"}
        </button>
        <button className="button button-secondary" onClick={reset}>
          Reset
        </button>
        <button
          className="button button-secondary"
          onClick={() => {
            nextPhase();
            reset();
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [phases, setPhases] = useState([
    {
      id: 0,
      name: "Work",
      duration: 25,
      color: "red",
    },
    {
      id: 1,
      name: "Break",
      duration: 5,
      color: "orange",
    },
  ]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const setPhaseDuration = (id, updateValue) => {
    setPhases((phases) => {
      const i = phases.findIndex((phase) => phase.id === id);
      phases[i].duration = updateValue;
      // creates a 'deep' copy, triggering full update
      const newPhases = JSON.parse(JSON.stringify(phases));
      return newPhases;
    });
  };

  return (
    <div
      className="container"
      css={css`
        max-width: 300px;
        margin: 0 auto;
      `}
    >
      <PhaseInputs
        phases={phases}
        isActive={isActive}
        setPhaseDuration={setPhaseDuration}
        currentPhase={currentPhase}
      />
      <Timer
        phases={phases}
        isActive={isActive}
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        setIsActive={setIsActive}
      />
    </div>
  );
};

const PhaseInputs = ({ phases, isActive, currentPhase, setPhaseDuration }) => {
  const styles = css`
    display: flex;
    justify-content: space-evenly;

    .inputOption {
      display: flex;
      flex-direction: column;
      flex: 0 1 10ch;
      margin: 5px 10px;
      align-items: center;

      input {
        width: 100%;
      }

      label {
        font-family: sans-serif;
        line-height: 200%;
      }
    }
  `;

  return (
    <div css={styles}>
      {phases.map(({ id, ...props }) => {
        return (
          <TimerInput
            key={id}
            phase={props}
            isActive={currentPhase === id ? isActive : false}
            setDuration={(duration) => setPhaseDuration(id, duration)}
          />
        );
      })}
    </div>
  );
};
render(<App />, document.getElementById("app"));
