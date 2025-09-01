"use client"

import { Background } from "@/components/Background";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <BackgroundImage />

      <section className="py-32 flex justify-center items-center flex-col gap-6 px-6 ">
        <div className="flex flex-col justify-center items-center ">
          <>
            <h1 className="text-5xl font-bold text text-center leading-snug font-saira">
              <p className="text-5xl">Speak Freely.</p> Stay Anonymous
            </h1>
            <p className="text-center text-lg text-muted-foreground mt-4 max-w-xl">
              Send messages freely and safely without revealing your identity.
              Connect, express, and engage—no sign-ins required for sending
              messages.
            </p>
          </>
          <div className="flex flex-row gap-4 mt-8">
            <Button onClick={() => router.push("/sign-up")}>Get Started</Button>
            <Button onClick={() => router.push("/sign-in")} variant="outline">Learn More</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BackgroundImage() {
  return (
    <div className="min-h-[20rem] w-full fixed top-[20rem] -z-10">
      <div className="min-h-[20rem] w-full bg-background relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "hsl(var(--background))",
            backgroundImage: `
              linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
              `,

            backgroundSize: "40px 40px",
            backgroundPosition: "10px 20px",
          }}
        />
        {/* Your Content/Components */}
      </div>
    </div>
  );
}
