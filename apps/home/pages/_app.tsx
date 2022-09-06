import "../styles/globals.scss";
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
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [User] = useAtom(firebaseUserAtom);
  const [Profile] = useAtom(profileInfoAtom);

  useEffect(() => {
    if (!User) return () => {};
    // console.log("Attaching token to the axios header");
    if (!User?.token)
      return console.error(
        "Fatal error the authorized user is missing the token"
      );
    if (axiosBackendInstance.defaults.headers.common["authorization"])
      return () => {};
    // console.log(Profile);
    SetDefaultHeader(axiosBackendInstance, User?.token);
  }, [User, Profile]);

  return (
    <>
      <AuthUpdater />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
