import styles from "./Text.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.id]
 * @param {String} [Details.placeholder]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Boolean} [Details.readonly]
 * @param {String || Number} [Details.value]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */

const Text = ({
  r,
  id,
  placeholder,
  ClassName,
  styling,
  noDefaultStyles,
  readonly,
  value,
  onChange,
  onFocus,
  required,
}) => {
  return (
    <input
      {...r}
      id={id}
      style={styling}
      defaultValue={value}
      className={`${!noDefaultStyles ? styles.inputText : ""} ${ClassName} `}
      placeholder={placeholder ? placeholder : "Text"}
      readOnly={readonly}
      onChange={onChange}
      onFocus={onFocus}
      required={required}
    ></input>
  );
};

export default Text;
