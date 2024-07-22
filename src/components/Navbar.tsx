"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user;
  // =================================================
  return (
    <nav className="px-2 py-2 md:p-4 shadow-md">
      <div className="mx-auto flex flex-row justify-between items-center">
        <a
          className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-sky-900"
          href="/"
        >
          Anonimo
        </a>
        {session ? (
          <div className="flex gap-4 items-center">
            <div className="text-xs md:text-base flex max-md:flex-col">
              <span>Logged in as &nbsp;</span>{" "}
              <span className="text-sky-800">
                {user?.username || user?.email}
              </span>{" "}
            </div>
            <Button
              className="max-md:text-xs max-md:p-2"
              variant={"custom1"}
              onClick={() => signOut()}
            >
              Signout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button variant={"custom1"}>Signin</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
