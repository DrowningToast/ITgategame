import { SignOutFC } from "firebase-auth-api";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignOut = () => {
  return (
    <>
      <SignOutFC />
      <div className="w-screen min-h-screen grid place-items-center">
        <div className="font-kanit text-2xl">กำลังออกจากระบบ</div>
      </div>
    </>
  );
};

export default SignOut;
