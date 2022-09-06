import { useEffect, useState } from "react";
import styles from "./Checkbox.module.css";
/**
 *
 * @param {Object} details
 * @param {import("react-hook-form").UseFormRegisterReturn} details.register
 * @param {Object} details.details
 * @param {String} details.details.name
 * @param {String} details.details.display
 * @param {import("react-hook-form").RegisterOptions} [details.requirements]
 * @param {*} [details.readOnlyValue]
 * @param {String} [details.ClassName]
 * @param {String} [details.ContainerClassName]
 * @param {Boolean} [details.noDefaultStyles]
 * @param {String} [details.labelClassName]
 * @param {Boolean} [details.BoxAfterLabel]
 * @param {Function} [details.onChange]
 * @param {Function} [details.onFocus]
 * @returns
 */
const Checkbox = ({
  register,
  details,
  requirements,
  readOnlyValue,
  ClassName,
  ContainerClassName,
  noDefaultStyles,
  labelClassName,
  boxAfterLabel,
  onChange,
  onFocus,
}) => {
  const [content, setContent] = useState(null);
  if (!register) return console.log("[ERROR] Register parameter is needed.");
  useEffect(() => {
    if (readOnlyValue === "undefined" || readOnlyValue === null) {
      if (!boxAfterLabel || boxAfterLabel === "false") {
        // box comes before the label
        const temp = (
          <>
            <input
              id={details.name}
              key={details.name}
              type="checkbox"
              {...register(details.name, requirements ? requirements : null)}
              className={`${ClassName} ${
                noDefaultStyles ? styles.inputCheckbox : ""
              }`}
              onChange={onChange}
              onFocus={onFocus}
            />
            <label className={labelClassName} htmlFor={details.name}>
              {details.display}
            </label>
          </>
        );
        setContent(temp);
      } else {
        // box comes after the label
        const temp = (
          <>
            <label className={labelClassName} htmlFor={details.name}>
              {details.display}
            </label>
            <input
              id={details.name}
              key={details.name}
              type="checkbox"
              {...register(option.name, requirements ? requirements : null)}
              className={`${ClassName} ${
                noDefaultStyles ? styles.inputCheckbox : ""
              }`}
            />
          </>
        );
        setContent(temp);
      }
    } else {
      // readonly value is provided
      let temp = (
        <>
          <input
            id={details.name}
            key={details.name}
            type="checkbox"
            {...register(details.name, requirements ? requirements : null)}
            className={`${ClassName} ${
              noDefaultStyles ? styles.inputCheckbox : ""
            }`}
            checked={readOnlyValue}
          />
          <label className={labelClassName} htmlFor={details.name}>
            {details.display}
          </label>
        </>
      );
      setContent(temp);
    }
  }, [register]);

  return (
    <div
      className={`${ContainerClassName} ${
        !noDefaultStyles ? styles.Container : ""
      } ${boxAfterLabel ? styles.boxAfter : styles.boxBefore}`}
    >
      {content}
    </div>
  );
};

export default Checkbox;
