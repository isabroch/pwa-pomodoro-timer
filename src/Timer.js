import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion } from "framer-motion";

/**
 * @typedef {Object} Phase
 * @prop {number} id - id of phase for React key
 * @prop {string} name - name of phase
 * @prop {number} duration - duration of phase in minutes
 * @prop {string} [color] - color of phase on timer
 */
const usePhases = () => {
  return useState(defaultPhases);
};

/**
 * @param {string} name - name of phase
 * @param {number} duration - duration of phase in seconds
 * @param {string} [color] - color of phase on timer
 */
const useCountdown = (name, duration, color = "#C66711") => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const styles = css`
    width: 100%;
    height: 0;
    margin: 1em 0;
    position: relative;
    padding-top: 100%;

    svg,
    .labels {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .labels {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 2rem;
    }

    .circle {
      fill: none;
      stroke: none;
    }

    .time {
      &Total {
        stroke-width: 5px;
        transition: stroke 0.2s;
      }
      &Elapsed {
        transform-origin: center;
        stroke-width: 5px;
        stroke: #e9e9e9;
        transform: rotate(90deg);
      }
    }
  `;

  const Countdown = () => (
    <div css={styles}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="circle">
          <motion.circle
            className="timeTotal"
            cx="50"
            cy="50"
            r="45"
            style={{ stroke: color }}
          />
          <motion.path
            className="timeElapsed"
            d="M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: timeElapsed / duration }}
          ></motion.path>
        </g>
      </svg>
      <div className="labels">
        <span className="label label-time">
          {moment
            .duration(duration, "seconds")
            .subtract(timeElapsed, "seconds")
            .format("hh:*mm:ss")}
        </span>
        <span className="label label-name">{name}</span>
      </div>
    </div>
  );

  return { Countdown, isActive, setIsActive, timeElapsed, setTimeElapsed };
};

import { camelCase } from "./function/camelCase";

/**
 * @param {string} name - labels input
 * @param {any} defaultValue - default value in input
 * @param {boolean} defaultDisabled - disables input when true
 */
const useInput = (name, defaultValue, defaultDisabled) => {
  const [value, setValue] = useState(defaultValue);
  const [isDisabled, setisDisabled] = useState(defaultDisabled);

  const id = camelCase(name);

  const inputChange = (e) => setValue(e.target.value);

  const Input = () => (
    <div className="inputOption">
      <input
        type="number"
        name={id}
        id={id}
        min="0"
        value={value}
        onChange={inputChange}
        disabled={isDisabled}
      />
      <label htmlFor={id}>{name}</label>
    </div>
  );

  return { Input, value, setValue, setisDisabled };
};

export const Timer = () => {
  /** @type {Array<Phase>}} */
  const defaultPhases = [
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
  ];
  const [phases, setPhases] = useState(defaultPhases);

  const { Countdown } = useCountdown(
    phases[0].name,
    phases[0].duration,
    phases[0].color
  );

  return (
    <div>
      <Countdown />
    </div>
  );
};
