import styles from "./Date.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").useFormRegisterReturn} Details.r
 * @param {String} [Details.id]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */
const Date = ({ r, id, ClassName, noDefaultStyles, onChange, onFocus }) => {
  return (
    <input
      type="date"
      {...r}
      id={id}
      className={`${!noDefaultStyles ? styles.inputDate : ""} ${ClassName}`}
      onChange={onChange}
      onFocus={onFocus}
    ></input>
  );
};

export default Date;
