import { NextPage } from "next";

const ConsoleIdle: NextPage<{ handleContinue: () => Promise<any> }> = ({
  handleContinue,
}) => {
  return (
    <>
      (IDLE) The game is ready to go, once PREGAME has ended, you can start
      choosing choices
      <button
        onClick={handleContinue}
        className="text-xl border-2 p-2 font-bold rounded-xl"
      >
        Continue
      </button>
    </>
  );
};

export default ConsoleIdle;
