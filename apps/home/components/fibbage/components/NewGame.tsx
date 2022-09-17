import { NextPage } from "next";
import { useForm } from "react-hook-form";
import Submit from "../../forms/Submit/Submit";
import { startNewGame } from "../instance";

interface Data {
  bet: number;
  prompt: string;
  truth: string;
  decoy: string;
}

const handleRequestNewGame = async (data: Data) => {
  console.log(data);

  const game = await startNewGame(
    data.bet,
    data.prompt,
    data.truth,
    data.decoy
  );
  console.log(game);
};

const NewGame: NextPage = () => {
  const { register, handleSubmit } = useForm<Data>();

  return (
    <form
      onSubmit={handleSubmit(handleRequestNewGame)}
      className="flex flex-col gap-y-4"
    >
      <h1>Prompt</h1>
      <input
        type="text"
        required
        {...register("prompt")}
        className="outline outline-2 outline-black p-2 w-64 bg-blue-200"
      />
      <h1>Bet</h1>
      <input
        type="number"
        required
        {...register("bet")}
        className="outline outline-2 outline-black p-2 w-64 bg-blue-200"
      />
      <h1>Truth</h1>
      <input
        type="text"
        required
        {...register("truth")}
        className="outline outline-2 outline-black p-2 w-64 bg-blue-200"
      />
      <h1>Decoy</h1>
      <input
        type="text"
        required
        {...register("decoy")}
        className="outline outline-2 outline-black p-2 w-64 bg-blue-200"
      />
      <Submit
        noDefaultStyles
        ClassName="cursor-pointer font-bold border-2 outline-2 outline-black rounded-xl"
        text={"New Game"}
      />
    </form>
  );
};

export default NewGame;
