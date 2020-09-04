import React, { useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import { PomodoroTimer } from "./components/PomodoroTimer";
import { Install } from "./components/Install";
import { useNotifications } from "./components/useNotifications";

// Inititate service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async function () {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js");
      console.log(`Created service worker with scope: ${registration.scope}`);
    } catch (error) {
      console.error(`Failed to create service worker: ${error}`);
    }
  });
}

// PORTAL
const Portal = ({ mount, children }) => {
  const el = document.createElement("div");

  useEffect(() => {
    mount.appendChild(el);
    return () => {
      mount.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
};

const App = () => {
  const notifications = useNotifications();

  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: 1fr;
        height: 100vh;
      `}
    >
      <AnimatePresence>
        {notifications.toast && (
          <Portal mount={document.querySelector("#notifications")}>
            <notifications.NotificationToast />
          </Portal>
        )}
      </AnimatePresence>
      <PomodoroTimer notifications={notifications} />
      <Install
        css={css`
          position: fixed;
          bottom: 0;
          right: 0;
        `}
      />
    </div>
  );
};
render(<App />, document.getElementById("app"));
