import { NextPage } from "next";

const ConsolePregame: NextPage<{ handleContinue: () => Promise<any> }> = ({
  handleContinue,
}) => {
  return (
    <>
      (PREGAME) Moderator will read the topics and explains the mechanics{" "}
      <button
        onClick={handleContinue}
        className="text-xl border-2 p-2 font-bold rounded-xl"
      >
        Continue
      </button>
    </>
  );
};

export default ConsolePregame;
