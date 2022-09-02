import { NextPage } from "next";
import { firebaseUserAtom, SignOut } from "firebase-auth-api";
import { signinWithGooglePopUp } from "firebase-auth-api";
import { useAtom } from "jotai";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
  const [User] = useAtom(firebaseUserAtom);

  const router = useRouter();

  /**
   * @description Restrict the user to only use kmitl.ac.th
   * @param user
   */
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

  return (
    <div>
      <h1>hello world</h1>
      <button onClick={() => signinWithGooglePopUp(checkDomainName)}>
        Sign in with KMITL email
      </button>
    </div>
  );
};

export default SignIn;
