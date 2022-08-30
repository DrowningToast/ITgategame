import { NextPage } from "next";
import { axiosBackendInstance } from "../components/axios/helper";

const Test: NextPage = () => {
  return (
    <>
      <button
        onClick={() => {
          axiosBackendInstance.get("/hello");
        }}
      >
        test
      </button>
    </>
  );
};

export default Test;
