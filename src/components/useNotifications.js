import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import { FaRegTimesCircle } from "react-icons/fa";
// CUSTOM HOOKS
export const useNotifications = () => {
  const [wantsNotifications, setWantsNotifications] = useState(
    Notification.permission === "granted"
  );

  const [notificationReply, setNotificationReply] = useState(null);

  const [toast, setToast] = useState({message: "Hello! This is a very long message to show that it can be long! <3", action: {title: "DO THING", callback: () => setNotificationReply("startNext")}});

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

  const NotificationToast = () => {
    function close() {
      setToast(null);
    }

    const styles = {
      container: css`
      position: fixed;
      top: 0;
      right: 0;
      margin: 10px;
      padding: 10px;
      background: #fafafa;
      outline: 1px solid rgba(0,0,0,0.5);
      outline-offset: -7.5px;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3), 2px 5px 10px 1px rgba(0, 0, 0, 0.1);
      width: 90%;
      font-size: 1.25rem;
      max-width: 25ch;
      border-radius: 2px;

      > * {
        padding: 10px;
        margin: 5px;
      }
    `,
    close: css`
      border: none;
      background: none;
      font-size: inherit;
      float: right;
      margin-top: 7px;
      padding: 0;
      border-radius: 100%;
      border: 3px solid transparent;
      transition: background 0.5s;

      &:hover {
        background: lightgray;
      }

      &:focus {
        background: gray;
        outline: none;
      }

      svg {
        /* remove space beneath */
        display: block;
      }
    `,
    button: css `
    width: calc(100% - 10px);
    clear: both;
    text-align: center;
    margin-top: -5px;
    `
    }

    if (toast !== null)
      return (
        <div
          css={styles.container}
        >
          <button onClick={close} css={styles.close}>
            <FaRegTimesCircle />
          </button>
          <p>{toast.message}</p>
          {toast.action && <button css={styles.button} onClick={()=>{toast.action.callback(); close();}}>{toast.action.title}</button>}
        </div>
      );

    return null;
  };

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
    NotificationToast,
    NotificationCheckbox,
    sendNotification,
    wantsNotifications,
    setWantsNotifications,
    notificationReply,
    setNotificationReply,
    setToast
  };
};
