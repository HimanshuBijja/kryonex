"use client";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = ({ className }: React.ComponentProps<"p">) => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav className={cn(` border-b-2 py-2 `, className)}>
      <div className="mx-auto container">
        <div className="flex justify-between items-center px-4">
          {session ? (
            <>
              <span>
                Welcome,{" "}
                {(user?.username
                  ? user?.username?.[0].toUpperCase() + user?.username?.slice(1)
                  : user?.email) ?? "User"}
              </span>
              <span className="flex ">
                <ToggleThemeButton />
                <Button onClick={() => signOut()}>Logout</Button>
              </span>
            </>
          ) : (
            <>
              <span>Using as Anonymous User</span>
              <span className="flex ">
                <ToggleThemeButton />
                <Link href="/sign-in">
                  <Button>Sign In</Button>
                </Link>
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function ToggleThemeButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    duration: 1000, // Optional: adjust animation duration
  });

  return (
    <div className="inline-block px-4 ">
      <div>
        <Button
          ref={ref}
          onClick={() => {
            toggleSwitchTheme();
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
    </div>
  );
}
