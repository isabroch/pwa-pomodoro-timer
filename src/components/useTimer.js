import { useState, useEffect } from "react";
// speed of clocks
const speed = 1;
export const useTimer = (secondsDuration, timerEndCallback) => {

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(secondsDuration);

  function onTimerEnd() {
    setIsActive(false);
    timerEndCallback();
  }

  useEffect(() => {
    setSecondsRemaining(secondsDuration - secondsElapsed);
  }, [secondsElapsed, secondsDuration]);

  useEffect(() => {
    let timer = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsElapsed((secondsElapsedPrev) => {
          // increase secondsElapsed every tick
          // stop timer when newElapsed = duration, and run callback
          if (secondsElapsedPrev >= secondsDuration) {
            onTimerEnd();
            return secondsElapsedPrev;
          }

          return secondsElapsedPrev + 1;
        });
      }, speed);
    }
    else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isActive, secondsDuration]);

  return {
    secondsElapsed,
    setSecondsElapsed,
    isActive,
    setIsActive,
    secondsDuration,
    secondsRemaining,
    setSecondsRemaining,
  };
};
