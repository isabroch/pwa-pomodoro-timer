import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

// initialize duration formatting plugin for moment library
momentDurationFormatSetup(moment);

const TimerInput = ({ phase: { name, duration }, setDuration }) => {
  const [value, setValue] = useState(duration);

  const changeValue = (e) => {
    const updateValue = parseInt(e.target.value);
    setValue(updateValue);
    setDuration(updateValue);
  };

  return (
    <div className="inputOption">
      <input
        type="number"
        name={name.toLowerCase()}
        id={name.toLowerCase()}
        min="0"
        value={value}
        onChange={changeValue}
      />
      <label htmlFor={name.toLowerCase()}>{name}</label>
    </div>
  );
};

const Timer = ({ phases }) => {
  const styles = css`
    max-width: 300px;
    margin: 0 auto;

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

    .timeElapsed {
      stroke-width: 5px;
      stroke: green;
    }

    .labels {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 2rem;
    }
  `;

  const [timePassed, setTimePassed] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);
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
  useEffect(() => {
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
  }, [isActive]);

  // change duration based on active phase;
  useEffect(() => {
    setDuration(
      moment.duration(phases[currentPhase].duration, "minutes").asSeconds()
    );
  }, [currentPhase, phases]);

  // TODO: When time elapses, trigger notification to change phase!

  return (
    <div css={styles}>
      <div className="timer">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="circle">
            <circle className="timeElapsed" cx="50" cy="50" r="45" />
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
    },
    {
      id: 1,
      name: "Break",
      duration: 5,
    },
  ]);

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
    <div className="container">
      {phases.map(({ id, ...props }) => {
        return (
          <TimerInput
            key={id}
            phase={props}
            setDuration={(duration) => setPhaseDuration(id, duration)}
          />
        );
      })}
      <Timer phases={phases} />
    </div>
  );
};
render(<App />, document.getElementById("app"));
