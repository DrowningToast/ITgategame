import { FC } from "react";
import styles from "./Submit.module.css";

const Submit: FC<{
  text: string;
  ClassName?: string;
  noDefaultStyles?: boolean;
}> = ({ text, ClassName, noDefaultStyles }) => {
  return (
    <input
      className={`${ClassName} ${!noDefaultStyles ? styles.inputSubmit : ""}`}
      type="submit"
      value={text ? text : "Submit"}
    />
  );
};

export default Submit;
