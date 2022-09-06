import styles from "./Tel.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.id]
 * @param {String} [Details.placeholder]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */
const Tel = ({
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
      type="tel"
      {...r}
      id={id}
      className={`${!noDefaultStyles ? styles.inputTel : ""} ${ClassName}`}
      placeholder={placeholder ? placeholder : "01234567899"}
      pattern={/^[0-9]*$/i}
      onChange={onChange}
      onFocus={onFocus}
    ></input>
  );
};

export default Tel;
