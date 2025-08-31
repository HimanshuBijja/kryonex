import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-[1000px]  my-6 px-4">{children}</div>
      <footer className=" absolute -bottom-10 w-full">
        <div className=" bg-black/80 text-white">hello</div>
      </footer>
    </>
  );
}
