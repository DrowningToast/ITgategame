import styles from "./Error.module.css";

const Error = ({ children, ClassName, noDefaultStyles }) => {
  return (
    <small className={`${!noDefaultStyles ? styles.errors : ""} ${ClassName}`}>
      {children ? children : "An error has been occured"}
    </small>
  );
};

export default Error;
