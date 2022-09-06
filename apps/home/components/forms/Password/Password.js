import styles from "./Password.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.id]
 * @param {String} [Details.placeholder]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Detials.noDefaultStyles]
 * @param {Boolean} [Details.readonly]
 * @param {String} [Details.value]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */
const Password = ({
  r,
  id,
  placeholder,
  ClassName,
  noDefaultStyles,
  readonly,
  value,
  onChange,
  onFocus,
}) => {
  return (
    <input
      {...r}
      type="password"
      id={id}
      value={value}
      className={`${ClassName} ${!noDefaultStyles ? styles.inputPassword : ""}`}
      placeholder={placeholder ? placeholder : "Password"}
      readOnly={readonly}
      onChange={onChange}
      onFocus={onFocus}
    ></input>
  );
};

export default Password;
