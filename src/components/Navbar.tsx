"use client";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

export const Navbar = ({className} : React.ComponentProps<"p">) => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav className={cn(`mx-auto container border-2 py-2 `, className)}>
      <div className="flex justify-between items-center px-4">
        {session ? (
          <>
            <span>
              Welcome,{" "}
              {(user?.username
                ? user?.username?.[0].toUpperCase() + user?.username?.slice(1)
                : user?.email) ?? "User"}
            </span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
