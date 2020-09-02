import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { css } from "@emotion/core";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { motion } from "framer-motion";

import { PomodoroTimer } from "./PomodoroTimer";

const App = () => <PomodoroTimer />;
render(<App />, document.getElementById("app"));
