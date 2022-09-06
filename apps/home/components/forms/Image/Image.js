import styles from "./Image.module.css";
import Image from "next/image";
import { httpGet } from "@system/HTTP/request";
import { useState } from "react";

/**
 *
 * @param {Object} Details
 * @param {import ("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.ClassName]
 * @param {String} [Details.ContainerClassName]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */

const ImageUpload = ({
  r,
  ClassName,
  ContainerClassName,
  noDefaultStyles,
  onChange,
  onFocus,
}) => {
  const [preview, setPreview] = useState(null);
  const acceptList = ["jpg", "jpeg", "png"];
  const handleChange = (event) => {
    if (event.target.files.length === 1) {
      let ext = event.target.files[0].name.split(".")[1];
      if (!acceptList.includes(ext)) return handleInvalid(event);
      // preview
      previewImage(event.target.files[0]);
    }
  };
  const previewImage = async (file) => {
    try {
      let url = URL.createObjectURL(file);
      let response = await httpGet(url);
      setPreview(url);
    } catch (err) {
      alert("Errors have been occured while trying to preview uploaded Image");
    }
  };
  const handleInvalid = (event) => {
    alert("Invalid file extension type");
    event.target.value = "";
  };
  return (
    <>
      <input
        {...r}
        onChange={handleChange}
        className={`${styles.inputImage} ${ClassName}`}
        accept={".jpg,.jpeg,.png"}
        type="file"
        onChange={onChange}
        onFocus={onFocus}
      ></input>
      {preview && (
        <div
          className={`${
            !noDefaultStyles ? styles["frame"] : ""
          } ${ContainerClassName}`}
        >
          <div
            className={`${!noDefaultStyles ? styles["image-container"] : ""}`}
          >
            <img src={preview} alt="Uploaded Image" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
