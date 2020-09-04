import React, { useEffect, useState } from "react";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

import { useTimer } from "./useTimer";
import { usePhases } from "./usePhases";
import { Inputs } from "./Inputs";
import { Countdown } from "./Countdown";
import { Buttons } from "./Buttons";
import { randQuote } from "./useQuote";

// initialize duration formatting plugin for moment library
momentDurationFormatSetup(moment);

// MAIN COMPONENT
export const PomodoroTimer = ({ notifications }) => {
  const {
    NotificationCheckbox,
    NotificationToast,
    sendNotification,
    notificationReply,
    setNotificationReply,
    setToast,
    toast,
  } = notifications;
  const phases = usePhases();
  const timer = useTimer(phases.currentPhase.duration, endTimer);

  const [quote, setQuote] = useState({});

  function endTimer() {
    const title = `${phases.currentPhase.name} time has ended!`;
    const message = (
      <span>
        {quote.text}
        <span
          css={css`
            white-space: nowrap;
          `}
        >
          {" "}
          — {quote.author}{" "}
        </span>
      </span>
    );
    const options = {
      tag: "renotify",
      renotify: true,
      vibrate: [200, 100, 200, 100, 500],
      data: phases.currentPhaseID,
      actions: [
        { action: "startNext", title: `Start ${phases.nextPhase.name}` },
      ],
    };
    try {
      // TODO: Trigger nextphase action, currently getting warning Warning: Cannot update a component (`App`) while rendering a different component (`PomodoroTimer`). To locate the bad setState() call inside `PomodoroTimer`, follow the stack trace as described in https://fb.me/setstate-in-render
      setToast({
        title,
        message,
        action: {
          title: `Start ${phases.nextPhase.name}`,
          callback: () => setNotificationReply("startNext"),
        },
      });
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
        setToast(null);
        setNotificationReply(null);
        break;

      default:
        break;
    }
  }, [notificationReply]);

  useEffect(() => {
    randQuote().then((quoteData) => setQuote(quoteData));
  }, [toast]);

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
