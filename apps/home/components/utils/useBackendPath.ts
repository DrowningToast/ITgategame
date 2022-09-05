import useNodeEnv from "./useNodeEnv";

const useBackendPath = () => {
  const env = useNodeEnv();

  if (env === "development") {
    if (!process.env.NEXT_PUBLIC_Dev_Backend_URL) {
      return console.error("Missing DEV CMS URL in the .env");
    } else {
      return process.env.NEXT_PUBLIC_Dev_Backend_URL;
    }
  } else if (env === "production") {
    if (!process.env.NEXT_PUBLIC_Prod_Backend_URL) {
      return console.error("Missing PROD CMS URL in the .env");
    } else {
      return process.env.NEXT_PUBLIC_Prod_Backend_URL;
    }
  } else {
    throw `An error has occured`;
  }
};

export default useBackendPath;
