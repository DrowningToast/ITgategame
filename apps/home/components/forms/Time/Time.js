import styles from "./Time.module.css";
const Time = ({ r, id, ClassName, noDefaultStyles }) => {
  return (
    <input
      {...r}
      type="time"
      id={id}
      className={`${!noDefaultStyles ? styles.inputTime : ""} ${ClassName}`}
    ></input>
  );
};

export default Time;
