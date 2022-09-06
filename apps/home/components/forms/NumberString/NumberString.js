import styles from "./NumberString.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.id]
 * @param {String} [Details.placeholder]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Function} [Detials.onChange]
 * @param {Function} [Detials.onFocus]
 * @returns
 */

const NumberString = ({
  r,
  id,
  placeholder,
  ClassName,
  noDefaultStyles,
  onChange,
  onFocus,
}) => {
  return (
    <input
      {...r}
      type="tel"
      id={id}
      className={`${
        !noDefaultStyles ? styles.inputNumberString : ""
      } ${ClassName}`}
      placeholder={placeholder ? placeholder : "Number Only"}
      pattern="^\d+$"
      onChange={onChange}
      onFocusc={onFocus}
    ></input>
  );
};

export default NumberString;
