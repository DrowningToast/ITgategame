import {
  firebaseToken,
  firebaseUserAtom,
  Profile,
  profileInfoAtom,
  User,
} from "firebase-auth-api";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { SubmitHandler } from "react-hook-form";
import Submit from "../forms/Submit/Submit";
import { useForm } from "react-hook-form";
import { axiosBackendInstance } from "../axios/helper";
import { useRouter } from "next/router";
import { Transaction } from "../../../backend/models/Transaction";

interface payload {
  userName: string;
  gate: "AND" | "OR" | "NOR" | "NOT";
}

const Wallet = () => {
  const [fallbackId, _] = useState<string>("");
  const [profile, setProfile] = useAtom(profileInfoAtom);
  const [token, setToken] = useAtom(firebaseToken);
  const Canvas = useRef<HTMLCanvasElement>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [color, setColor] = useState<`#${string}`>("#fffff");

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch the user again for good measure
  useEffect(() => {
    if (!token || !profile) return;
    const fetchData = async () => {
      const response = await axiosBackendInstance.get<Profile>("/users");
      setProfile(response.data);
      reset({
        userName: response.data.userName,
        gate: response.data.gate,
      });
    };
    fetchData();
  }, [token]);

  // Handle the ID
  useEffect(() => {
    if (!profile?.email) return;
    _(profile?.email?.split("@")[0]);
  }, [profile]);

  // Handle the QR Code
  useEffect(() => {
    if (!profile?.id || !Canvas.current) return;
    console.log(profile?.id);
    QRCode.toCanvas(Canvas.current, profile?.id, function (error) {
      if (error) console.error(error);
      console.log("QR Generated");
    });
  }, [profile?.id]);

  // Manage gate color
  useEffect(() => {
    if (!profile?.gate) return () => {};
    switch (profile?.gate) {
      case "AND":
        setColor("#00E0FF");
        break;
      case "OR":
        setColor("#ACFE00");
        break;
      case "NOR":
        setColor("#BD00FF");
        break;
      case "NOT":
        setColor("#FF0000");
        break;
      default:
        break;
    }
  }, [profile]);

  const { register, handleSubmit, reset } = useForm<payload>();

  const router = useRouter();

  const handleConfirm: SubmitHandler<payload> = async (data: payload) => {
    setLoading(true);
    try {
      let response;
      if (!profile?.activated) {
        response = await axiosBackendInstance.post("/users/verify", data);
      } else {
        response = await axiosBackendInstance.patch("/users", data);
      }
      // Refresh the profile information
      const newProfile = await axiosBackendInstance.get<Profile>("/users");
      setProfile(newProfile.data);
      setEditing(false);
      alert("The information has been changed");
    } catch (e) {
      alert("An error has occured, check log for more details");
      console.error(e);
    }
    setLoading(false);
  };

  // Fetch transactions
  useEffect(() => {
    if (!profile || !token) return () => {};
    const fetchData = async () => {
      try {
        const response = await axiosBackendInstance.get<Transaction[]>(
          "/transactions"
        );
        setTransactions([...response.data]);
      } catch (e) {
        console.error(e);
        alert("An error has occured while trying to fetch transaction log");
      }
    };
    fetchData();
  }, [profile, token]);

  // console.log(profile);
  // console.log(color);

  const fetchData = async () => {
    try {
      const response = await axiosBackendInstance.get<Transaction[]>(
        "/transactions"
      );
      setTransactions([...response.data]);
    } catch (e) {
      console.error(e);
      alert("An error has occured while trying to fetch transaction log");
    }
  };

  return (
    <>
      {profile?.email && (
        <div className="flex flex-col overflow-auto px-12 gap-y-2">
          <h1 className="text-white font-bebas text-2xl tracking-wider z-20">
            {profile?.activated
              ? `Welcome back, ${profile.userName}`
              : "Confirm your identity"}
          </h1>
          {/* Card */}
          <div className="w-full aspect-[9/15] bg-white rounded-xl z-20 relative overflow-hidden shadow-xl">
            {/* BG */}
            <div className="absolute inset-0 blur-[64px]">
              {/* Circle#1 */}
              <div
                style={{
                  backgroundColor: color,
                }}
                className={`bg-white w-[145%] aspect-square absolute left-0 top-0 transform -translate-y-1/2 rounded-full`}
              ></div>
              {/* Circle#2 */}
              <div className="bg-[#CAC0E5] w-[150%] aspect-square absolute left-0 -top-12 transform -translate-x-2/3 rounded-full"></div>
              {/* Circle#3 */}
              <div className="bg-[#2F4153] w-[200%] aspect-square absolute -left-12 bottom-0 transform translate-y-1/2 rounded-full"></div>
            </div>
            <div className="py-4 px-6 relative w-full h-full flex flex-col items-start justify-end">
              {profile?.activated && (
                <div
                  className={`${
                    profile?.gate === "AND" || "OR" ? "text-dark" : "text-white"
                  } absolute top-5 right-5 flex flex-col items-end justify-start`}
                >
                  <h1 className={`text-5xl  font-bebas grayscale `}>
                    {profile?.balance}
                  </h1>
                  <h5 className="text-2xl font-bebas">pts</h5>
                </div>
              )}
              <span className="font-bebas text-white tracking-widest font-light text-base">
                {`${fallbackId[0]}${fallbackId[1]} ${fallbackId[2]}${fallbackId[3]} ${fallbackId[4]}${fallbackId[5]}${fallbackId[6]}`}
              </span>
              <span className="font-bebas text-white tracking-wider text-4xl">
                {profile?.firstName ?? "New"}
              </span>
              <span className="font-bebas text-white tracking-widest text-2xl">
                {profile?.lastName ?? "Issue"}
              </span>
              <canvas
                ref={Canvas}
                className="w-24 aspect-square border-2 border-gray-300"
              ></canvas>
              <span className="font-ranger card-signature absolute right-4 bottom-2 text-3xl">
                ITGG
              </span>
            </div>
          </div>
          {/* Form */}
          {!profile?.activated || isEditing ? (
            <form
              onSubmit={handleSubmit(handleConfirm)}
              className="z-20 flex flex-col items-start justify-start gap-y-2 text-white font-bebas text-xl font-light w-full"
            >
              <label>Username</label>
              <input
                type="text"
                {...register("userName", {
                  required: true,
                })}
                placeholder={""}
                required
                className="w-full bg-transparent tracking-widest font-kanit placeholder-white border-white border-4 px-2 py-1 rounded-xl"
              />
              <label>Gate</label>
              <select
                required
                className="text-white bg-transparent border-4 border-white w-full rounded-xl py-1 px-2"
                {...register("gate")}
              >
                <option className="text-dark" value={"AND"}>
                  And
                </option>
                <option className="text-dark" value={"OR"}>
                  Or
                </option>
                <option className="text-dark" value={"NOR"}>
                  Nor
                </option>
                <option className="text-dark" value={"NOT"}>
                  Not
                </option>
              </select>
              <div className="flex justify-around gap-x-2 w-full mt-4">
                <Submit
                  text="ยืนยัน"
                  ClassName={`${
                    isLoading ? "bg-gray" : "bg-secondary"
                  } w-full font-kanit  text-semidark rounded-lg py-2 px-2 text-xl font-semibold`}
                  noDefaultStyles={true}
                />
                <button
                  onClick={() => {
                    if (!isEditing) return router.push("/signout");
                    setEditing(false);
                  }}
                  className="w-full border-white border-2 text-white font-kanit rounded-lg py-2"
                >
                  {!isEditing ? "ออกจากระบบ" : "ยกเลิก"}
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full h-full mt-4 flex flex-col gap-y-2">
              <h1
                onClick={fetchData}
                className="font-bebas tracking-widest text-2xl z-20 text-white text-center"
              >
                Transaction Log
              </h1>
              {transactions.map((transaction, index) => {
                if (index > 3) return;

                return (
                  <div className="w-full flex flex-col z-20">
                    <div className="flex justify-between z-20 text-white text-2xl font-bebas">
                      <h3 className="z-20 tracking-widest">
                        {transaction.reason}
                      </h3>
                      <h3
                        className={`z-20 tracking-widest font-bold ${
                          transaction?.value > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.value}
                      </h3>
                    </div>
                    {/* <h5>{`${new Date(transaction.date).getUTCDate()}/${new Date(
                    transaction.date
                  ).getMonth()}`}</h5> */}
                  </div>
                );
              })}
              <div className="flex justify-around z-20 gap-x-4 justify-self-end font-kanit absolute bottom-6 inset-x-8">
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl w-full py-1 border-2 border-white"
                >
                  แก้ไขชื่อ
                </button>
                <button
                  className="rounded-xl w-full py-1 border-2 border-white"
                  onClick={() => router.push("/signout")}
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Wallet;
