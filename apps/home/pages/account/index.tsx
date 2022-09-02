import { ConditionalRedirect, firebaseUserAtom } from "firebase-auth-api";
import { useAtom } from "jotai";

const Account = () => {
  const [user] = useAtom(firebaseUserAtom);

  console.log(true && user?.email);

  return (
    <>
      {/* Check if not signed in */}
      <ConditionalRedirect path="/" cb={(user) => !user?.email} />
      {user && (
        <div>
          <h1>{user?.displayName}</h1>
        </div>
      )}
    </>
  );
};

export default Account;
