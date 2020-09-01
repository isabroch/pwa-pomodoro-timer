import React from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";

const App = () => {
  const styles = css`
    .inputOption {
    }
  `;

  return (
    <div className="container" css={styles}>
      <div className="inputOption">
        <input type="number" name="work" id="work" min="0" default="25" />
        <label htmlFor="work">Work</label>
      </div>
      <div className="inputOption">
        <input type="number" name="break" id="break" min="0" default="25" />
        <label htmlFor="break">Break</label>
      </div>
      <div className="timer">
        <svg className="timerView">
          <g className="circle">
            <circle className="timeElapsed" />
          </g>
        </svg>
        <span className="timeRemaining">25</span>
        <span className="activeSessionLabel">Work</span>
      </div>
      <button className="button button-primary">Start</button>
      <button className="button button-secondary">Skip</button>
    </div>
  );
};
render(<App />, document.getElementById("app"));
