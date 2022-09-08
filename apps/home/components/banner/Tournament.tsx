import Link from "next/link";
import { motion } from "framer-motion";

const Tournament = () => {
  return (
    <section className="w-screen flex flex-col items-center text-white">
      <div className="py-12 lg:py-24">
        <h1 className="text-5xl lg:text-8xl font-bebas text-white">
          GG Tournament
        </h1>
      </div>
      <Link href="https://challonge.com/itggvalorant" passHref>
        <a target="_blank" className="inline-block w-full">
          <motion.div
            whileHover={{
              scale: 1.1,
            }}
            style={{
              backgroundImage: "url(/assets/Valorant.png)",
            }}
            className="cursor-pointer flex flex-col items-center py-6 lg:py-16 w-full bg-cover bg-center bg-no-repeat"
          >
            <h1 className="font-bebas text-6xl ">Valorant</h1>
            <h2 className="font-bebas text-xl tracking-wide">
              Click here to see the brackets
            </h2>
          </motion.div>
        </a>
      </Link>
      <Link
        href="https://docs.google.com/spreadsheets/d/1vcWpW4QqKDCpYuaBEgDYcTNBZIOdiZmh44Tvk2vqorY/edit#gid=0"
        passHref
      >
        <a target="_blank" className="inline-block w-full">
          <motion.div
            whileHover={{
              scale: 1.1,
            }}
            style={{
              backgroundImage: "url(/assets/rov.png)",
            }}
            className="cursor-pointer flex flex-col items-center py-6 lg:py-16 w-full bg-cover bg-center bg-no-repeat"
          >
            <h1 className="font-bebas text-6xl ">Valorant</h1>
            <h2 className="font-bebas text-xl tracking-wide">
              Click here to see the brackets
            </h2>
          </motion.div>
        </a>
      </Link>
    </section>
  );
};

export default Tournament;
