import { FC, useEffect, useState } from "react";
import NeonText from "../utils/NeonText";
import { axiosBackendInstance } from "../axios/helper";
import OrdinalSuffix from "../utils/OridnalSuffix";

export interface Team {
  _id: string;
  totalPoints: number;
  basePoints: number;
  gate: "And" | "Or" | "Nor" | "Not";
  __v: number;
}

interface PropsA {
  teams?: Team[];
}

const Scoreboard: FC<PropsA> = ({ teams }) => {
  const [gates, setGates] = useState<Team[]>(teams ?? []);

  useEffect(() => {
    const fetchData = async () => {
      const teams = await axiosBackendInstance.get<any, { data: Team[] }>(
        "/point/teams"
      );
      setGates(teams.data);
    };
    if (!teams) fetchData();
    return () => {};
  }, []);

  return (
    <section className="px-8 xl:px-28 relative py-20 w-screen bg-semidark rounded-bl-[80px] rounded-br-[80px] xl:rounded-bl-3xl xl:rounded-br-3xl flex flex-col gap-y-16 justify-end xl:py-32">
      <div className="absolute text-7xl"></div>
      <h1 className="font-bebas text-6xl lg:text-7xl xl:text-8xl absolute right-24 top-20 xl:top-1/3">
        <NeonText>Scoreboard</NeonText>
      </h1>

      {/* <NeonText className="top-0 right-0">
        <h1 className="font-bebas text-6xl lg:text-7xl xl:text-8xl absolute  top-20 right-12 xl:top-16 xl:right-16">
          Scoreboard
        </h1>
      </NeonText> */}
      <div className="min-h-screen justify-end flex flex-col xl:flex-row gap-y-10 xl:gap-x-12 2xl:gap-x-14 xl:justify-around xl:h-full">
        {gates?.map((gate, index) => {
          return (
            <GateScore
              key={`gatescore-${index}`}
              gate={gate.gate}
              point={gate.totalPoints}
              position={OrdinalSuffix(index + 1)}
              width={34 - (!index ? index : 15 + 2.5 * index)}
              widthClassName={`w-${4 - index}/${5 - index}`}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
};

interface PropsB {
  point: number;
  gate: "And" | "Or" | "Nor" | "Not";
  position: `${number}${string}`;
  width: number;
  widthClassName: string;
  index: number;
}

const GateScore: FC<PropsB> = ({
  width,
  point,
  gate,
  position,
  widthClassName,
  index,
}) => {
  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden mt- xl:flex text-dark w-auto h-auto relative flex-col items-center justify-end`}
      >
        <div
          style={{
            width: `${width}vw`,
          }}
          className={`bg-${gate.toLowerCase()}-gradient aspect-square flex flex-col justify-center items-center relative`}
        >
          <h2 className={`text-${8 - index}xl font-ranger uppercase`}>
            {gate}
          </h2>
          <h3 className="text-2xl font-ranger">{point} pts</h3>
          <span
            className={`font-bebas text-6xl text-white absolute top-0 left-0 transform -translate-y-full `}
          >
            {position}
          </span>
        </div>
      </div>
      {/* Mobile */}
      <div className="xl:hidden flex flex-col justify-end w-full">
        <div
          style={
            {
              // width: `${width}%`,
            }
          }
          className={`text-dark ${widthClassName} bg-${gate.toLowerCase()}-gradient h-36 md:h-52 lg:h-20 relative rounded-tr-3xl rounded-br-3xl flex flex-col items-center justify-center`}
        >
          <h2 className="text-4xl md:text-6xl font-ranger uppercase">{gate}</h2>
          <h3 className="text-xl md:text-2xl font-ranger">{point} pts</h3>
          <span className="font-bebas text-3xl text-white absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
            {position}
          </span>
        </div>
      </div>
    </>
  );
};

export default Scoreboard;
