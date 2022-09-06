import styles from "./File.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.type]
 * @param {String} [Details.ext]
 * @param {String} [Details.media]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */
const File = ({
  r,
  type,
  ext,
  media,
  ClassName,
  noDefaultStyles,
  onChange,
  onFocus,
}) => {
  const acceptList = ext.map((element) => {
    return element.replace(".", "");
  });
  const handleChange = (event) => {
    if (event.target.files.length === 1) {
      let ext = event.target.files[0].name.split(".")[1];
      if (!acceptList.includes(ext)) return handleInvalid(event);
      // pass
    }
  };
  const handleInvalid = (event) => {
    alert("Invalid file extension type");
    event.target.value = "";
  };
  return (
    <input
      {...r}
      onChange={handleChange}
      className={`${!noDefaultStyles ? styles.inputFile : ""} ${ClassName}`}
      accept={`${type.toString()},${ext.toString()},${media.toString()}`}
      type="file"
      onChange={onChange}
      onFocus={onFocus}
    ></input>
  );
};

export default File;
