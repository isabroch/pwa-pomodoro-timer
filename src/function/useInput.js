import React, { useState } from "react";
import { camelCase } from "./camelCase";

/**
 * @param {string} name - labels input
 * @param {any} defaultState - default value in input
 * @param {boolean} isDisabled - disables input when true
 */
export const useInput = (name, defaultState, isDisabled) => {
  const [state, updateState] = useState(defaultState);

  const id = camelCase(name);

  const inputChange = (e) => updateState(e.target.value);

  const Input = () => (
    <div className="inputOption">
      <input
        type="number"
        name={id}
        id={id}
        min="0"
        value={state}
        onChange={inputChange}
        disabled={isDisabled}
      />
      <label htmlFor={id}>{name}</label>
    </div>
  );

  return [Input, state, useState];
};
