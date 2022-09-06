import styles from "./Images.module.css";
import Image from "next/image";
import { httpGet } from "@system/HTTP/request";
import { useState } from "react";

/**
 * @param {Object} Details
 * @param {import("react-hook-form").UseFormRegisterReturn} Details.r
 * @param {String} [Details.ClassName]
 * @param {String} [Details.ContainerClassName]
 * @param {Number} [Details.maximumSize]
 * @param {Boolean} [Details.noDefaultStyles]
 * @param {Function} [Details.onChange]
 * @param {Function} [Details.onFocus]
 * @returns
 */

const ImagesUpload = ({
  r,
  ClassName,
  ContainerClassName,
  maximumSize,
  noDefaultStyles,
  onChange,
  onFocus,
}) => {
  const [preview, setPreview] = useState([]);
  const acceptList = ["jpg", "jpeg", "png"];
  const handleChange = (event) => {
    let temp = Array.from(event.target.files);
    temp.forEach((fileL) => {
      let ext = fileL.name.split(".")[1];
      if (
        !acceptList.includes(ext) ||
        (maximumSize && temp.length > maximumSize)
      )
        return handleInvalid(event);
    });
    previewImage(event.target.files);
  };
  const previewImage = async (files) => {
    try {
      let temp = [];
      let filesArray = Array.from(files);
      filesArray.forEach((file) => {
        let url = URL.createObjectURL(file);
        temp.push(url);
      });
      setPreview(temp);
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
        className={`${
          noDefaultStyles ? "" : `${styles.inputImage}`
        } ${ClassName}`}
        accept={".jpg,.jpeg,.png"}
        type="file"
        multiple
        onChange={onChange}
        onFocus={onFocus}
      ></input>
      {preview.length !== 0 && (
        <div
          className={`${
            noDefaultStyles ? "" : `${styles["frame"]}`
          } ${ContainerClassName}`}
        >
          <div
            className={`${
              noDefaultStyles ? "" : `${styles["images-container"]}`
            }`}
          >
            {preview.map((picture) => {
              return <img src={picture} alt="Uploaded Image" />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ImagesUpload;
