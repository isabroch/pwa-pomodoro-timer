import React, { useState, useEffect, useReducer } from "react";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion } from "framer-motion";

import { camelCase } from "./function/camelCase";

// initialize duration formatting plugin for moment library
momentDurationFormatSetup(moment);

// speed of clocks
const speed = 1;


// CUSTOM HOOKS
const useNotifications = () => {
  const [wantsNotifications, setWantsNotifications] = useState(
    Notification.permission === "granted"
  );

  const [notificationReply, setNotificationReply] = useState(null);

  useEffect(() => {
    function handleMessage(e) {
      setNotificationReply(e.data);
    }
    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  async function handleNotificationSubscription() {
    // Request permission to send notifications to user
    Notification.requestPermission().then((response) => {
      switch (response) {
        case "denied":
          alert(
            "Notifications are blocked by your browser! We cannot send you any notifications until you unblock them."
          );
          setWantsNotifications(false);
          break;

        default:
          setWantsNotifications((state) => !state);
          break;
      }
    });
  }

  const NotificationCheckbox = () => (
    <label
      css={css`
        display: flex;
        margin: 0.75em;
        justify-content: center;
      `}
    >
      <input
        css={css`
          margin-right: 1ch;
        `}
        type="checkbox"
        id="wantsNotification"
        name="wantsNotification"
        checked={wantsNotifications}
        onChange={handleNotificationSubscription}
      />
      <span>Notify me when timer ends!</span>
    </label>
  );

  async function sendNotification(title = "Notification!", options = null) {
    let sw = await navigator.serviceWorker.getRegistration();
    if (wantsNotifications) {
      // if sw exists, send notification using sw!
      if (sw) {
        sw.showNotification(title, options);
        return;
      }

      // delete actions if sending non-sw notification, send browser notif
      if (options.actions) {
        delete options.actions;
      }
      return new Notification(title, options);
    }

    console.log("User does not want notifications");
  }

  return {
    NotificationCheckbox,
    sendNotification,
    wantsNotifications,
    setWantsNotifications,
    notificationReply,
    setNotificationReply,
  };
};

const useTimer = (secondsDuration, timerEndCallback) => {

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
    } else {
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

const usePhases = () => {
  const defaultPhases = [
    {
      id: 0,
      name: "Work",
      duration: 1,
      color: "red",
    },
    {
      id: 1,
      name: "Break",
      duration: 5,
      color: "orange",
    },
  ];

  function reducerPhases(phases, { action, id, field, value }) {
    switch (action) {
      case "UPDATE":
        return phases.map((phase) => {
          if (phase.id === id) {
            phase[field] = value;
          }
          return phase;
        });
      default:
        return phases;
    }
  }

  const [phases, dispatchPhases] = useReducer(reducerPhases, defaultPhases);
  const [currentPhaseID, setCurrentPhaseID] = useState(0);

  const goToNextPhase = () => {
    setCurrentPhaseID((prevPhase) =>
      prevPhase === phases.length - 1 ? 0 : prevPhase + 1
    );
  };

  const nextPhase =
    phases[currentPhaseID === phases.length - 1 ? 0 : currentPhaseID + 1];

  const currentPhase = phases[currentPhaseID];

  return {
    phases,
    dispatchPhases,
    currentPhaseID,
    setCurrentPhaseID,
    goToNextPhase,
    nextPhase,
    currentPhase,
  };
};

// SUB-COMPONENTS
const Input = ({ name, defaultValue, isDisabled, changeCallback }) => {
  const [value, setValue] = useState(defaultValue);
  const id = camelCase(name);

  const changeValue = (e) => {
    const updateValue = parseInt(e.target.value || 1);
    setValue(updateValue);
    changeCallback(updateValue);
  };

  const styles = {
    container: css`
      display: flex;
      flex-direction: column;
      flex: 0 1 10ch;
      margin: 5px 10px;
      align-items: center;
    `,
    input: css`
      width: 100%;
    `,
    label: css`
      font-family: sans-serif;
      line-height: 200%;
    `,
  };

  return (
    <div css={styles.container}>
      <input
        css={styles.input}
        type="number"
        name={id}
        id={id}
        min="1"
        value={value || 1}
        onChange={changeValue}
        disabled={isDisabled}
      />
      <label css={styles.label} htmlFor={id}>
        {name}
      </label>
    </div>
  );
};

const Inputs = ({
  phases: { phases, currentPhase, dispatchPhases },
  timer: { setIsActive, isActive },
}) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-evenly;
      `}
    >
      {phases.map((phase) => (
        <Input
          key={phase.id}
          name={phase.name}
          defaultValue={phase.duration}
          isDisabled={currentPhase.id === phase.id && isActive}
          changeCallback={(valueNew) => {
            dispatchPhases({
              action: "UPDATE",
              id: phase.id,
              field: "duration",
              value: valueNew,
            });
          }}
        />
      ))}
    </div>
  );
};

// duration & timeElapsed are integers representing a duration in seconds
const Countdown = ({
  name,
  color = "red",
  timer: { secondsElapsed, secondsDuration, secondsRemaining },
}) => {
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
            r="45"
          />
          <motion.path
            css={styles.timeElapsed}
            d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: Math.max(secondsElapsed / secondsDuration || 0, 0),
            }}
          />
        </g>
      </svg>
      <div css={[styles.labels, styles.absolutePosition]}>
        <div>{timeRemaining}</div>
        <div>{name}</div>
      </div>
    </div>
  );
};

const Buttons = ({
  timer: { secondsRemaining, setSecondsElapsed, setIsActive, isActive },
  goToNextPhase,
}) => {
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

// MAIN COMPONENT

export const PomodoroTimer = () => {
  const {
    NotificationCheckbox,
    sendNotification,
    notificationReply,
    setNotificationReply,
  } = useNotifications();
  const phases = usePhases();
  const timer = useTimer(phases.currentPhase.duration * 60, endTimer);

  function endTimer() {
    const title = `${phases.currentPhase.name} time has ended!`;
    const options = {
      tag: "renotify",
      renotify: true,
      data: phases.currentPhaseID,
      actions: [
        { action: "startNext", title: `Start ${phases.nextPhase.name}` },
      ],
    };
    try {
      sendNotification(title, options);
    } catch (error) {
      console.error("Notification could not be sent", error);
    }
  }

  useEffect(() => {
    switch (notificationReply) {
      case "startNext":
        phases.goToNextPhase();
        timer.setSecondsElapsed(0);
        timer.setIsActive(true);
        setNotificationReply(null);
        break;

      default:
        break;
    }
  }, [notificationReply]);

  return (
    <div
      css={css`
        max-width: 300px;
        margin: auto;
      `}
    >
      <Inputs timer={timer} phases={phases} />

      <Countdown
        name={phases.currentPhase.name}
        color={phases.currentPhase.color}
        timer={timer}
        onTimerEnd={sendNotification}
      />

      <NotificationCheckbox />

      <Buttons timer={timer} goToNextPhase={phases.goToNextPhase} />
    </div>
  );
};
