import {
  firebaseReady,
  firebaseUserAtom,
  profileInfoAtom,
  signinWithGooglePopUp,
  SignOut,
} from "firebase-auth-api";
import { useAtom } from "jotai";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  axiosBackendInstance,
  axiosDiscordInstance,
} from "../components/axios/helper";
import { iDiscordUser } from "../../backend/models/DiscordUser";
import { User } from "firebase/auth";
import { browser } from "process";

const Link: NextPage<{
  cred: string;
}> = () => {
  const router = useRouter();
  const { cred } = router.query;
  const [user] = useAtom(firebaseUserAtom);
  const [fail, setFailState] = useState<boolean>(false);
  const [invalid, setInvalidState] = useState<boolean>(false);
  const [ready] = useAtom(firebaseReady);
  const [profile] = useAtom(profileInfoAtom);

  const checkDomainName = async (user: User) => {
    const domain = user.email?.split("@")[1];
    if (!user.email) {
      return alert("Fatal error missing Email address");
    }
    if (domain !== "kmitl.ac.th") {
      await SignOut();
      alert("Please use KMITL domain");
      router.push("/");
      return;
    }
    const facultyCode = `${user.email[2]}${user.email[3]}`;
    if (facultyCode !== "07") {
      await SignOut();
      alert(
        "This event is exclusively for Information Technology students of KMITL"
      );
      router.push("/");
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(profile);
        if (!ready) return;
        if (!user) return setFailState(true);
        if (!cred) return setInvalidState(true);
        // check if the user is already linked or not
        if (profile?.discordId) {
          alert("The account is already linked");
          setFailState(true);
          window.close();
        }

        // Temp Discord Account already exists
        const response = await axiosBackendInstance.post("/discord/link", {
          uid: user.uid,
          cred,
        });

        return alert("เชื่อมบัญชีสำเร็จ สามารถปิดหน้านี้ได้เลย");
      } catch (e) {
        setInvalidState(true);
        console.log(e);
        alert("Linking failed");
      }
    };
    fetchData();
  }, [user, ready]);

  return (
    <>
      {invalid ? (
        <div className="text-3xl font-kanit grid place-items-center h-screen">
          <h1>Invalid token</h1>
        </div>
      ) : (
        <div className="w-screen min-h-screen grid text-center place-items-center">
          {(!ready || user) && !fail ? (
            <div className="font-kanit lg:text-2xl  text-lg whitespace-pre-line">
              <h1>กำลังทำการเชื่อมบัญชีระหว่างบัตร Gate Game และ Discord</h1>{" "}
              <h1>
                กรุณาเช็คว่าได้ลิ้งค์นี้มาจากบอทของ ITGG ใน Discord เท่านั้น
              </h1>
            </div>
          ) : fail ? (
            <div className="font-kanit lg:text-2xl text-lg whitespace-pre-line">
              <h1>Link failed</h1>
            </div>
          ) : (
            <div className="font-kanit lg:text-2xl text-lg whitespace-pre-line">
              <h1>Loading</h1>
            </div>
          )}
          {!user && ready && (
            <div
              onClick={() => {
                if (!user) signinWithGooglePopUp(checkDomainName);
              }}
              className="cursor-pointer px-6 py-2 border-2 border-white rounded-lg"
            >
              Login with KMITL email
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Link;
