import React from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";

import { PomodoroTimer } from "./PomodoroTimer";
import { Install } from "./Install";

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

const App = () => (
  <div
    css={css`
      display: grid;
      grid-template-rows: 1fr;
      height: 100vh;
    `}
  >
    <PomodoroTimer />
    <Install
      css={css`
        position: fixed;
        bottom: 0;
        right: 0;
      `}
    />
  </div>
);
render(<App />, document.getElementById("app"));
