import styles from "./Radiogroup.module.css";
import { useState } from "react";
import { useEffect } from "react";

/**
 *
 * @param {Object} props
 * @param {import("react-hook-form").UseFormRegisterReturn} props.r
 * @param {String} props.id
 * @param {Array<{display, value}>} props.options
 * @param {String} props.ContainerClassName
 * @param {String} props.innerContainerClassName
 * @param {String} props.LabelClassName
 * @param {String} props.ClassName
 * @param {Boolean} props.noDefaultStyles
 * @param {Function} props.onChange
 * @param {Function} props.onFocus
 * @returns
 */

const Radiogroup = ({
  r,
  id,
  options,
  ContainerClassName,
  innerContainerClassName,
  LabelClassname,
  ClassName,
  noDefaultStyles,
  onChange,
  onFocus,
}) => {
  const [radioGroup, setRadiogroup] = useState([]);

  // When defaultValues updates check the correct corresponding box
  useEffect(() => {
    setRadiogroup([]);
    let placeholder = [];
    options.forEach((option) => {
      let isChecked = false;
      let radio = (
        <div
          id={id}
          key={option.value}
          className={`${
            !noDefaultStyles ? styles.radioGroup : ""
          } ${innerContainerClassName}`}
        >
          <input
            id={option.display}
            type="radio"
            {...r}
            value={option.value}
            className={`${ClassName} ${
              !noDefaultStyles ? styles.radioElement : ""
            }`}
            onChange={onChange}
            onFocus={onFocus}
          />
          <label
            className={`${LabelClassname} ${
              !noDefaultStyles ? styles.label : ""
            }`}
            htmlFor={option.display}
          >
            {option.display}
          </label>
        </div>
      );
      placeholder.push(radio);
    });
    setRadiogroup(placeholder);
  }, [options]);

  // Radiogroup setup

  return (
    <div
      className={`${
        !noDefaultStyles ? styles.radioGroup : ""
      } ${ContainerClassName}`}
      id={id}
    >
      {radioGroup}
    </div>
  );
};

export default Radiogroup;
