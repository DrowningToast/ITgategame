import {
  ConditionalRedirect,
  firebaseReady,
  firebaseUserAtom,
  profileInfoAtom,
} from "firebase-auth-api";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { axiosBackendInstance } from "../components/axios/helper";

const Scan = () => {
  const [profile] = useAtom(profileInfoAtom);
  const [counter, setCounter] = useState<number>(0);
  const [_scanner, setScanner] = useState<QrScanner | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reason = useRef<HTMLInputElement>(null);
  const amount = useRef<HTMLInputElement>(null);
  const manual = useRef<HTMLInputElement>(null);
  const targets = useRef<string[]>([]);
  const [isPending, setPending] = useState<boolean>(false);

  // Initialize scanner
  useEffect(() => {
    if (!video.current || _scanner || profile?.role !== "Agency") return;
    const scanner = new QrScanner(video.current, (result: string) => {
      detectId(result);
    });
    setScanner(scanner);
    scanner.start();
  }, [video.current, profile]);

  useEffect(() => {
    targets.current = [...new Set(targets.current)];
    setCounter(new Date().getMilliseconds());
  }, [targets.current?.length]);

  const detectId = (result: string) => {
    targets.current.push(result);
    setCounter(new Date().getMilliseconds());
  };

  const onSubmit = async () => {
    try {
      setPending(true);
      targets.current = [...new Set(targets.current)];
      setCounter(counter + 1);

      let _r = reason.current?.value;
      let _a = amount.current?.value;
      const payload = {
        reason: _r,
        value: _a,
      };

      const results = [];

      for (const uid of targets.current) {
        results.push(
          await axiosBackendInstance.post(`/point/incremental/${uid}`, {
            ...payload,
          })
        );
        targets.current = targets.current.filter((id) => {
          return id !== uid;
        });
      }
      targets.current = [];
    } catch (e) {
      alert(e);
      console.error(e);
    }
    setPending(false);
  };

  return (
    <section className="bg-dark font-bebas w-full h-screen flex flex-col items-center justify-start py-12 px-8 gap-y-4">
      <ConditionalRedirect
        path="/"
        cb={(user, ready) => {
          return !user && ready;
        }}
      />
      {profile?.role === "Agency" && (
        <>
          <video className="aspect-square bg-white w-64" ref={video}></video>
          <label className="text-white text-2xl">Reason</label>
          <input
            ref={reason}
            required
            defaultValue={"Reward"}
            type="text"
            className="border-white border-2 w-full font-kanit"
          />
          <label className="text-white text-2xl">Amount</label>
          <input
            ref={amount}
            type="number"
            required
            defaultValue={0}
            className="border-white border-2 w-full font-kanit"
          />
          <label className="text-white text-2xl">Maunal</label>
          <input
            ref={manual}
            type="text"
            className="border-white border-2 w-full font-kanit"
          />
          <button
            onClick={() => {
              if (!manual.current?.value) return;
              targets.current.push(manual.current?.value);
              setCounter(new Date().getMilliseconds());
              manual.current.value = "";
            }}
            className="border-2 w-full text-2xl text-dark bg-secondary"
          >
            Add
          </button>
          <button
            onClick={() => {
              if (isPending) return;
              onSubmit();
            }}
            className={`${
              isPending ? "bg-red-500" : "bg-primary"
            } border-2 w-full text-2xl text-white`}
          >
            {!isPending ? "Submit" : "Loading"}
          </button>
          {targets?.current?.map((target, index) => {
            return (
              <div className="w-full-py-2 text-white text-xl border-2 w-full px-2 relative">
                {target}
                <span
                  onClick={() => {
                    const temp = [...targets.current];
                    temp.splice(index, 1);
                    targets.current = temp;
                    setCounter(counter + 1);
                  }}
                  className="absolute right-2 top-0 bottom-0 cursor-pointer"
                >
                  x
                </span>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
};

export default Scan;
