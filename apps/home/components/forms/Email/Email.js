import styles from "./Email.module.css";

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
const Email = ({
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
      type="email"
      id={id}
      className={`${ClassName} ${!noDefaultStyles ? styles.inputEmail : ""}`}
      placeholder={placeholder ? placeholder : "example@email.com"}
      onChange={onChange}
      onFocus={onFocus}
    ></input>
  );
};

export default Email;
