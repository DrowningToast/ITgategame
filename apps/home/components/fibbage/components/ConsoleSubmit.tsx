import { NextPage } from "next";
import { useEffect, useState } from "react";
import { axiosBackendInstance } from "../../axios/helper";
import ValidateJWT from "../../utils/validateJWT";
import { SudoGameState } from "../types";

interface Props {
  onsubmit: (event: any, approved: string[]) => Promise<any>;
  lastJSON: {
    jwt?: string;
  };
  initialChoices: string[];
}

const handleRefresh = async () => {
  const game = await axiosBackendInstance.get<SudoGameState>("/fibbage/sudo");
  return game.data;
};

const ConsoleSubmit: NextPage<Props> = ({
  onsubmit,
  lastJSON,
  initialChoices,
}) => {
  const [choices, setChoices] = useState<string[]>(initialChoices);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  useEffect(() => {
    if (!lastJSON?.jwt) return;

    const fetch = async () => {
      const newChoice = (await ValidateJWT(lastJSON.jwt!)) as string;
      setChoices([...choices, newChoice]);
    };
    fetch();
  }, [lastJSON]);

  return (
    <>
      <h1 className="font-noto text-2xl">Choices sent by players</h1>
      <button
        className="text-xl p-2 py-1 rounded-lg border-2 border-black"
        onClick={handleRefresh}
      >
        Refresh
      </button>
      <button
        className="text-xl p-2 py-1 rounded-lg border-2 border-black"
        onClick={async (e) => await onsubmit(e, selectedChoices)}
      >
        Confirm
      </button>
      {choices.map((choice, index) => {
        return (
          <div key={index} className="flex gap-x-4">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedChoices([...selectedChoices, choice]);
                } else {
                  setSelectedChoices(
                    [...selectedChoices].filter((_) => _ !== choice)
                  );
                }
              }}
            />
            <span className="text-xl font-noto">{choice}</span>
          </div>
        );
      })}
    </>
  );
};

export default ConsoleSubmit;
