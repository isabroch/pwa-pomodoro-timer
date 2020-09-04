import React, { useState, useEffect, useRef } from "react";
import { css } from "@emotion/core";
import { FaRegTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const styles = {
  container: css`
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    margin: 10px;
    padding: 10px;
    background: #fafafa;
    outline: 1px solid rgba(0, 0, 0, 0.5);
    outline-offset: -7.5px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3),
      2px 5px 10px 1px rgba(0, 0, 0, 0.1);
    width: 90%;
    font-size: 1.1rem;
    max-width: 25ch;
    border-radius: 2px;

    > p {
      margin: 10px;
    }
  `,
  close: css`
    border: none;
    background: none;
    font-size: inherit;
    float: right;
    margin: 7px 4px 4px;
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
  button: css`
    width: calc(100% - 10px);
    clear: both;
    text-align: center;
    padding: 10px;
    margin: 5px;
  `,
  message: css`
    font-size: 0.8em;
    color: gray;
  `,
};

// CUSTOM HOOKS
export const useNotifications = () => {
  const [wantsNotifications, setWantsNotifications] = useState(
    Notification.permission === "granted"
  );

  const [notificationReply, setNotificationReply] = useState(null);

  const [toast, setToast] = useState(null);

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
      setNotificationReply(null);
    }

    return (
      <motion.div
        initial={{ opacity: 0, top: 10 }}
        animate={{ opacity: 1, top: 0 }}
        exit={{ opacity: 0, top: -10 }}
        css={styles.container}
      >
        <button onClick={close} css={styles.close}>
          <FaRegTimesCircle />
        </button>

        <p>{toast.title}</p>

        {toast.message && <p css={styles.message}>{toast.message}</p>}

        {toast.action && (
          <button
            css={styles.button}
            onClick={() => {
              toast.action.callback();
            }}
          >
            {toast.action.title}
          </button>
        )}
      </motion.div>
    );
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
    setToast,
    toast,
  };
};
