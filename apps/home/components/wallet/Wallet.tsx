import { profileInfoAtom } from "firebase-auth-api";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Text from "../forms/Text/Text";
import Select from "../forms/Select/Select";
import { useForm } from "react-hook-form";

const Wallet = () => {
  const [fallbackId, _] = useState<string>("");
  const [profile] = useAtom(profileInfoAtom);
  const Canvas = useRef<HTMLCanvasElement>(null);

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

  const { register, handleSubmit } = useForm();

  return (
    <>
      {profile && (
        <div className="flex flex-col px-12 gap-y-4">
          <h1 className="text-white font-bebas text-4xl tracking-wider z-20">
            {profile?.activated
              ? `Welcome back, ${profile.userName}`
              : "Let's us know you more before we start"}
          </h1>
          {/* Card */}
          <div className="w-full aspect-[9/15] bg-white rounded-xl z-20 relative overflow-hidden shadow-xl">
            {/* BG */}
            <div className="absolute inset-0 blur-[64px]">
              {/* Circle#1 */}
              <div className="bg-[#FFFFFF] w-[145%] aspect-square absolute left-0 top-0 transform -translate-y-1/2 rounded-full"></div>
              {/* Circle#2 */}
              <div className="bg-[#CAC0E5] w-[150%] aspect-square absolute left-0 -top-12 transform -translate-x-2/3 rounded-full"></div>
              {/* Circle#3 */}
              <div className="bg-[#2F4153] w-[200%] aspect-square absolute -left-12 bottom-0 transform translate-y-1/2 rounded-full"></div>
            </div>
            <div className="py-4 px-6 relative w-full h-full flex flex-col items-start justify-end">
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
          <form className="z-20 flex flex-col items-start justify-start text-white font-bebas text-2xl w-full">
            <label>Username</label>
            <Text
              r={register("username", {
                required: true,
              })}
              placeholder={"Something. . ."}
              noDefaultStyles
              ClassName="w-full px-2 py-2 rounded-xl"
            />
            <label>Gate</label>
            {/* @ts-ignore */}
            <Select
              noDefaultStyles
              ClassName="w-full px-2 py-2 rounded-xl text-dark"
              r={register("gate", { required: true })}
              options={[
                {
                  display: "And",
                  value: "AND",
                },
                {
                  display: "Or",
                  value: "OR",
                },
                {
                  display: "Nor",
                  value: "NOR",
                },
                {
                  display: "Not",
                  value: "NOT",
                },
              ]}
              visibleSize={4}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default Wallet;
