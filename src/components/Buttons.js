import React from "react";
import { css } from "@emotion/core";
export const Buttons = ({
  timer: { secondsRemaining, setSecondsElapsed, setIsActive, isActive },
  goToNextPhase, }) => {
  const style = {
    buttons: css`
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
    `,
    button: {
      base: css`
        margin: 5px;
        font-size: 1rem;
        padding: 5px 0;
        box-sizing: border-box;
        max-width: 100%;
      `,
      primary: css`
        flex-grow: 5;
        flex-basis: 30ch;
      `,
      secondary: css`
        flex-grow: 1;
        flex-basis: 10ch;
      `,
    },
  };

  let mainAction = "Start";
  if (secondsRemaining === 0) {
    mainAction = "Next Phase";
  }
  if (isActive) {
    mainAction = "Pause";
  }

  return (
    <div css={style.buttons}>
      <button
        css={[style.button.base, style.button.primary]}
        onClick={() => {
          if (secondsRemaining === 0) {
            goToNextPhase();
            setSecondsElapsed(0);
          }

          setIsActive((isActive) => !isActive);
        }}
      >
        {mainAction}
      </button>
      <button
        css={[style.button.base, style.button.secondary]}
        onClick={() => {
          setIsActive(false);
          setSecondsElapsed(0);
          goToNextPhase();
        }}
      >
        Skip
      </button>
      <button
        css={[style.button.base, style.button.secondary]}
        onClick={() => {
          setIsActive(false);
          setSecondsElapsed(0);
        }}
      >
        Reset
      </button>
    </div>
  );
};
