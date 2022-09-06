import styles from "./Files.module.css";

/**
 *
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.ext]
 * @param {String} [Details.media]
 * @param {String} [Details.type]
 * @param {String} [Details.ClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Number} [Details.Maximum]
 * @param {Function} [Details.onChange]
 * @param {Function} [Detials.onFocus]
 * @returns
 */
const Files = ({
  r,
  type,
  ext,
  media,
  ClassName,
  noDefaultStyles,
  maximum,
  onChange,
  onFoucs,
}) => {
  const acceptList = ext.map((element) => {
    return element.replace(".", "");
  });
  const handleChange = (event) => {
    if (event.target.files.length > maximum)
      Array.from(event.target.files).forEach((file) => {
        let ext = file.name.split(".")[1];
        if (!acceptList.includes(ext)) return handleInvalid(event);
        // pass
      });
  };
  const handleInvalid = (event) => {
    alert("Invalid file extension type");
    event.target.value = "";
  };
  return (
    <input
      {...r}
      onChange={handleChange}
      className={`${!noDefaultStyles ? styles.inputFiles : ""} ${ClassName}`}
      accept={`${type.toString()},${ext.toString()},${media.toString()}`}
      type="file"
      multiple
      onChange={onChnage}
      onFocus={onFocus}
    ></input>
  );
};

export default Files;
