import styles from "./TextOnly.module.css";
const TextOnly = ({ r, id, placeholder, ClassName, noDefaultStyles }) => {
  return (
    <input
      {...r}
      id={id}
      className={`${!noDefaultStyles ? styles.inputTextOnly : ""} ${ClassName}`}
      placeholder={placeholder ? placeholder : "Alphabetical Only"}
      pattern={/^[A-Za-z]+$/i}
    ></input>
  );
};

export default TextOnly;
