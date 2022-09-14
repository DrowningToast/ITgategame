import { profileInfoAtom } from "firebase-auth-api";
import { useAtom } from "jotai";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { axiosBackendInstance } from "../components/axios/helper";

const Unlink: NextPage = () => {
  const [profile] = useAtom(profileInfoAtom);

  const router = useRouter();

  useEffect(() => {
    if (!profile) return;

    const fetch = async () => {
      try {
        await axiosBackendInstance.post("/discord/unlink", {
          uid: profile.uid,
        });
        alert("เรียบร้อยจ้า! ตัดการเชื่อมต่อเรียบร้อย");
        router.push("/");
      } catch (e) {
        alert(e);
      }
    };

    fetch();

    return () => {};
  }, [profile]);

  return (
    <div className="w-screen min-h-screen grid text-center place-items-center">
      <h1 className="text-lg lg:text-2xl font-kanit">
        กำลังทำการตัดการเชื่อมต่อกับบัญชี Discord . . .
      </h1>
    </div>
  );
};

export default Unlink;
