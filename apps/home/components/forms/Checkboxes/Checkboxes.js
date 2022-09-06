import { useEffect, useLayoutEffect, useState } from "react";
import styles from "./Checkboxes.module.css";

// givenOptions = [{
//     display,
//     name
// },{
//     display,
//     name
// }]

/**
 *
 * @param {Object} details
 * @param {import("react-hook-form").UseFormRegisterReturn} details.register
 * @param {String} details.name
 * @param {Object[]} details.options
 * @param {String} details.options[].name
 * @param {String} details.options[].display
 * @param {import("react-hook-form").RegisterOptions} [details.requirements]
 * @param {Object[]} [details.readOnlyValues]
 * @param {String} [details.readOnlyValues.name]
 * @param {String} [details.readOnlyValues.display]
 * @param {String} [details.readOnlyValues.value]
 * @param {String} [details.ClassName]
 * @param {String} [details.ContainerClassName]
 * @param {String} [details.innerContainerClassName]
 * @param {String} [details.labelClassName]
 * @param {Boolean} [details.noDefaultStyles]
 * @param {Boolean} [details.boxAfterLabel]
 * @param {Function} [details.onChange]
 * @param {Function} [details.onFocus]
 * @returns
 */
const Checkboxes = ({
  register,
  name,
  options,
  requirements,
  readOnlyValues,
  ClassName,
  ContainerClassName,
  innerContainerClassName,
  labelClassName,
  noDefaultStyles,
  boxAfterLabel,
  onChange,
  onFocus,
}) => {
  let [checkboxes, setCheckboxes] = useState();
  if (!register) return console.log("[ERROR] Register parameter is needed.");
  let tempArray = [];
  useEffect(() => {
    if (readOnlyValues === "undefined" || readOnlyValues == null) {
      if (!boxAfterLabel || boxAfterLabel === "false") {
        // box comes before the label
        options.forEach((option) => {
          const temp = (
            <>
              <div
                className={`${innerContainerClassName} ${
                  !noDefaultStyles ? styles.innerContainer : ""
                }
                ${boxAfterLabel ? styles.boxAfter : styles.boxBefore}
                `}
                key={`${option.name}-innerContainer`}
              >
                <input
                  id={option.name}
                  key={option.name}
                  type="checkbox"
                  {...register(
                    `${name}.${option.name}`,
                    requirements ? requirements : null
                  )}
                  className={`${ClassName} ${
                    noDefaultStyles ? styles.inputCheckbox : ""
                  }`}
                  onChange={onChange}
                  onFocus={onFocus}
                />
                <label className={`${labelClassName}`} htmlFor={option.name}>
                  {option.display}
                </label>
              </div>
            </>
          );
          tempArray.push(temp);
        });
      } else {
        // box comes after the label
        options.forEach((option) => {
          const temp = (
            <>
              <div
                className={`${innerContainerClassName} ${
                  !noDefaultStyles ? styles.innerContainer : ""
                }
                ${boxAfterLabel ? styles.boxAfter : styles.boxBefore}
                `}
                key={`${option.name}-innerContainer`}
              >
                <label className={`${labelClassName}`} htmlFor={option.name}>
                  {option.display}
                </label>
                <input
                  id={option.name}
                  key={option.name}
                  type="checkbox"
                  {...register(
                    `${name}.${option.name}`,
                    requirements ? requirements : null
                  )}
                  className={`${ClassName} ${
                    noDefaultStyles ? styles.inputCheckbox : ""
                  }`}
                />
              </div>
            </>
          );
          tempArray.push(temp);
        });
      }
    } else {
      // readonly activated
      if (!boxAfterLabel || boxAfterLabel === "false") {
        // box comes before the label
        readOnlyValues.forEach((option) => {
          const temp = (
            <>
              <div
                className={`${innerContainerClassName} ${
                  !noDefaultStyles ? styles.innerContainer : ""
                }
                ${boxAfterLabel ? styles.boxAfter : styles.boxBefore}
                `}
                key={`${option.name}-innerContainer`}
              >
                <input
                  id={option.name}
                  key={option.name}
                  type="checkbox"
                  {...register(
                    `${name}.${option.name}`,
                    requirements ? requirements : null
                  )}
                  className={`${ClassName} ${
                    noDefaultStyles ? styles.inputCheckbox : ""
                  }`}
                  checked={option.value}
                />
                <label className={`${labelClassName}`} htmlFor={option.name}>
                  {option.display}
                </label>
              </div>
            </>
          );
          tempArray.push(temp);
        });
      } else {
        // box comes after the label
        readOnlyValues.forEach((option) => {
          const temp = (
            <>
              <div
                className={`${innerContainerClassName} ${
                  !noDefaultStyles ? styles.innerContainer : ""
                }
                ${boxAfterLabel ? styles.boxAfter : styles.boxBefore}
                `}
                key={`${option.name}-innerContainer`}
              >
                <label className={`${labelClassName}`} htmlFor={option.name}>
                  {option.display}
                </label>
                <input
                  id={option.name}
                  key={option.name}
                  type="checkbox"
                  {...register(
                    `${name}.${option.name}`,
                    requirements ? requirements : null
                  )}
                  className={`${ClassName} ${
                    noDefaultStyles ? styles.inputCheckbox : ""
                  }`}
                  checked={option.value}
                />
              </div>
            </>
          );
          tempArray.push(temp);
        });
      }
    }
    setCheckboxes(tempArray);
  }, []);
  return (
    <div
      className={`${ContainerClassName} ${
        !noDefaultStyles ? styles.Container : ""
      } `}
    >
      {checkboxes}
    </div>
  );
};

// const Checkboxes = ({
//   register,
//   givenOptions,
//   requirements,
//
//   ClassName,
//   ContainerClassName,
//   innerContainerClassName,
//   readonly,
// }) => {
//   let [checkboxes, setCheckboxes] = useState([]);
//   console.log("bruh");
//   if (!register) return console.log("[ERROR] Register parameter is needed");
//   if (givenOptions.length === 0) return null;

//   useEffect(() => {
//     let placeholder = givenOptions.map((option) => {
//       return (
//         <div className={`${innerContainerClassName} ${styles.innerContainer}`}>
//           <input
//             id={option.name}
//             key={option.name}
//             type="checkbox"
//             {...register(option.name, requirements ? requirements : null)}
//             className={`inputCheckbox ${styles.inputCheckbox} ${ClassName}`}
//           />
//           <label htmlFor={option.name}>{option.display}</label>
//         </div>
//       );
//     });
//     setCheckboxes(placeholder);
//   }, [givenOptions, defaultValues]);

//   return (
//     <div className={`${ContainerClassName} ${styles.Container}`}>
//       {checkboxes}
//     </div>
//   );
// };

export default Checkboxes;
