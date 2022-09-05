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
      console.log(teams);
    };
    fetchData();
    return () => {};
  }, []);

  return (
    <section className="px-8 py-12 w-screen min-h-screen bg-semidark rounded-bl-[80px] rounded-br-[80px] flex flex-col gap-y-16">
      <NeonText>
        <h1 className="font-bebas text-5xl ">Scoreboard</h1>
      </NeonText>
      <div className="flex flex-col gap-y-10">
        {gates.length &&
          gates?.map((gate, index) => {
            console.log(gate);
            return (
              <GateScore
                gate={gate.gate}
                widthClassname={`w-${4 - index}/${5 - index}`}
                point={gate.totalPoints}
                position={OrdinalSuffix(index + 1)}
                width={85 - 15 * index}
              />
            );
          })}

        {/* <GateScore /> */}
      </div>
    </section>
  );
};

interface PropsB {
  widthClassname: string;
  point: number;
  gate: "And" | "Or" | "Nor" | "Not";
  position: `${number}${string}`;
  width: number;
}

const GateScore: FC<PropsB> = ({
  widthClassname,
  width,
  point,
  gate,
  position,
}) => {
  return (
    <div className="flex flex-col">
      <div
        style={{
          width: `${width}%`,
        }}
        className={`text-dark bg-${gate.toLowerCase()}-gradient ${widthClassname} h-32 relative rounded-tr-3xl rounded-br-3xl flex flex-col items-center justify-center`}
      >
        <h2 className="text-4xl font-ranger uppercase">{gate}</h2>
        <h3 className="text-xl font-ranger">{point} pts</h3>
        <span className="font-bebas text-3xl text-white absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full">
          {position}
        </span>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  await axiosBackendInstance.get("/point/compute");
  const teams = await axiosBackendInstance.get<any, { data: Team[] }>(
    "/point/teams"
  );

  return {
    props: {
      teams,
    },
    revalidate: 86400,
  };
};

export default Scoreboard;
