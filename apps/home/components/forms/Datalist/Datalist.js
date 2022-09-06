import { useEffect, useState } from "react";
import styles from "./Datalist.module.css";

// givenOptions = [
//     optionA, optionB
// ]

/**
 *
 * @param {Object} props
 * @param {import("react-hook-form").UseFormRegisterReturn} props.r
 * @param {Array<String>} props.options
 * @param {String} [props.id]
 * @param {String} [props.placeholder]
 * @param {Boolean} [props.noDefaultStyles]
 * @param {String} [props.ClassName]
 * @param {String} [props.ContainerClassName]
 * @param {Function} [props.onChange]
 * @param {Function} [props.onFocus]
 * @returns
 */
const Datalist = ({
  r,
  options,
  id,
  placeholder,
  noDefaultStyles,
  ClassName,
  ContainerClassName,
  onChange,
  onFocus,
}) => {
  let [recommendations, setRecommendation] = useState([]);

  useEffect(() => {
    let temp = options.map((option) => {
      return <option key={option} value={option}></option>;
    });
    setRecommendation(temp);
  }, []);

  return (
    <div
      className={`${
        !noDefaultStyles ? styles.inputDatalistContainer : ""
      } ${ContainerClassName}`}
    >
      <input
        id={id}
        className={`${
          !noDefaultStyles ? styles.inputDatalist : ""
        } ${ClassName}`}
        type="datalist"
        {...r}
        list={`_${id}`}
        placeholder={placeholder ? placeholder : "Suggestions available . . ."}
        onChange={onChange}
        onFocus={onFocus}
      />
      <datalist id={`_${id}`}>{recommendations}</datalist>
    </div>
  );
};

export default Datalist;
