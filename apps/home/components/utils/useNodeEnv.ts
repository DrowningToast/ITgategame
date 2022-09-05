import { useEffect, useState } from "react";

const useNodeEnv = () => {
  return process.env.NODE_ENV;
};

export default useNodeEnv;
