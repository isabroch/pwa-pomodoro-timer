import React from "react";
import { css } from "@emotion/core";
import moment from "moment";
import { motion } from "framer-motion";
// duration & timeElapsed are integers representing a duration in seconds
export const Countdown = ({
  name,
  color = "red",
  timer: { secondsElapsed, secondsDuration, secondsRemaining }, }) => {
  const timeRemaining = moment
    .duration(secondsRemaining, "seconds")
    .format("hh:*mm:ss");

  const strokeWidth = 3;

  const styles = {
    container: css`
      width: 100%;
      height: 0;
      margin: 1em 0;
      position: relative;
      padding-top: 100%;
    `,
    absolutePosition: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `,
    labels: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 2rem;
    `,
    circle: css`
      fill: none;
      stroke: none;
    `,
    timeTotal: css`
      stroke-width: ${strokeWidth}px;
      transition: stroke 0.2s ease;
    `,
    timeElapsed: css`
      stroke-width: ${strokeWidth}.5px;
      stroke: #e9e9e9;
      transform-origin: center;
      transform: rotate(90deg);
    `,
  };

  return (
    <div css={styles.container}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        css={styles.absolutePosition}
      >
        <g css={styles.circle}>
          <motion.circle
            css={styles.timeTotal}
            style={{ stroke: color }}
            cx="50"
            cy="50"
            r="45" />
          <motion.path
            css={styles.timeElapsed}
            d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: Math.max(secondsElapsed / secondsDuration || 0, 0),
            }} />
        </g>
      </svg>
      <div css={[styles.labels, styles.absolutePosition]}>
        <div>{timeRemaining}</div>
        <div>{name}</div>
      </div>
    </div>
  );
};
