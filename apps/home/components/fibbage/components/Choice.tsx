import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Profile, User } from "firebase-auth-api";
import { axiosBackendInstance } from "../../axios/helper";

const Choice: FC<{
  //  uid
  source: string | null;
  choice: string;
  truth: boolean;
}> = ({ source, choice, truth }) => {
  const [isReveal, setReveal] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (!source) return;

    const fetch = async () => {
      const response = await axiosBackendInstance.get<Profile>(
        `/users/${source}`
      );

      setUser(response.data);
    };
    fetch();
  }, [source]);

  return (
    <motion.div
      onClick={() => setReveal(!isReveal)}
      className="relative cursor-pointer rounded-full py-1.5 px-6 text-center bg-white shadow-2xl border-2 font-noto font-semibold text-xl"
    >
      <div className="z-20">{choice}</div>
      {/* Owner */}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          y: !isReveal ? "0%" : "-125%",
          opacity: !isReveal ? 0 : 1,
        }}
        className="absolute z-10 text-black text-center inset-0"
      >
        {truth ? (
          <span className="font-eb font-bold text-4xl text-purple-800">
            TRUTH
          </span>
        ) : (
          <span className="font-noto font-bold text-2xl text-purple-500">
            {source ? `${user?.userName?.toUpperCase()}'S LIE` : "HOST LIE"}
          </span>
        )}
      </motion.span>
      <motion.span
        animate={{
          y: !isReveal ? "0%" : "-125%",
          opacity: !isReveal ? 0 : 1,
        }}
      ></motion.span>
    </motion.div>
  );
};

export default Choice;
