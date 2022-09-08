import { SignOutFC } from "firebase-auth-api";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion } from "framer-motion";

const SignOut = () => {
  return (
    <>
      <SignOutFC />
      <div className="w-screen min-h-screen grid place-items-center">
        <motion.div
          animate={{
            opacity: [1, 0.5, 1, 0.5],
            transition: {
              repeat: Infinity,
              duration: 4,
            },
          }}
          className="font-kanit text-2xl"
        >
          กำลังออกจากระบบ
        </motion.div>
      </div>
    </>
  );
};

export default SignOut;
