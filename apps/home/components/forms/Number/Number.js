import styles from "./Number.module.css";

/**
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.id]
 * @param {String} [Details.placeholder]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Number} [Details.defaultValue]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */

const Number = ({
  r,
  id,
  styling,
  placeholder,
  ClassName,
  noDefaultStyles,
  defaultValue,
  onChange,
  onFocus,
  disabled,
  min,
  max,
  step,
}) => {
  return (
    <input
      {...r}
      type="number"
      style={styling}
      id={id}
      defaultValue={defaultValue}
      className={`${!noDefaultStyles ? `${styles.inputNumber}` : ""} ${
        !noDefaultStyles && disabled ? `${styles.disable}` : ""
      } ${ClassName}`}
      placeholder={placeholder ? placeholder : "Number here"}
      onChange={onChange}
      onFocus={onFocus}
      disabled={disabled}
      min={min}
      max={max}
      step={step ?? 1}
    ></input>
  );
};

export default Number;
