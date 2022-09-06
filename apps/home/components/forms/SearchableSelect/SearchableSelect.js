import React, { useState, useEffect, useRef } from "react";
import styles from "./SearchableSelect.module.css";

/**
 * @param {Object} props
 * @param {import("react-hook-form").UseFormRegisterReturn} props.r
 * @param {String} props.id
 * @param {Array<{display, value}>} props.options
 * @param {number} props.visibleSize
 * @param {Boolean} props.noDefaultStyles
 * @param {String} props.ClassName
 * @param {String} props.ChoicesContianerClassName
 * @param {String} props.ChoicesClassName
 * @param {Function} props.onChange
 * @param {Function} porps.onFocus
 * @returns
 */

const SearchableSelect = ({
  r,
  id,
  visibleSize,
  options,
  noDefaultStyles,
  ClassName,
  ContainerClassName,
  ChoicesContianerClassName,
  ChoicesClassName,
  onChange,
  onFocus,
  setValue,
  setError,
  clearErrors,
  path,
  prefillData,
  i,
  outsiderValueState,
}) => {
  let [choices, setChoices] = useState([]);
  let [selected, setSelected] = useState("");
  let [choicesVisible, setChoicesVisible] = useState(false);
  const inputValue = useRef(null);

  useEffect(() => {
    if (outsiderValueState) outsiderValueState(selected);
  }, [selected]);

  // Distribute options display items to array
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (!e.target.classList.contains("valid")) {
        setChoicesVisible(false);
      }
    });
    if (choices.length === 0) {
      handleJSX(options);
    }
  }, [options]);

  useEffect(() => {
    if (!prefillData?.details?.finishAction?.diagnosticResults.length >= i + 1)
      return;
    if (!prefillData || !options) return;
    let correctDisease = options.filter(
      (element) =>
        prefillData?.details?.finishAction?.diagnosticResults[i] ===
        element.value
    )[0];
    if (!correctDisease) return;
    setTimeout(() => {
      if (inputValue.current)
        inputValue.current.value = `${correctDisease.display}`;
    }, 500);
  }, [prefillData, options, inputValue.current]);

  const sortingSearch = (searchValue, option) => {
    if (searchValue.toLowerCase() === option.toLowerCase()) return 2;
    if (option.toLowerCase().startsWith(searchValue.toLowerCase())) return 1;
    if (option.toLowerCase().includes(searchValue.toLowerCase())) return 0;
    return -1;
  };

  const handleFocus = (e) => {
    const sortedOptions = options
      .filter((option) =>
        option.display
          .toLowerCase()
          .includes((e.target?.value || e.value || "").toLowerCase())
      )
      .sort((a, b) => {
        return (
          sortingSearch(e.target?.value || e.value || "", b.display) -
          sortingSearch(e.target?.value || e.value || "", a.display)
        );
      });
    handleJSX(sortedOptions);
    setSelected(e.target?.value || e.value || "");
  };

  //filtering and sorting dropdown list
  const handleFilter = (e) => {
    const sortedOptions = options
      .filter((option) =>
        option.display
          .toLowerCase()
          .includes((e.target?.value || e.value || "").toLowerCase())
      )
      .sort((a, b) => {
        return (
          sortingSearch(e.target?.value || e.value || "", b.display) -
          sortingSearch(e.target?.value || e.value || "", a.display)
        );
      });
    handleJSX(sortedOptions);
    setSelected(e.value || "");

    // Invalid diseases name is not allowed
    if (e?.target?.value) {
      return setError(path, { message: "This field is required" });
    }
    // Then the disease name is valid
    clearErrors(path);
    let correctDisease = options.filter((disease) => disease.value === e.value);
    if (!correctDisease.length) return;
    setValue(path, correctDisease[0].value);
  };

  //add jsx to array
  const handleJSX = (sortedOptions) => {
    let tempJSX = [];
    sortedOptions.map((option) => {
      let optionElement = (
        <li
          className={`valid list ${
            !noDefaultStyles ? styles.choiceList : ""
          } ${ChoicesClassName}`}
          key={option.value}
          onClick={(e) => handleSelected(e, option)}
        >
          {option.display}
        </li>
      );
      tempJSX.push(optionElement);
    });
    setChoices(tempJSX);
  };

  //handle selceted choice
  const handleSelected = (e, value) => {
    inputValue.current.value = e.target.innerText || e.target.innerHTML;
    handleFilter(value);
  };
  //handle visibility of choices list
  const handleClick = (e) =>
    e.target.classList.contains("list")
      ? setChoicesVisible(false)
      : setChoicesVisible(true);
  // on blur will check the input field if it's valid or not
  const handleBlur = (e) => {
    let diseases = options.map((disease) => {
      return disease.display;
    });
    if (!diseases.includes(e?.target?.value)) {
      inputValue.current.value = "";
      setSelected("");
    }
  };

  return (
    <div
      className={`valid ${ContainerClassName}`}
      style={{ position: "relative", width: "100%" }}
      onClick={handleClick}
    >
      <input
        ref={inputValue}
        id={id}
        className={`valid ${
          !noDefaultStyles ? styles.inputSelect : ""
        } ${ClassName}`}
        size={visibleSize}
        placeholder="Search here..."
        onChange={handleFilter}
        onBlur={handleBlur}
        onFocus={handleFocus}
        required
      ></input>
      <input value={selected} {...r} readOnly hidden />
      {choicesVisible && (
        <ul
          className={`valid ${
            !noDefaultStyles ? styles.choiceListContainer : ""
          } ${ChoicesContianerClassName}`}
        >
          {choices}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
