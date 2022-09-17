import { NextPage } from "next";
import { useRef, useState } from "react";
import { axiosBackendInstance } from "../../axios/helper";

const PlayerSubmit: NextPage = () => {
  const [answer, setAnswer] = useState<string | undefined>();
  const [hasSubmited, setHasSubmited] = useState<boolean>(false);

  const handleSubmit = async () => {
    await axiosBackendInstance.post("/fibbage/submit", {
      choice: answer,
    });
    setHasSubmited(true);
  };

  return (
    <>
      {!hasSubmited ? (
        <>
          <h1 className="text-4xl font-eb font-bold text-black">
            Submit your answer
          </h1>
          <input
            onChange={(e) => setAnswer(e.target.value)}
            type="text"
            className="px-4 py-0.5 bg-white text-xl font-noto border-2 border-gray-500 font-medium text-black"
          />
          <button
            onClick={handleSubmit}
            className="font-noto text-lg px-6 py-0.5 rounded-lg bg-white text-black border-2 border-gray-500"
            type="button"
          >
            ยืนยัน
          </button>
        </>
      ) : (
        <h1 className="font-bold font-eb text-purple-400 text-3xl">
          Back to waiting. . .
        </h1>
      )}
    </>
  );
};

export default PlayerSubmit;
