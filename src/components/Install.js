import { css } from "@emotion/core";
import { useEffect, useState } from "react";

const useInstallPrompt = () => {
  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    function interceptInstall(e) {
      // prevent browser default install ui
      // store event for triggering later
      e.preventDefault();
      setPrompt(e);
      setShowPrompt(true);
    }

    window.addEventListener("beforeinstallprompt", interceptInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", interceptInstall);
    };
  }, []);

  const installPrompt = async () => {
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      return;
    }

    throw new Error(
      "Cannot install before browser fires 'beforeinstallprompt' event"
    );
  };

  return { prompt, installPrompt, showPrompt };
};

export const Install = ({ className }) => {
  const { installPrompt, showPrompt } = useInstallPrompt();

  if (showPrompt)
    return (
      <button
        className={className}
        css={css`
          padding: 10px;
          border: #373ca6;
          background: #3740ff;
          color: white;
          margin: 10px;
          cursor: pointer;
        `}
        onClick={(e) => {
          e.preventDefault;
          installPrompt();
        }}
      >
        Install
      </button>
    );

  return null;
};
