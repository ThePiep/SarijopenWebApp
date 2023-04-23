"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <button disabled className="btn btn-primary ">
        Loading...
      </button>
    );
  }
  if (session) {
    return (
      <>
        <a className="btn btn-ghost  normal-case ">{session.user?.name}</a>
        <button className={"btn btn-primary "} onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      <button className={"btn btn-primary "} onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
