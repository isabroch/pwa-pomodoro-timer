import { useState, useReducer } from "react";
export const usePhases = () => {
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
    setCurrentPhaseID((prevPhase) => prevPhase === phases.length - 1 ? 0 : prevPhase + 1
    );
  };

  const nextPhase = phases[currentPhaseID === phases.length - 1 ? 0 : currentPhaseID + 1];

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
