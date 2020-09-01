import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

// initialize duration formatting plugin for moment library
momentDurationFormatSetup(moment);

const TimerInput = ({ phase: { name, duration } }) => {
  return (
    <div className="inputOption">
      <input
        type="number"
        name={name.toLowerCase()}
        id={name.toLowerCase()}
        min="0"
        defaultValue={duration}
      />
      <label htmlFor={name.toLowerCase()}>{name}</label>
    </div>
  );
};

const Timer = ({ phases }) => {
  const styles = css`
    max-width: 300px;
    margin: 0 auto;

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

  function reset(phase = null) {
    setTimePassed(0);
    setIsActive(false);
  }

  function toggle() {
    setIsActive((isActive) => !isActive);
  }

  // toggle counting based on active state
  useEffect(() => {
    let timer = null;

    if (isActive) {
      timer = setInterval(() => {
        setTimePassed((timePassed) => timePassed + 1);
      }, 1000);
    } else if (!isActive) {
      clearInterval(timer);
    }

    return () => {
      // Remove any intervals when component unmounts
      clearInterval(timer);
    };
  }, [isActive]);

  // change duration based on active phase
  useEffect(() => {
    setDuration(moment.duration(phases[currentPhase].duration, "minutes"));
  }, [currentPhase]);

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
              .duration(duration)
              .subtract(timePassed, "seconds")
              .format("m:ss")}
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
            reset();
            nextPhase();
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};

const App = () => {
  // duration is handled in minutes
  const phases = [
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
  ];

  return (
    <div className="container">
      {phases.map((props) => {
        return <TimerInput key={props.id} phase={props} />;
      })}
      <Timer phases={phases} />
    </div>
  );
};
render(<App />, document.getElementById("app"));
