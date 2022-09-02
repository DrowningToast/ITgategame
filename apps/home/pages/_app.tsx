import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  AuthUpdater,
  firebaseUserAtom,
  profileInfoAtom,
} from "firebase-auth-api";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import {
  axiosBackendInstance,
  SetDefaultHeader,
} from "../components/axios/helper";

function MyApp({ Component, pageProps }: AppProps) {
  const [User] = useAtom(firebaseUserAtom);
  const [profile] = useAtom(profileInfoAtom);

  useEffect(() => {
    if (!User) return () => {};
    console.log("Attaching token to the axios header");
    if (!User?.token)
      return console.error(
        "Fatal error the authorized user is missing the token"
      );
    console.log(User);
    SetDefaultHeader(axiosBackendInstance, User?.token);
  }, [User]);

  return (
    <>
      <AuthUpdater />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
