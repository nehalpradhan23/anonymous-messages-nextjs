"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="bg-gray-300 px-3 py-1 text-black m-4 rounded-md"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
