import React, { useEffect, useState } from "react";
import styles from "./Select.module.css";

/**
 * @param {Object} props
 * @param {import("react-hook-form").UseFormRegisterReturn} props.r
 * @param {String} props.id
 * @param {Array<{display, value}>} props.options
 * @param {number} props.visibleSize
 * @param {Boolean} props.noDefaultStyles
 * @param {String} props.ClassName
 * @param {Function} props.onChange
 * @param {Function} props.onFocus
 * @param {React.Ref} props.ref
 * @returns
 */

const Select = ({
  r,
  id,
  visibleSize,
  options,
  noDefaultStyles,
  styling,
  ClassName,
  onChange,
  onFocus,
  prefillValue,
}) => {
  let [choices, setChoices] = useState([]);
  let temp = [];

  // Distribute options items to array of JSX in "options" state
  useEffect(() => {
    if (choices.length === 0) {
      options?.forEach((option) => {
        let newOption = (
          <option
            key={option.value}
            selected={
              prefillValue
                ? prefillValue == option.value
                  ? true
                  : false
                : option.selected
                ? true
                : false
            }
            value={option.value}
          >
            {option.display}
          </option>
        );
        temp.push(newOption);
      });
      setChoices(temp);
    }
  }, []);

  return (
    <select
      {...r}
      style={styling}
      id={id}
      className={`${!noDefaultStyles ? styles.inputSelect : ""} ${ClassName}`}
      size={visibleSize}
      onChange={onChange}
      onFocus={onFocus}
    >
      {choices}
    </select>
  );
};

export default Select;
