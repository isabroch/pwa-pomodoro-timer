import React, { useState } from "react";
import { css } from "@emotion/core";
import { camelCase } from "../function/camelCase";
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
        disabled={isDisabled} />
      <label css={styles.label} htmlFor={id}>
        {name}
      </label>
    </div>
  );
};
export const Inputs = ({
  phases: { phases, currentPhase, dispatchPhases },
  timer: { setIsActive, isActive }, }) => {
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
          }} />
      ))}
    </div>
  );
};
