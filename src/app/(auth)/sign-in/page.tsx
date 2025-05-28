"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInComp() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // This avoids hydration mismatch
  }

  if (session) {
    return (
      <>
        Signed in as {session.user?.email}
        <br />
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
}
