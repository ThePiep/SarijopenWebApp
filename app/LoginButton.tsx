"use client";
import { Spinner } from "@/components/Spinner";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <button disabled className="btn-primary btn-sm ">
        <Spinner />
      </button>
    );
  }
  if (session) {
    return (
      <>
        <a className="btn normal-case ">{session.user?.name}</a>
        <button className={"btn  btn-sm "} onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      <button className={" btn "} onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
