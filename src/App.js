import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion } from "framer-motion";

import { PomodoroTimer } from "./PomodoroTimer";

// Inititate service worker
// store registration data for push notifs
let registration = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async function () {
    try {
      registration = await navigator.serviceWorker.register("/sw.js");
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
  </div>
);
render(<App />, document.getElementById("app"));
